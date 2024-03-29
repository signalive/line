const Message = require('../lib/message');
const EventEmitterExtra = require('event-emitter-extra');
const assign = require('lodash/assign');
const forEach = require('lodash/forEach');
const isInteger = require('lodash/isInteger');
const isObject = require('lodash/isObject');
const debounce = require('lodash/debounce');
const Deferred = require('../lib/deferred');
const uuid = require('uuid');
const Debug = require('debug');
const LineError = require('../lib/error');
const CloseStatus = require('../lib/closestatus');

let debug;

/**
 * Server connection class. Constructor of this class is not publicly accessible.
 * When you listen `Server.Event.CONNECTION` or `Server.Event.HANDSHAKE`, an instance
 * of `ServerConnection` will be emitted.
 *
 * @class ServerConnection
 * @extends {EventEmitterExtra}
 * @private
 * @property {string} id Unique connection id
 */
class ServerConnection extends EventEmitterExtra {
    constructor(socket, server) {
        super();

        this.id = uuid.v4();
        debug = Debug(`line:server:connection:${this.id}`);
        debug(`Creating connection with id ${this.id} ...`);

        this.socket = socket;
        this.server = server;
        this.state = ServerConnection.State.AWAITING_HANDSHAKE;

        this.deferreds_ = {};
        this.autoPing_ = debounce(() => {});

        this.socket.on('message', this.onMessage_.bind(this));
        this.socket.on('error', this.onError_.bind(this));
        this.socket.on('close', this.onClose_.bind(this));

        this.idleTimeout = new Deferred();
        this.idleTimeoutDuration = server.options.pingInterval * 100;

        if (server.options.pingInterval > 0) {
            /**
             * Handle the weird rare state of connection where despite a successful closure residuals still remain in rooms.
             */
            this.idleTimeout = new Deferred({timeout:  this.idleTimeoutDuration, rejectOnExpire: false,
                onExpire: () => {
                    const persistsInRoot = !!this.server.rooms.root.getConnectionById(this.id);
                    const belongingRooms = this.getRooms().length;

                    if (persistsInRoot || belongingRooms !== 0) {
                        debug(`Could not dispose this connection somehow. ` +
                              `ReadyState = ${['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][this.socket.readyState]} | ` +
                              `Persists in root room: ${persistsInRoot} | ` +
                              `Belongs to this many rooms: ${belongingRooms}`);

                        this.server.rooms.removeFromAll(this);
                        this.server.rooms.root.remove(this);
                        this.state = ServerConnection.State.DISCONNECTED;
                        this.emit(ServerConnection.Event.DISCONNECTED,
                                  ServerConnection.ErrorCode.IDLE_TIMEOUT,
                                  `Stayed idle for ${this.idleTimeoutDuration}`);
                    }
                }
            })

            this.autoPing_ = debounce(() => {
                this
                    .ping()
                    .then(() => {

                        debug(`Auto-ping successful`);
                        this.idleTimeout.delay();

                        if (server.options.pingInterval > 0 && this.state == ServerConnection.State.CONNECTED) {
                            this.autoPing_();
                        } else {
                            debug(`Canceling auto-ping, state: ${this.state}`);
                        }
                    })
                    .catch((err) => {
                        /* Disconnection is handled in ping */
                        debug(`Auto-ping failed, state: ${this.state}`, err);
                    });
            }, server.options.pingInterval);
        }

        if (server.options.handshakeTimeout > 0) {
            this.handshakeTimeout_ = setTimeout(() => {
                if (this.state != ServerConnection.State.AWAITING_HANDSHAKE) {
                    return debug(`Handshake is not awaiting, ignoring handshake timeout...`);
                }

                debug(`Handshake timeout exceed, closing the connection...`);
                this.close(CloseStatus.HANDSHAKE_FAILED.code, `Handshake not completed after ${server.options.handshakeTimeout} ms`);
            }, server.options.handshakeTimeout);
        }
    }


    /**
     * Native "message" event handler.
     *
     * @param {string|Buffer} data
     * @param {Object} flags
     * @param {boolean} flags.binary Specifies if data is binary.
     * @param {boolean} flags.Boolean Specifies if data was masked.
     * @ignore
     */
    onMessage_(data, flags) {
        debug(`Native "message" event recieved: ${data}`);
        let message;

        // A message is recieved, debounce our auto-ping handler if connected
        if (this.state == ServerConnection.State.CONNECTED) {
            this.autoPing_();
        }

        try {
            message = Message.parse(data);
        } catch (err) {
            this.emit(ServerConnection.Event.ERROR, new LineError(
                ServerConnection.ErrorCode.INVALID_JSON,
                'Could not parse message, invalid json. Check payload for incoming data.',
                data
            ));
            return;
        }

        this.idleTimeout.delay();

        /**
         * Route the incoming message
         */
        if (message.name == Message.Name.HANDSHAKE) { // Handshake
            this.onHandshakeMessage_(message);
        } else if (message.name == Message.Name.PING) { // Ping
            this.onPingMessage_(message);
        } else if (message.name == Message.Name.RESPONSE) { // Message response
            this.onResponseMessage_(message);
        } else if (Message.ReservedNames.indexOf(message.name) == -1) { // If message name is not reserved
            if (!message.id) { // Message without response (no id fields)
                this.onMessageWithoutResponse_(message);
            } else { // Message arrived awaiting its response
                this.onMessageWithResponse_(message);
            }
        } else {
            debug(`Could not route the message`, message);
        }
    }


    /**
     * On "handshake" message handler.
     *
     * @param {Message} message
     * @ignore
     */
    onHandshakeMessage_(message) {
        if (this.state == ServerConnection.State.CONNECTED) {
            debug(`Handshake message recieved but, handshake is already resolved, ignoring...`);
            return this
                .sendWithoutResponse_(message.createResponse(new Error('Handshake is already resolved')))
                .catch(() => { /* Ignoring */ });
        }

        debug(`Handshake message recieved: ${message}`);

        /**
         * If handshake is resolved
         */
        message.once('resolved', (payload) => {
            debug(`Handshake is resolved, sending response...`);
            this.state = ServerConnection.State.CONNECTED;
            this.handshakeTimeout_ && clearTimeout(this.handshakeTimeout_);
            this.autoPing_(); // Start auto-pinging

            const responsePayload = {
                payload,
                id: this.id
            };

            this
                .sendWithoutResponse_(message.createResponse(null, responsePayload))
                .then(() => {
                    debug(`Handshake resolving response is sent, emitting connection...`);
                    this.server.rooms.root.add(this);
                    this.server.emit('connection', this);
                })
                .catch((err) => {
                    debug(`Could not send handshake response`, err);

                    // TODO: Emit these errors from the server
                    if (err instanceof LineError) {
                        switch (err.code) {
                            case ServerConnection.ErrorCode.DISCONNECTED:
                                debug(`Connection is gone before handshake completed, ignoring...`);
                                return;

                            case ServerConnection.ErrorCode.WEBSOCKET_ERROR:
                                // TODO: Try again!
                                debug(`Native websocket error`, err.payload);
                                return this.close(CloseStatus.HANDSHAKE_FAILED.code, CloseStatus.HANDSHAKE_FAILED.reason);

                            default:
                                debug(`Unhandled line error`, err);
                                return this.close(CloseStatus.HANDSHAKE_FAILED.code, CloseStatus.HANDSHAKE_FAILED.reason);
                        }
                    }

                    debug(`Unknown error`, err);
                    return this.close(CloseStatus.HANDSHAKE_FAILED.code, CloseStatus.HANDSHAKE_FAILED.reason);
                })
                .then(() => {
                    message.dispose();
                });
        });

        /**
         * Id handshake is rejected
         */
        message.once('rejected', (err) => {
            debug(`Handshake is rejected, sending response...`);

            this
                .sendWithoutResponse_(message.createResponse(err))
                .catch(err => debug(`Handshake rejecting response could not sent, manually calling "close"...`, err))
                .then(() => this.close(CloseStatus.HANDSHAKE_REJECTED.code, CloseStatus.HANDSHAKE_REJECTED.reason, 50))
                .then(() => {
                    message.dispose();
                });
        });

        /**
         * Emit handshake event from the server
         */
        debug(`Emitting server's "handshake" event...`);
        const handshakeListener = this.server.emit('handshake', this, message);

        if (!handshakeListener) {
            debug(`There is no handshake listener, resolving the handshake by default...`);
            message.resolve();
        }
    }


    /**
     * On "ping" message handler. Reply with pong.
     *
     * @param {Message} message
     * @ignore
     */
    onPingMessage_(message) {
        debug(`Ping received, responding with "pong"...`);

        this
            .sendWithoutResponse_(message.createResponse(null, 'pong'))
            .catch(err => debug(`Ping response failed to send back, ignoring for now...`, err));
    }


    /**
     * A message is recieved, and its response is expected.
     *
     * @param {Message} message
     * @ignore
     */
    onResponseMessage_(message) {
        const deferred = this.deferreds_[message.id];
        if (!deferred) return;

        if (message.err) {
            debug(`Response (rejecting) recieved: ${message}`);
            const err = new LineError(
                ServerConnection.ErrorCode.MESSAGE_REJECTED,
                'Message is rejected by server, check payload.',
                message.err
            );
            deferred.reject(err);
        } else {
            debug(`Response (resolving) recieved: ${message}`);
            deferred.resolve(message.payload);
        }

        delete this.deferreds_[message.id];
    }


    /**
     * A message is arrived without waiting its response.
     *
     * @param {Message} message
     * @ignore
     */
    onMessageWithoutResponse_(message) {
        debug(`Message without response: name="${message.name}"`);
        this.emit(message.name, message);
    }


    /**
     * A message is arrived and the client is expecting its response.
     *
     * @param {Message} message
     * @ignore
     */
    onMessageWithResponse_(message) {
        debug(`Message with response: name="${message.name}" id="${message.id}"`);

        message.once('resolved', (payload) => {
            debug(`Message #${message.id} is resolved, sending response...`);
            this
                .sendWithoutResponse_(message.createResponse(null, payload))
                .catch((err) => {
                    this.emit(ServerConnection.Event.ERROR, new LineError(
                        ServerConnection.ErrorCode.MESSAGE_NOT_RESPONDED,
                        `Message (name="${message.name}" id="${message.id}") could not responded (resolve)`,
                        err
                    ));
                })
                .then(() => message.dispose());
        });

        message.once('rejected', (err) => {
            debug(`Message #${message.id} is rejected, sending response...`);
            this
                .sendWithoutResponse_(message.createResponse(err))
                .catch((err) => {
                    this.emit(ServerConnection.Event.ERROR, new LineError(
                        ServerConnection.ErrorCode.MESSAGE_NOT_RESPONDED,
                        `Message (name="${message.name}" id="${message.id}") could not responded (reject)`,
                        err
                    ));
                })
                .then(() => message.dispose());
        });

        this.emit(message.name, message);
    }


    /**
     * Native "error" event.
     *
     * @param {Error} err
     * @ignore
     */
    onError_(err) {
        debug(`Native "error" event recieved, emitting line's "error" event: ${err}`);
        this.emit(ServerConnection.Event.ERROR, err);
    }


    /**
     * Native "close" event.
     *
     * @param {number} code
     * @param {string=} reason
     * @ignore
     */
    onClose_(code, reason) {
        debug(`Native "close" event recieved with code ${code}: ${reason}`);
        debug(`Removing connection from all rooms, rejecting all waiting messages...`);

        this.handshakeTimeout_ && clearTimeout(this.handshakeTimeout_);
        this.autoPing_.cancel();
        this.server.rooms.removeFromAll(this);
        this.server.rooms.root.remove(this);
        this.rejectAllDeferreds_(new LineError(ServerConnection.ErrorCode.DISCONNECTED, 'Socket connection closed!'));

        debug(`Emitting line's "close" event...`);
        this.state = ServerConnection.State.DISCONNECTED;
        this.emit(ServerConnection.Event.DISCONNECTED, code, reason);
        this.idleTimeout.dispose();
    }


    /**
     * Changes connection's id, it's random by default. This method is helpful if you already have
     * custom identification for your clients. You must do this before handshake resolved. If
     * handshake is already resolved or there is conflict, this method will throw error.
     *
     * Throws:
     * - `ServerConnection.ErrorCode.HANDSHAKE_ENDED`: Id could not be changed after handshake
     * - `ServerConnection.ErrorCode.ID_CONFLICT`: There is alrady another connection with provided id.
     *
     * @param {string} newId New connection id
     * @memberOf ServerConnection
     * @example
     * server.on(Server.Event.HANDSHAKE, (connection, handshake) => {
     *   // Assuming client's `options.handshake.payload` is something like `{authToken: '...'}`
     *
     *   // Imaginary db
     *   db.find(handshake.payload.authToken, (record) => {
     *     if (!record) return handshake.reject(new Error('Invalid auth token'));
     *     connection.setId(record.id);
     *     handshake.resolve(record);
     *   });
     * });
     */
    setId(newId) {
        if (this.state != ServerConnection.State.AWAITING_HANDSHAKE) {
            throw new LineError(
                ServerConnection.ErrorCode.HANDSHAKE_ENDED,
                'Handshake already ended, you cannot change connection id anymore'
            );
        }

        if (this.server.getConnectionById(newId)) {
            throw new LineError(
                ServerConnection.ErrorCode.ID_CONFLICT,
                `Conflict! There is already connection with id ${newId}`
            );
        }

        this.id = newId;
        debug = Debug(`line:server:connection:${this.id}`);
    }


    /**
     * Joins the connection into provided room. If there is no room, it will be created automatically.
     *
     * @param {string} roomName
     * @memberOf ServerConnection
     */
    joinRoom(roomName) {
        this.server.rooms.add(roomName, this);
    }


    /**
     * Leaves the connection from provided room.
     *
     * @param {string} roomName
     * @memberOf ServerConnection
     */
    leaveRoom(roomName) {
        this.server.rooms.remove(roomName, this);
    }



    /**
     * Gets the joined room names.
     *
     * @returns {Array<string>}
     * @memberOf ServerConnection
     */
    getRooms() {
        return this.server.rooms.getRoomsOf(this);
    }


    /**
     * Sends a message to client with awaiting its response. This method returns a promise
     * which resolves the payload parameter will be passed into `message.resolve(...)` in client-side.
     *
     * If client rejects the message with `message.reject(...)`, this promise will be rejected with
     * `ServerConnection.ErrorCode.MESSAGE_REJECTED`. You can access the original error object with `err.payload`.
     *
     * Rejections:
     * - `ServerConnection.ErrorCode.INVALID_JSON`: Could not stringify the message payload. Probably circular json.
     * - `ServerConnection.ErrorCode.MESSAGE_REJECTED`: Message is explicitly rejected by the client.
     * - `ServerConnection.ErrorCode.MESSAGE_TIMEOUT`: Message response did not arrived, timeout exceeded.
     * - `ServerConnection.ErrorCode.DISCONNECTED`: Client is not connected (& handshake resolved) or connection is closing
     * - `ServerConnection.ErrorCode.WEBSOCKET_ERROR`: Native websocket error
     *
     * @param {string} name
     * @param {any=} payload
     * @param {number=} timout
     * @returns {Promise<any>}
     * @memberOf ServerConnection
     * @example
     * connection
     *   .send('hello', {optional: 'payload'})
     *   .then((data) => {
     *     // Message is resolved by client
     *   })
     *   .catch((err) => {
     *     // Could not send message
     *     // or
     *     // Client rejected the message!
     *   });
     */
    send(name, payload, opt_timeout) { // This method is for external usage!
        if (this.state != ServerConnection.State.CONNECTED) {
            return Promise.reject(new LineError(
                ServerConnection.ErrorCode.DISCONNECTED,
                `Could not send message, client is not connected.`
            ));
        }

        try {
            const message = new Message({name, payload});
            return this.send_(message, opt_timeout);
        } catch (err) {
            // `err` can only be Message.ErrorCode.INVALID_JSON
            return Promise.reject(new LineError(
                ServerConnection.ErrorCode.INVALID_JSON,
                `Could not send message, "payload" stringify error. Probably circular json issue.`
            ));
        }
    }


    /**
     * Sends a message to client without waiting its response. This method returns a promise
     * that resolves with nothing if the message is successfully sent.
     *
     * Rejections:
     * - `ServerConnection.ErrorCode.INVALID_JSON`: Could not stringify the message payload. Probably circular json.
     * - `ServerConnection.ErrorCode.DISCONNECTED`: Client is not connected (& handshake resolved) or connection is closing
     * - `ServerConnection.ErrorCode.WEBSOCKET_ERROR`: Native websocket error
     *
     * @param {string} name
     * @param {any=} payload
     * @returns {Promise}
     * @memberOf ServerConnection
     * @example
     * connection
     *   .sendWithoutResponse('hello', {optional: 'payload'})
     *   .then(() => {
     *     // Message sent successfully
     *   })
     *   .catch((err) => {
     *     // Message could not be sent to client
     *   })
     */
    sendWithoutResponse(name, payload) { // For external usage
        if (this.state != ServerConnection.State.CONNECTED) {
            return Promise.reject(new LineError(
                ServerConnection.ErrorCode.DISCONNECTED,
                `Could not send message, client is not connected.`
            ));
        }

        try {
            const message = new Message({name, payload}); // Can throw Message.ErrorCode.INVALID_JSON
            return this.sendWithoutResponse_(message);
        } catch (err) {
            // `err` can only be Message.ErrorCode.INVALID_JSON
            return Promise.reject(new LineError(
                ServerConnection.ErrorCode.INVALID_JSON,
                `Could not send message, "payload" stringify error. Probably circular json issue.`
            ));
        }
    }


    /**
     * Base method for sending a message with timeout. Please favor this method internally
     * instead of using `send` method.
     *
     * Rejections:
     * - `ServerConnection.ErrorCode.MESSAGE_REJECTED`: Message is explicitly rejected by the client.
     * - `ServerConnection.ErrorCode.MESSAGE_TIMEOUT`: Message response did not arrived, timeout exceeded.
     * - `ServerConnection.ErrorCode.DISCONNECTED`: Client is not connected (& handshake resolved) or connection is closing
     * - `ServerConnection.ErrorCode.WEBSOCKET_ERROR`: Native websocket error
     *
     * @param {Message} message
     * @param {number=} opt_timeout
     * @returns {Promise}
     * @ignore
     */
    send_(message, opt_timeout) {
        const timeout = isInteger(opt_timeout) && opt_timeout >= 0 ? opt_timeout : this.server.options.responseTimeout;
        message.setId();

        const deferred = this.deferreds_[message.id] = new Deferred({
            onExpire: () => {
                delete this.deferreds_[message.id];
            },
            timeout: timeout
        });

        return this
            .sendWithoutResponse_(message)
            .then(() => deferred)
            .catch((err) => {
                deferred.dispose();

                // Convert expired -> timeout error
                if (err instanceof LineError && err.code == Deferred.ErrorCode.EXPIRED) {
                    throw new LineError(
                        ServerConnection.ErrorCode.MESSAGE_TIMEOUT,
                        `Message timeout! Its response did not recived after ${timeout} ms`
                    );
                }

                throw err;
            });
    }


    /**
     * Base method for sending a message without response. Please favor this method internally
     * instead of using `sendWithoutResponse` method.
     *
     * Rejections:
     * - `ServerConnection.ErrorCode.DISCONNECTED`: Client is not connected (& handshake resolved) or connection is closing
     * - `ServerConnection.ErrorCode.WEBSOCKET_ERROR`: Native websocket error
     *
     * @param {Message} message
     * @returns {Promise}
     * @ignore
     */
    sendWithoutResponse_(message) {
        if (!this.socket || this.socket.readyState != 1) {
            return Promise.reject(new LineError(
                ServerConnection.ErrorCode.DISCONNECTED,
                `Could not send message, there is no open connection.`
            ));
        }

        return new Promise((resolve, reject) => {
            debug(`Sending message: ${message}`);
            const messageStr = message.toString();

            this.socket.send(messageStr, (err) => {
                if (err) {
                    return reject(new LineError(
                        ServerConnection.ErrorCode.WEBSOCKET_ERROR,
                        `Could not send message, native websocket error, check payload.`,
                        err
                    ));
                }

                resolve();
            });
        });
    }


    /**
     * Pings the client. If there is no respose, closes the connection.
     *
     * @returns {Promise}
     * @memberOf ServerConnection
     */
    ping() {
        debug(`Pinging...`);
        return this
            .send_(new Message({name: Message.Name.PING}))
            .catch(err => {
                // No matter what error is, start disconnection process
                debug(`Auto-ping failed, manually disconnecting...`, err);
                this.close(CloseStatus.PING_FAILED.code, CloseStatus.PING_FAILED.reason);
                throw new LineError(
                    ServerConnection.ErrorCode.PING_ERROR,
                    `Ping failed, manually disconnecting...`,
                    err
                );
            });
    }


    /**
     * Gracefully closes the client connection.
     *
     * @param {number=} code
     * @param {string=} reason
     * @param {number=} delay
     * @returns {Promise}
     */
    close(code, reason, delay) {
        debug(`Closing the connection in ${delay || 0} ms with code: ${code}.`);
        return new Promise((resolve) => {
            setTimeout(() => {
                this.socket.close(code || 1000, reason);
            }, delay || 0);
        });
    }


    /**
     * Reject all the awaiting deferred with given error.
     *
     * @param {Error} err An error object to reject all awaiting deferreds.
     * @ignore
     */
    rejectAllDeferreds_(err) {
        forEach(this.deferreds_, deferred => deferred.reject(err));
        this.deferreds_ = {};
    }
}


/**
 * @static
 * @readonly
 * @enum {string}
 */
ServerConnection.ErrorCode = {
    /**
     * This error can be seen in rejection of `serverConnection.send()` method.
     */
    MESSAGE_TIMEOUT: 'scMessageTimeout',
    /**
     * This error can be seen in rejection of `serverConnection.send()` method,
     * which again indicates that server is explicitly rejected the message.
     */
    MESSAGE_REJECTED: 'scMessageRejected',
    /**
     * When the response of a message failed to send to client, this error
     * will be emitted in `ServerConnection.Event.ERROR` event.
     */
    MESSAGE_NOT_RESPONDED: 'cMessageNotResponded',
    /**
     * Indicates an error while json parsing/stringify.
     */
    INVALID_JSON: 'scInvalidJson',
    /**
     * This error can be thrown in `serverConnection.setId()`. Connection id
     * cannot be set after handshake.
     */
    HANDSHAKE_ENDED: 'scHandshakeEnded',
    /**
     * This error can be seen while using `serverConnection.setId()`. If there is
     * already connection with that id, this error will be thrown.
     */
    ID_CONFLICT: 'scIdConflict',
    /**
     * This error indicates client is disconnected.
     */
    DISCONNECTED: 'scDisconnected',
    /**
     * This error is for native websocket errors.
     */
    WEBSOCKET_ERROR: 'scWebsocketError',
    /**
     * This error can be seen in rejection of `serverConnection.ping()` method.
     */
    PING_ERROR: 'scPingError',
    /**
     * This error is thrown when a connection won't ping-pong for too long.
     */
    IDLE_TIMEOUT: 'scIdleTimeout'
};


/**
 * @static
 * @readonly
 * @enum {string}
 */
ServerConnection.State = {
    /**
     * `awaitingHandshake` Connection is open but handshake is not completed yet.
     */
    AWAITING_HANDSHAKE: 'awaitingHandshake',
    /**
     * `connected` Connection is open and handshake resolved.
     */
    CONNECTED: 'connected',
    /**
     * `disconnected` There is no open connection.
     */
    DISCONNECTED: 'disconnected'
};


/**
 * @static
 * @readonly
 * @enum {string}
 */
ServerConnection.Event = {
    /**
     * `_error`
     */
    ERROR: '_error',
    /**
     * `_close`
     */
    DISCONNECTED: '_disconnected'
};


module.exports = ServerConnection;

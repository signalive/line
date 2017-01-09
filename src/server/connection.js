const Utils = require('../lib/utils');
const Message = require('../lib/message');
const EventEmitterExtra = require('event-emitter-extra/dist/commonjs.modern');
const assign = require('lodash/assign');
const forEach = require('lodash/forEach');
const isObject = require('lodash/isObject');
const debounce = require('lodash/debounce');
const Deferred = require('../lib/deferred');
const uuid = require('node-uuid');


/**
 * Server connection class. Constructor of this class is not publicly accessible.
 * When you listen `Server.Events.CONNECTION` or `Server.Events.HANDSHAKE`, an instance
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

        this.socket = socket;
        this.server = server;

        this.deferreds_ = {};
        this.state = ServerConnection.States.OPEN;
        this.handshakeResolved_ = false;

        this.socket.on('message', this.onMessage_.bind(this));
        this.socket.on('error', this.onError_.bind(this));
        this.socket.on('close', this.onClose_.bind(this));

        this.autoPing_ = server.options.pingInterval > 0 ?
            debounce(() => {
                if (this.state != ServerConnection.States.OPEN)
                    return;

                this
                    .ping()
                    .then(() => {
                        if (server.options.pingInterval > 0 && this.state == ServerConnection.States.OPEN) {
                            this.autoPing_();
                        }
                    })
                    .catch(() => {});
            }, server.options.pingInterval) :
            () => {};
    }


    onMessage_(data, flags) {
        const message = Message.parse(data);

        this.autoPing_();

        // Emit original _message event with raw data
        this.emit(ServerConnection.Events.MESSAGE, data);

        // Message without response (no id fields)
        if (!message.id && Message.ReservedNames.indexOf(message.name) == -1)
            return this.emit(message.name, message);

        // Handshake
        if (message.name == Message.Names.HANDSHAKE) {
            return this.onHandshake_(message);
        }

        // Ping
        if (message.name == Message.Names.PING) {
            return this.onPing_(message);
        }

        // Message response
        if (message.name == Message.Names.RESPONSE && this.deferreds_[message.id]) {
            return this.onResponse_(message);
        }

        // Message with response
        message.once('resolved', payload => {
            this.send_(message.createResponse(null, payload));
            message.dispose();
        });

        message.once('rejected', err => {
            if (isObject(err) && err instanceof Error)
               err = assign({message: err.message, name: err.name}, err);
            this.send_(message.createResponse(err));
            message.dispose();
        });

        this.emit(message.name, message);
    }


    onHandshake_(message) {
        message.once('resolved', payload => {
            this.handshakeResolved_ = true;

            const responsePayload = {
                handshakePayload: payload,
                id: this.id,
                timeout: this.server.options.timeout,
                maxReconnectDelay: this.server.options.maxReconnectDelay,
                initialReconnectDelay: this.server.options.initialReconnectDelay,
                reconnectIncrementFactor: this.server.options.reconnectIncrementFactor,
                pingInterval: this.server.options.pingInterval
            };

            this
                .send_(message.createResponse(null, responsePayload))
                .then(() => {
                    this.server.rooms.root.add(this);
                    this.emit(ServerConnection.Events.HANDSHAKE_OK);
                })
                .catch(err => {
                    console.log(`Handshake resolve response failed to send for ${this.id}.`);
                    this.onClose_(500, err);
                })
                .then(() => {
                    message.dispose();
                });
        });

        message.once('rejected', err => {
            if (isObject(err) && err instanceof Error)
               err = assign({message: err.message, name: 'Error'}, err);

            this
                .send_(message.createResponse(err))
                .catch(err_ => {
                    console.log(`Handshake reject response failed to send for ${this.id}.`);
                })
                .then(() => {
                    this.onClose_(500, err);
                    message.dispose();
                });
        });

        // Sorry for party rocking
        const handshakeResponse = this.server.emit('handshake', this, message);

        if (!handshakeResponse)
            message.resolve();
    }


    onResponse_(message) {
        const deferred = this.deferreds_[message.id];

        if (message.err) {
            const err = assign(new Error(), message.err);
            deferred.reject(err);
        } else {
            deferred.resolve(message.payload);
        }

        delete this.deferreds_[message.id];
    }


    onPing_(message) {
        this
            .send_(message.createResponse(null, 'pong'))
            .catch(err => {
                console.log('Ping responce failed to send', err);
            });
    }


    onError_(err) {
        this.emit(ServerConnection.Events.ERROR, err);
        this.onClose_(500, err);
    }


    onClose_(code, message) {
        if (this.state == ServerConnection.States.CLOSE)
            return;

        this.server.rooms.removeFromAll(this);
        this.server.rooms.root.remove(this);

        forEach(this.deferreds_, (deferred) => {
            deferred.reject(new Error('Socket connection closed!'));
        });
        this.deferreds_ = {};

        this.state = ServerConnection.States.CLOSE;
        this.emit(ServerConnection.Events.CLOSE, code, message);
    }


    /**
     * Change connection's id, it's random by default. This method is helpful if you already have
     * custom identification for your clients. You must do this before handshake resolved. If
     * handshake is already resolved or there is conflict, this method will throw error.
     *
     * @param {string} newId New connection id
     * @memberOf ServerConnection
     */
    setId(newId) {
        if (this.handshakeResolved_)
            throw new Error('Handshake already resolved, you cannot change connection id anymore');

        if (this.server.getConnectionById(newId))
            throw new Error(`Conflict! There is already connection with id newId`);

        this.id = newId;
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
     * Sends a message to client and waits for its response.
     *
     * @param {string} eventName
     * @param {any=} payload
     * @returns {Promise<any>}
     * @memberOf ServerConnection
     * @example
     * connection
     *   .send('hello', {optional: 'payload'})
     *   .then(responsePayload => {
     *     // Message is resolved by client
     *   })
     *   .catch(err => {
     *     // Could not send message
     *     // or
     *     // Client rejected the message!
     *   });
     */
    send(eventName, payload) {
        const message = new Message({name: eventName, payload});
        message.setId();

        return this
            .send_(message)
            .then(_ => {
                const deferred = this.deferreds_[message.id] = new Deferred({
                    onExpire: () => {
                        delete this.deferreds_[message.id];
                    },
                    timeout: this.server.options.timeout
                });

                return deferred;
            });
    }


    /**
     * Sends a message to client without waiting response.
     *
     * @param {string} eventName
     * @param {any=} payload
     * @returns {Promise}
     * @memberOf ServerConnection
     * @example
     * connection
     *   .sendWithoutResponse('hello', {optional: 'payload'})
     *   .then(() => {
     *     // Message sent successfully
     *   })
     *   .catch(err => {
     *     // Message could not be sent to client
     *   })
     */
    sendWithoutResponse(eventName, payload) {
        const message = new Message({name: eventName, payload});
        return this.send_(message);
    }


    send_(message) {
        return new Promise((resolve, reject) => {
            this.socket.send(message.toString(), err => {
                if (err) return reject(err);
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
        return Utils
            .retry(_ => this.send(Message.Names.PING), {maxCount: 3, initialDelay: 1, increaseFactor: 1})
            .catch(err => {
                this.close(410, new Error('Ping failed, dead connection'));
                throw err;
            });
    }


    /**
     * Gracefully closes the client connection.
     *
     * @param {number} code
     * @param {any} data
     * @returns {Promise}
     */
    close(code, data) {
        return new Promise(resolve => {
            this.socket.close(code, data);
            resolve();
        });
    }
}


/**
 * @static
 * @readonly
 * @enum {string}
 */
ServerConnection.States = {
    /**
     * `open` Connection is alive and open.
     */
    OPEN: 'open',
    /**
     * `close` There is no alive connection.
     */
    CLOSE: 'close'
};


/**
 * @static
 * @readonly
 * @enum {string}
 */
ServerConnection.Events = {
    /**
     * `_message`
     */
    MESSAGE: '_message',
    /**
     * @ignore
     */
    HANDSHAKE_OK: '_handshakeOk', // Private
    /**
     * `_error`
     */
    ERROR: '_error',
    /**
     * `_close`
     */
    CLOSE: '_close'
};


module.exports = ServerConnection;

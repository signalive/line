const Message = require('../lib/message');
const EventEmitterExtra = require('event-emitter-extra');
const Deferred = require('../lib/deferred');
const assign = require('lodash/assign');
const forEach = require('lodash/forEach');
const debounce = require('lodash/debounce');
const isObject = require('lodash/isObject');
const isBoolean = require('lodash/isBoolean');
const isString = require('lodash/isString');
const isNumber = require('lodash/isNumber');
const isInteger = require('lodash/isInteger');
const defaultsDeep = require('lodash/defaultsDeep');
const debug = require('debug')('line:client');
const LineError = require('../lib/error');
const CloseStatus = require('../lib/closestatus');



/**
 * Line client class.
 *
 * @class Client
 * @extends {EventEmitterExtra}
 * @param {string=} url Server url, default: `ws://localhost`.
 * @param {Object=} options Options object.
 * @param {Object=} options.handshake Handshake options
 * @param {number=} options.handshake.timeout Handshake timeout duration in milliseconds.
 *      Default: `30000` (30 seconds).
 * @param {any=} options.handshake.payload Handshake payload that will be send to server.
 * @param {number=} options.responseTimeout This is the timeout for getting response from the server
 *      when using `client.send()` method. Default: `10000` (10 seconds). Note that this option is ineffective for
 *      `client.sendWithoutResponse()` method.
 * @param {number=} options.disconnectTimeout In some browsers, `close` frame is not fired immediately.
 *      This timeout is for starting `close` procedure even if close frame is not arrived. Default: `5000` (5 seconds).
 * @param {number=} options.pingInterval Pinging interval. Default: `20000` (20 seconds).
 * @param {boolean=} options.reconnect Whether try to reconnect server after unexpected disconnection,
 *      default `true`.
 * @param {Object=} options.reconnectOptions Reconnection options.
 * @param {number=} options.reconnectOptions.initialDelay In milliseconds. Default: `1000` (1 second).
 * @param {number=} options.reconnectOptions.multiply Default: `1.5`
 * @param {number=} options.reconnectOptions.maxDelay In milliseconds. Default: `30000`
 * @param {number=} options.reconnectOptions.randomness Random delay multiplier. Default: `0.5`
 * @param {boolean=} options.uptime Whether keep & calculate uptime, default `false`.
 *      If this option is not true, `client.getUptime()` returns undefined.
 * @param {Object=} options.uptimeOptions Uptime options.
 * @param {number=} options.uptimeOptions.interval Uptime checking interval. In milliseconds. Default: `5000` (5 seconds).
 * @param {number=} options.uptimeOptions.window Uptime checking window length. In milliseconds. Default: `300000` (5 minutes)
 * @param {boolean=} options.followRedirections Attempt to follow 30X redirections. If this options is set, after
 *      a native websocket connection error, line will try to make a http request to server url. If it is success,
 *      final response url will be used as server after couple of connection attempts. Default: `false`
 * @property {string} url Server url
 * @property {string} id Unique connection id assigned by the server. It will be accessible after handshake.
 * @property {Client.State} state Connection state
 * @example
 * // Add line-client to your html document
 * <script src="./node_modules/line-socket/dist/client-web-globals.js"></script>
 *
 * // For web browsers (consuming as a commonjs module)
 * const LineClient = require('line-socket/client-web');
 *
 * // For node.js
 * const LineClient = require('line-socket/client-node');
 *
 * // Usage
 * const client = new LineClient('ws://localhost:8080');
 * client.connect();
 */
class Client extends EventEmitterExtra {
    constructor(url = 'ws://localhost', options = {}) {
        super();

        if (!isString(url) || url.trim().length == 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, 'Url parameter must be string and cannot be empty');

        if (!isObject(options))
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, 'Options parameter must be an object');

        this.url = url.trim();
        this.urlFollowed = null;
        this.options = defaultsDeep(options, {
            handshake: {
                timeout: 30000,
                payload: undefined
            },
            responseTimeout: 10000,
            disconnectTimeout: 5000,
            pingInterval: 20000,
            reconnect: true,
            reconnectOptions: {
                initialDelay: 1000,
                multiply: 1.5,
                maxDelay: 30000,
                randomness: 0.5
            },
            uptime: false,
            uptimeOptions: {
                interval: 5000,
                window: 300000
            },
            followRedirections: false
        });


        if (!isObject(this.options.handshake))
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.handshake" must be an object`);

        if (!isInteger(this.options.handshake.timeout) || this.options.handshake.timeout < 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.handshake.timeout" must be a positive integer or zero`);

        try {
            JSON.stringify(this.options.handshake.payload);
        } catch (err) {
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.handshake.payload" must be json friendly, probably circular dependency?`);
        }

        if (!isInteger(this.options.responseTimeout) || this.options.responseTimeout < 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.responseTimeout" must be a positive integer or zero`);

        if (!isInteger(this.options.disconnectTimeout) || this.options.disconnectTimeout < 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.disconnectTimeout" must be a positive integer or zero`);

        if (!isInteger(this.options.pingInterval) || this.options.pingInterval < 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.pingInterval" must be a positive integer or zero`);

        if (!isBoolean(this.options.reconnect))
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.reconnect" must be a boolean`);

        if (!isObject(this.options.reconnectOptions))
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.reconnectOptions" must be an object`);

        if (!isInteger(this.options.reconnectOptions.initialDelay) || this.options.reconnectOptions.initialDelay <= 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.reconnectOptions.initialDelay" must be a positive integer`);

        if (!isNumber(this.options.reconnectOptions.multiply) || this.options.reconnectOptions.multiply < 1)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.reconnectOptions.multiply" must be a number >= 1`);

        if (!isInteger(this.options.reconnectOptions.maxDelay) || this.options.reconnectOptions.maxDelay <= 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.reconnectOptions.maxDelay" must be a positive integer`);

        if (this.options.reconnectOptions.maxDelay < this.options.reconnectOptions.initialDelay)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.reconnectOptions.maxDelay" must be a greater than initial delay`);

        if (!isNumber(this.options.reconnectOptions.randomness) || this.options.reconnectOptions.randomness < 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.reconnectOptions.randomness" must be a positive number or zero`);

        if (!isBoolean(this.options.uptime))
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.uptime" must be a boolean`);

        if (!isObject(this.options.uptimeOptions))
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.uptimeOptions" must be an object`);

        if (!isInteger(this.options.uptimeOptions.interval) || this.options.uptimeOptions.interval <= 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.uptimeOptions.interval" must be a positive integer`);

        if (!isInteger(this.options.uptimeOptions.window) || this.options.uptimeOptions.window <= 0)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.uptimeOptions.window" must be a positive integer`);

        if (this.options.uptimeOptions.window < this.options.uptimeOptions.interval)
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.uptimeOptions.window" must be a greater than interval`);

        if (!isBoolean(this.options.followRedirections))
            throw new LineError(Client.ErrorCode.INVALID_OPTIONS, `"options.followRedirections" must be a boolean`);

        this.ws_ = null;
        this.id = null;
        this.state = Client.State.READY;

        this.reconnectState_ = {disabled: false, attempt: 0, timeout: null};
        this.deferreds_ = {};
        this.disconnectTimeout_ = null;
        this.uptimeBuffer_ = [];
        this.uptimeBufferLength_ = Math.round(this.options.uptimeOptions.window / this.options.uptimeOptions.interval);
        this.uptimeInterval_ = options.uptime ? setInterval(this.uptimeTick_.bind(this), this.options.uptimeOptions.interval) : null;
        this.autoPing_ = debounce(() => {});

        if (this.options.pingInterval > 0) {
            this.autoPing_ = debounce(() => {
                this
                    .ping()
                    .then(() => {
                        // Ping successfull. If we still connected, debounce next one!
                        if (this.options.pingInterval > 0 && this.state == Client.State.CONNECTED) {
                            this.autoPing_(); // Recursive
                        }
                    })
                    .catch(() => { /* ping() method handles disconnection the logic itself */ });
            }, this.options.pingInterval);
        }
    }


    /**
     * Starts the connection procedure.
     *
     * If server url is invalid or there is a security error,
     * this method will throw `Client.ErrorCode.WEBSOCKET_ERROR`.
     *
     * When procedure is started, `Client.Event.CONNECTING` event will be emitted.
     *
     * If an error occured during connection or handshake, the client will emit `Client.Event.CONNECTING_ERROR`.
     *
     * If connection is failed for some reason and `options.reconnect` is `true`. The client will
     * retry to connect.
     *
     * @returns {boolean}
     * @example
     * client.connect();
     *
     * client.on(Client.Event.CONNECTED, () => {
     *   console.log('Client connected.');
     * });
     *
     * client.on(Client.Event.CONNECTING_ERROR, (err) => {
     *   console.log('Could not connect!', err);
     * });
     */
    connect() {
        switch (this.state) {
            case Client.State.DISCONNECTED:
            case Client.State.READY:
                let url = this.url;

                if (this.options.followRedirections && this.urlFollowed) {
                    url = this.urlFollowed;
                    debug(`Following redirection "${this.url}" -> "${this.urlFollowed}"`);
                }

                debug(`Connecting to "${url}" ...`);

                try {
                    this.reconnectState_.disabled = false;
                    this.ws_ = new WebSocket(url);
                    this.bindEvents_();
                    this.state = Client.State.CONNECTING;
                    this.emit(Client.Event.CONNECTING);
                    return true;
                } catch (err) {
                    throw new LineError(
                        Client.ErrorCode.WEBSOCKET_ERROR,
                        `Native websocket error. Invalid url or security error`,
                        err
                    );
                }

            default:
                debug(`Ignoring connect() call, client is in "${this.state}" state`);
                return false;
        }
    }


    /**
     * TODO: This is an experimental method currently, it's just used in tests.
     * DO NOT use in production.
     *
     * @returns {Promise}
     * @ignore
     */
    connectAsync() {
        return new Promise((resolve, reject) => {
            this.connect(); // Can throw WEBSOCKET_ERROR or ignore silently

            let removeListeners = () => {};

            const onConnectingError = (err) => {
                removeListeners();
                reject(err);
            };

            const onConnected = (data) => {
                removeListeners();
                resolve(data);
            };

            const onDisconnected = (e) => {
                removeListeners();
                reject(new LineError(Client.ErrorCode.DISCONNECTED, `Client disconnected`, e));
            };

            removeListeners = () => {
                this.removeListener(Client.Event.CONNECTING_ERROR, onConnectingError);
                this.removeListener(Client.Event.CONNECTED, onConnected);
                this.removeListener(Client.Event.DISCONNECTED, onDisconnected);
            }

            this.once(Client.Event.CONNECTING_ERROR, onConnectingError);
            this.once(Client.Event.CONNECTED, onConnected);
            this.once(Client.Event.DISCONNECTED, onDisconnected);
        });
    }


    /**
     * Gracefully closes the connection. This method can throw `Client.ErrorCode.WEBSOCKET_ERROR` if
     * provided parameters are invalid. If websocket is not closed after `options.disconnectTimeout` ms,
     * the client will start the disconnection procedure forcefully.
     *
     * @param {number=} code A numeric value indicating the status code explaining why the connection is being closed.
     *      Must be between 1000-4999. Default is 1000.
     * @param {any=} reason A human-readable string explaining why the connection is closing. This string must
     *      be no longer than 123 bytes of UTF-8 text (not characters).
     * @param {boolean=} opt_retry Whether retry to connect after disconnection.
     * @returns {boolean}
     * @example
     * client.disconnect();
     *
     * client.on(Client.Event.DISCONNECTED, (e) => {
     *   console.log('Disconnected', e.code, e.reason);
     * });
     */
    disconnect(code, reason, opt_retry) {
        switch (this.state) {
            case Client.State.CONNECTING:
            case Client.State.HANDSHAKING:
            case Client.State.CONNECTED:
                debug(`Disconnecting... (State: ${this.state})`);

                try {
                    this.ws_.close(code || 1000, reason); // Can throw INVALID_ACCESS_ERR, SYNTAX_ERR
                    debug(`Websocket is closed`);
                    this.reconnectState_.disabled = !opt_retry;
                    this.rejectAllDeferreds_(new LineError(Client.ErrorCode.DISCONNECTED, 'Disconnect procedure started'));
                    this.autoPing_.cancel();

                    // Wait "close" event for some time, then manually start onClose procedure
                    if (this.disconnectTimeout_) clearTimeout(this.disconnectTimeout_);
                    if (this.options.disconnectTimeout) {
                        this.disconnectTimeout_ = setTimeout(() => {
                            debug(`Disconnect timeout exceeded, force disconnecting...`);

                            this.emit(Client.Event.ERROR, new LineError(
                                Client.ErrorCode.DISCONNECT_TIMEOUT,
                                'Disconnect timeout exceeded, force disconnecting...'
                            ));

                            this.onClose_(CloseStatus.DISCONNECT_TIMEOUT);

                            clearTimeout(this.disconnectTimeout_);
                        }, this.options.disconnectTimeout);
                    }

                    this.state = Client.State.DISCONNECTING;
                    this.emit(Client.Event.DISCONNECTING);

                    return true;
                } catch (err) {
                    throw new LineError(
                        Client.ErrorCode.WEBSOCKET_ERROR,
                        'Could not disconnect. Invalid code or reason, check payload.',
                        err
                    );
                }

            default:
                debug(`Ignoring disconnect() call, client is in "${this.state}" state.`);
                return false;
        }
    }


    /**
     * TODO: This is an experimental method currently, it's just used in tests.
     * DO NOT use in production.
     *
     * @returns {Promise}
     * @ignore
     */
    disconnectAsync(code, reason, retry) {
        return new Promise((resolve, reject) => {
            this.disconnect(code, reason, retry); // Can throw WEBSOCKET_ERROR or ignore silently

            const onDisconnected = (e) => {
                // this.removeListener(Client.Event.DISCONNECTED, onDisconnected);
                resolve(e);
            };

            this.once(Client.Event.DISCONNECTED, onDisconnected);
        });
    }


    /**
     * Binds websocket events
     *
     * @ignore
     */
    bindEvents_() {
        debug('Binding native event handlers.');
        this.ws_.onopen = this.onOpen_.bind(this);
        this.ws_.onclose = this.onClose_.bind(this);
        this.ws_.onerror = this.onError_.bind(this);
        this.ws_.onmessage = this.onMessage_.bind(this);
    }


    /**
     * Unbinds websocket events
     *
     * @ignore
     */
    unBindEvents_() {
        if (!this.ws_) return;
        debug('Unbinding native event handlers.');
        this.ws_.onopen = function() {};
        this.ws_.onclose = function() {};
        this.ws_.onerror = function() {};
        this.ws_.onmessage = function() {};
    }


    /**
     * Native "open" event handler. At this time we will start the handshakin process.
     *
     * @ignore
     */
    onOpen_() {
        debug('Native "open" event received, starting handshake process');

        this.state = Client.State.HANDSHAKING;
        const message = new Message({
            name: Message.Name.HANDSHAKE,
            payload: this.options.handshake.payload // We're sure that this is json friendly
        });

        this
            .send_(message, this.options.handshake.timeout)
            .then(data => {
                // Message is sent and we got the response!
                if (!isObject(data)) {
                    debug('Unexpected handshake response!?');

                    this.emit(Client.Event.CONNECTING_ERROR, new LineError(
                        Client.ErrorCode.HANDSHAKE_ERROR,
                        'Handshake response is not object. Aborting handshake...',
                        data
                    ));

                    this.disconnect(CloseStatus.HANDSHAKE_FAILED.code, 'Handshake failed, unexpected handshake response.', true);
                    return;
                }

                debug('Handshake successful.');
                this.resetReconnectState_();
                this.id = data.id;
                this.state = Client.State.CONNECTED;
                this.autoPing_(); // Start auto-ping

                debug('Emitting "connected" event...');
                this.emit(Client.Event.CONNECTED, data.payload);
            })
            .catch(err => {
                if (err instanceof LineError) {
                    switch (err.code) {
                        case Client.ErrorCode.DISCONNECTED:
                            debug('Handshake failed, connection lost (disconnected)');
                            this.emit(Client.Event.CONNECTING_ERROR, new LineError(
                                Client.ErrorCode.HANDSHAKE_ERROR,
                                `Connection lost during handshake.`
                            ));
                            return;

                        case Client.ErrorCode.MESSAGE_TIMEOUT:
                            // TODO: Try again maybe?
                            debug('Handshake failed, message timeout');
                            this.emit(Client.Event.CONNECTING_ERROR, new LineError(
                                Client.ErrorCode.HANDSHAKE_ERROR,
                                'Handshake failed, request timeout.'
                            ));
                            return this.disconnect(CloseStatus.HANDSHAKE_FAILED.code, 'Handshake failed, request timeout.', true);

                        case Client.ErrorCode.MESSAGE_REJECTED:
                            debug('Handshake REJECTED!');
                            this.emit(Client.Event.CONNECTING_ERROR, new LineError(
                                Client.ErrorCode.HANDSHAKE_REJECTED,
                                'Handshake rejected, check payload for further details.',
                                err && err.payload
                            ));
                            return this.disconnect(CloseStatus.HANDSHAKE_REJECTED.code, 'Handshake rejected', true);

                        case Client.ErrorCode.WEBSOCKET_ERROR:
                            debug('Handshake failed, native websocket error');
                            this.emit(Client.Event.CONNECTING_ERROR, new LineError(
                                Client.ErrorCode.HANDSHAKE_ERROR,
                                `Handshake failed. Websocket protocol error, check payload.`,
                                err && err.payload
                            ));
                            return this.disconnect(CloseStatus.HANDSHAKE_FAILED.code, 'Handshake failed, native websocket error', true);

                        default:
                            debug('Handshake failed, unknown line error', err);
                            return this.disconnect(CloseStatus.HANDSHAKE_FAILED.code, 'Unknown line error', true);
                    }
                }

                // Unknown error
                debug('Handshake failed, unknown error', err);
                return this.disconnect(CloseStatus.HANDSHAKE_FAILED.code, 'Unknown error', true);
            });
    }


    /**
     * Native "close" event handler.
     *
     * @param {Event} closeEvent Native close event.
     * @param {number} closeEvent.code Close status code sent by server.
     * @param {string=} closeEvent.reason Human readable close reason.
     * @ignore
     */
    onClose_(closeEvent) {
        debug(`Native "close" event received in "${this.state}" state (code: ${closeEvent.code}, reason: ${closeEvent.reason})`);

        if (this.disconnectTimeout_) clearTimeout(this.disconnectTimeout_);
        this.rejectAllDeferreds_(new LineError(Client.ErrorCode.DISCONNECTED, 'Client is disconnected'));
        this.unBindEvents_();
        this.autoPing_.cancel();

        this.id = null;
        this.ws_ = null;

        debug('Emitting "disconnected" event...');
        this.state = Client.State.DISCONNECTED;
        this.emit(Client.Event.DISCONNECTED, closeEvent);

        if (this.options.reconnect && !this.reconnectState_.disabled) {
            let timeout = this.options.reconnectOptions.initialDelay *
                Math.max(this.options.reconnectOptions.multiply * this.reconnectState_.attempt, 1);
            timeout = Math.min(timeout, this.options.reconnectOptions.maxDelay);
            timeout += Math.round(Math.random() * this.options.reconnectOptions.randomness * timeout);

            debug(`Will try to reconnect in ${timeout} ms`);

            this.reconnectState_.timeout && clearTimeout(this.reconnectState_.timeout);
            this.reconnectState_.timeout = setTimeout(() => {
                this.reconnectState_.attempt++;
                this.connect();
            }, timeout);
        }
    }


    /**
     * Native "error" handler. A "close" event will ALWAYS follow this event.
     * See: https://www.w3.org/TR/websockets/#closeWebSocket
     * So, if client state is connecting/handshaking, emit `CONNECTING_ERROR`.
     *
     * @param {Error} err Native error object.
     * @ignore
     */
    onError_(err) {
        debug(`Native "error" event received in "${this.state}" state.`);
        let eventName = Client.Event.ERROR;

        if (this.state == Client.State.CONNECTING || this.state == Client.State.HANDSHAKING) {
            eventName = Client.Event.CONNECTING_ERROR;
        }

        this.emit(eventName, new LineError(
            Client.ErrorCode.WEBSOCKET_ERROR,
            `Native websocket error occured, check payload.`,
            err
        ));

        // For 30X redirects, we get this error: "Unexpected response code: 30X"
        // Attempt to make a http request to server url (this request will follow redirections).
        // If it is successful, use the final response url as websocket url
        if (this.options.followRedirections) {
            debug('Attempting to follow redirections...');
            const httpUrl = Client.ws2http(this.url);

            if (httpUrl) {
                debug(`Making a request to "${httpUrl}" for following`);
                Client
                    .fetchResponseUrl(httpUrl)
                    .then((httpUrlFollowed) => {
                        const wsUrl = Client.http2ws(httpUrlFollowed);
                        if (!wsUrl) return debug(`Could not convert http url "${httpUrlFollowed}" to ws`);
                        if (this.urlFollowed == wsUrl) return;
                        debug(`Updating followed url to "${wsUrl}"`);
                        this.urlFollowed = wsUrl;
                    })
                    .catch(err => debug('Could not follow redirection, ignoring...', err));
            } else {
                debug(`Could not convert ws url to http`);
            }
        }
    }


    /**
     * Native "message" handler.
     *
     * @param {Event} e Native message event.
     * @param {string} e.data Raw message data.
     * @ignore
     */
    onMessage_(e) {
        debug(`Native "message" event received in "${this.state}" state.`);
        let message;

        // A message is recieved, debounce our auto-ping handler
        if (this.state == Client.State.CONNECTED) {
            this.autoPing_();
        }

        /**
         * Try to parse incoming message
         */
        try {
            message = Message.parse(e.data);
        } catch (err) {
            debug('Could not parse message', e.data);
            this.emit(Client.Event.ERROR, new LineError(
                Client.ErrorCode.INVALID_JSON,
                'Could not parse incoming message, invalid json. Check payload for incoming data.',
                e.data
            ));
            return;
        }

        /**
         * Route the incoming message
         */
        if (message.name == Message.Name.PING) { // Ping message arrived
            this.onPingMessage_(message);
        } else if (message.name == Message.Name.RESPONSE) { // Response message arrive
            this.onResponseMessage_(message);
        } else if (Message.ReservedNames.indexOf(message.name) == -1) { // If message name is not reserved
            if (!message.id) { // A message arrived without response
                this.onMessageWithoutResponse_(message);
            } else { // A message arrived awaiting its response
                this.onMessageWithResponse_(message);
            }
        } else {
            debug(`Could not route the message`, message);
        }
    }


    /**
     * On "ping" message handler. Respond with "pong".
     *
     * @param {Message} message
     * @ignore
     */
    onPingMessage_(message) {
        debug('Ping received, responding "pong"...');

        this
            .sendWithoutResponse_(message.createResponse(null, 'pong'))
            .catch(err => debug('Ping response failed to send back, ignoring for now...', err));
    }


    /**
     * A response is arrived, find the related deferred and finalize it.
     *
     * @param {Message} message
     * @ignore
     */
    onResponseMessage_(message) {
        const deferred = this.deferreds_[message.id];

        if (!deferred)
            return debug(`Unknown message response, ignoring... (name="${message.name}" id="${message.id}")`);

        debug(`Message response arrived: name="${message.name}" id="${message.id}"`);

        if (message.err) {
            // Server rejects the message
            deferred.reject(new LineError(
                Client.ErrorCode.MESSAGE_REJECTED,
                'Message is rejected by server, check payload.',
                message.err
            ));
        } else {
            // Server resolves the message
            deferred.resolve(message.payload);
        }

        delete this.deferreds_[message.id];
    }


    /**
     * A message is arrived without awaiting a response.
     *
     * @param {Message} message
     * @ignore
     */
    onMessageWithoutResponse_(message) {
        debug(`Message without response: name="${message.name}"`);
        this.emit(message.name, message);
    }


    /**
     * A message is arrived and server is waiting for a response.
     *
     * @param {Message} message
     * @ignore
     */
    onMessageWithResponse_(message) {
        debug(`Message with response: name="${message.name}" id="${message.id}"`);

        message.once('resolved', (payload) => {
            debug(`Client resolving: name="${message.name}" id="${message.id}"`);

            // Try to send our response back to server, if not emit an error
            this
                .sendWithoutResponse_(message.createResponse(null, payload))
                .catch((err) => {
                    this.emit(Client.Event.ERROR, new LineError(
                        Client.ErrorCode.MESSAGE_NOT_RESPONDED,
                        `Message (name="${message.name}" id="${message.id}") could not responded (resolve)`,
                        err
                    ));
                })
                .then(() => message.dispose());
        });

        message.once('rejected', (err) => {
            debug(`Client rejecting: name="${message.name}" id="${message.id}"`);

            // Try to send our response back to server, if not emit an error
            this
                .sendWithoutResponse_(message.createResponse(err))
                .catch((err) => {
                    this.emit(Client.Event.ERROR, new LineError(
                        Client.ErrorCode.MESSAGE_NOT_RESPONDED,
                        `Message (name="${message.name}" id="${message.id}") could not responded (reject)`,
                        err
                    ));
                })
                .then(() => message.dispose());
        });

        this.emit(message.name, message);
    }


    /**
     * Sends a message to server with awaiting its response. This method returns a promise
     * which resolves the payload parameter will be passed into `message.resolve(...)` in server-side.
     *
     * If server rejects the message with `message.reject(...)`, this promise will be rejected with
     * `Client.ErrorCode.MESSAGE_REJECTED`. You can access the original error object with `err.payload`.
     *
     * Rejections:
     * - `Client.ErrorCode.INVALID_JSON`: Could not stringify the message payload. Probably circular json.
     * - `Client.ErrorCode.MESSAGE_REJECTED`: Message is explicitly rejected by the server.
     * - `Client.ErrorCode.MESSAGE_TIMEOUT`: Message response did not arrived, timeout exceeded.
     * - `Client.ErrorCode.DISCONNECTED`: Client is not connected or connection is closing
     * - `Client.ErrorCode.WEBSOCKET_ERROR`: Native websocket error (INVALID_STATE_ERR or SYNTAX_ERR)
     *
     * @param {string} name Message name.
     * @param {any=} payload Optional message payload.
     * @param {number=} timeout Timeout duration for waiting the response. If this parameter
     *      is not provided, `options.responseTimeout` will be used.
     * @returns {Promise}
     * @example
     * client
     *   .send('hello', {some: 'payload'})
     *   .then((data) => {
     *     console.log('Sent and got the response', data);
     *   })
     *   .catch((err) => {
     *     if (err.code == Client.ErrorCode.MESSAGE_REJECTED) {
     *       console.log('Message rejected by server', err.payload);
     *     } else if (err.code == Client.ErrorCode.MESSAGE_TIMEOUT) {
     *       console.log('Server did not responded, timeout exceeded');
     *     } else {
     *       console.log('Could not send message', err);
     *     }
     *   });
     */
    send(name, payload, opt_timeout) { // This method is for external usage!
        if (this.state != Client.State.CONNECTED) {
            return Promise.reject(new LineError(
                Client.ErrorCode.DISCONNECTED,
                `Could not send message, client is not connected.`
            ));
        }

        try {
            const message = new Message({name, payload});
            return this.send_(message, opt_timeout);
        } catch (err) {
            // `err` can only be Message.ErrorCode.INVALID_JSON
            return Promise.reject(new LineError(
                Client.ErrorCode.INVALID_JSON,
                `Could not send message, "payload" stringify error. Probably circular json issue.`
            ));
        }
    }


    /**
     * Sends a message to server without waiting its response. This method returns a promise
     * that resolves with nothing if the message is successfully sent.
     *
     * Rejections:
     * - `Client.ErrorCode.INVALID_JSON`: Could not stringify the message payload. Probably circular json.
     * - `Client.ErrorCode.DISCONNECTED`: Client is not connected or connection is closing
     * - `Client.ErrorCode.WEBSOCKET_ERROR`: Native websocket error (INVALID_STATE_ERR or SYNTAX_ERR)
     *
     * @param {string} name
     * @param {any=} payload
     * @returns {Promise}
     * @example
     * client
     *   .sendWithoutResponse('hello', {some: data})
     *   .then(() => {
     *     console.log('Message is sent');
     *   })
     *   .catch((err) => {
     *     console.log('Could not send message');
     *   });
     */
    sendWithoutResponse(name, payload) { // This method is for external usage!
        if (this.state != Client.State.CONNECTED) {
            return Promise.reject(new LineError(
                Client.ErrorCode.DISCONNECTED,
                `Could not send message, client is not connected.`
            ));
        }

        try {
            const message = new Message({name, payload}); // Can throw Message.ErrorCode.INVALID_JSON
            return this.sendWithoutResponse_(message);
        } catch (err) {
            // `err` can only be Message.ErrorCode.INVALID_JSON
            return Promise.reject(new LineError(
                Client.ErrorCode.INVALID_JSON,
                `Could not send message, "payload" stringify error. Probably circular json issue.`
            ));
        }
    }


    /**
     * Base method for sending a message with timeout. Please favor this method internally
     * instead of using `send` method.
     *
     * Rejections:
     * - `Client.ErrorCode.MESSAGE_REJECTED`: Message is explicitly rejected by the server.
     * - `Client.ErrorCode.MESSAGE_TIMEOUT`: Message response did not arrived, timeout exceeded.
     * - `Client.ErrorCode.DISCONNECTED`: Client is not connected or connection is closing
     * - `Client.ErrorCode.WEBSOCKET_ERROR`: Native websocket error (INVALID_STATE_ERR or SYNTAX_ERR)
     *
     * @param {Message} message
     * @param {number=} opt_timeout
     * @returns {Promise}
     * @ignore
     */
    send_(message, opt_timeout) {
        const timeout = isInteger(opt_timeout) && opt_timeout >= 0 ? opt_timeout : this.options.responseTimeout;
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
                        Client.ErrorCode.MESSAGE_TIMEOUT,
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
     * - `Client.ErrorCode.DISCONNECTED`: Client is not connected or connection is closing
     * - `Client.ErrorCode.WEBSOCKET_ERROR`: Native websocket error (INVALID_STATE_ERR or SYNTAX_ERR)
     *
     * @param {Message} message
     * @returns {Promise}
     * @ignore
     */
    sendWithoutResponse_(message) {
        if (!this.ws_ || this.ws_.readyState != 1) {
            return Promise.reject(new LineError(
                Client.ErrorCode.DISCONNECTED,
                `Could not send message, there is no open connection.`
            ));
        }

        return new Promise((resolve, reject) => {
            const messageStr = message.toString();

            try {
                debug(`Sending message: ${messageStr}`);
                this.ws_.send(messageStr); // Can throw INVALID_STATE_ERR, SYNTAX_ERR
                resolve();
            } catch (err) {
                reject(new LineError(
                    Client.ErrorCode.WEBSOCKET_ERROR,
                    'Could not send message. Either socket is not connected or syntax error, check payload.',
                    err
                ));
            }
        });
    }


    /**
     * Sends a ping message to server, if it's failed, the connection
     * will be closed and will retry to connect again. Server and client ping each
     * other automatically with an interval.
     *
     * @returns {Promise}
     */
    ping() {
        const currentSocket = this.ws_;

        debug('Pinging...');
        return this
            .send_(new Message({name: Message.Name.PING}))
            .catch(err => {
                // If socket is changed, dismiss
                if (this.ws_ != currentSocket) {
                    debug('Auto-ping failed, but socket is also changed, dismissing...');
                    return;
                }

                // No matter what error is, start disconnection process
                debug('Auto-ping failed, manually disconnecting...');
                this.disconnect(CloseStatus.PING_FAILED.code, 'Auto ping failed', true);
                throw new LineError(Client.ErrorCode.PING_ERROR, `Ping failed, disconnecting...`, err);
            });
    }


    /**
     * On uptime tick event handler. Check current state and push a marker to buffer.
     *
     * @ignore
     */
    uptimeTick_() {
        debug('Uptime Tick');
        this.uptimeBuffer_.push(this.state == Client.State.CONNECTED);

        if (this.uptimeBuffer_.length > this.uptimeBufferLength_) {
            this.uptimeBuffer_.splice(0, this.uptimeBufferLength_ - this.uptimeBuffer_.length);
        }
    }


    /**
     * Calculates (connection) uptime for last `options.uptime.window` (default 5 minutes)
     * with `options.uptime.interval` (default 5 seconds) interval. Returns a number between
     * 0 and 1. If `options.uptime` is false, this method returns nothing.
     *
     * @returns {number?}
     */
    getUptime() {
        if (!this.options.uptime) return;
        if (this.uptimeBuffer_.length == 0) return 0;
        return this.uptimeBuffer_.filter(val => val).length / this.uptimeBuffer_.length;
    }


    /**
     * Disposes the client.
     *
     * @returns {Promise}
     */
    dispose() {
        return new Promise((resolve) => {
            debug('Disposing...');

            switch (this.state) {
                case Client.State.CONNECTING:
                case Client.State.HANDSHAKING:
                case Client.State.CONNECTED:
                    this.once(Client.Event.DISCONNECTED, () => {
                        this.removeAllListeners();
                        this.uptimeBuffer_ = [];
                        if (this.uptimeInterval_) clearInterval(this.uptimeInterval_);
                        debug('Disposed!');
                        resolve();
                    });

                    this.disconnect(CloseStatus.DISPOSED.code, CloseStatus.DISPOSED.reason);
                    break;

                case Client.State.READY:
                case Client.State.DISCONNECTING:
                case Client.State.DISCONNECTED:
                    this.resetReconnectState_();
                    this.removeAllListeners();
                    this.uptimeBuffer_ = [];
                    if (this.uptimeInterval_) clearInterval(this.uptimeInterval_);
                    debug('Disposed!');
                    resolve();
                    break;
            }
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


    /**
     * Resets the reconnection state.
     *
     * @ignore
     */
    resetReconnectState_() {
        debug('Resetting reconnection state...');
        if (this.reconnectState_.timeout) clearTimeout(this.reconnectState_.timeout);
        this.reconnectState_ = {disabled: false, attempt: 0, timeout: null};
    }
}


Client.ws2http = function(url) {
    let rv;
    const mapping = {
        'ws://': 'http://',
        'wss://': 'https://'
    };
    forEach(mapping, (replace, target) => {
        if (url.indexOf(target) != 0) return;
        rv = replace + url.substr(target.length);
    });
    return rv;
};


Client.http2ws = function(url) {
    let rv;
    const mapping = {
        'http://': 'ws://',
        'https://': 'wss://'
    };
    forEach(mapping, (replace, target) => {
        if (url.indexOf(target) != 0) return;
        rv = replace + url.substr(target.length);
    });
    return rv;
};


Client.fetchResponseUrl = function(url, timeout = 3000) {
    return new Deferred({
        timeout,
        handler: (deferred) => {
            const req = new XMLHttpRequest();
            req.addEventListener('error', () => deferred.reject(new Error('Native XMLHttpRequest error')));
            req.addEventListener('abort', () => deferred.reject(new Error('Aborted XMLHttpRequest')));
            req.addEventListener('load', () => deferred.resolve(req.responseURL));
            req.open('HEAD', url);

            try {
                req.send();
            } catch (err) {
                deferred.reject(err);
            }
        }
    });
};


// Expose internal classes
Client.Message = Message;
Client.Error = LineError;


/**
 * @static
 * @readonly
 * @enum {string}
 */
Client.ErrorCode = {
    /**
     * When constructing `new Client()`, this error could be thrown.
     */
    INVALID_OPTIONS: 'cInvalidOptions',
    /**
     * Indicates an error while json parsing/stringify.
     */
    INVALID_JSON: 'cInvalidJSON',
    /**
     * This error can be emitted in `Client.Events.CONNECTING_ERROR` event.
     * It indicates an operational error during the handshake. If `options.reconnect` is true,
     * the client will try to reconnect again.
     */
    HANDSHAKE_ERROR: 'cHandshakeError',
    /**
     * This error can be emitted in `Client.Events.CONNECTING_ERROR` event.
     * It indicates that server is explicitly rejected the handshake, which probably means
     * client's handshake payload is not accepted by server.
     */
    HANDSHAKE_REJECTED: 'cHandshakeRejected',
    /**
     * This error can be seen in rejection of `client.send()` method. This means the
     * message is reached to server but the timeout is exceeded.
     */
    MESSAGE_TIMEOUT: 'cMessageTimeout',
    /**
     * This error can be seen in rejection of `client.send()` method, which again indicates that
     * server is explicitly rejected the message.
     */
    MESSAGE_REJECTED: 'cMessageRejected',
    /**
     * When the response of a message failed to send to server, this error
     * will be emitted in `Client.Event.ERROR` event.
     */
    MESSAGE_NOT_RESPONDED: 'cMessageNotResponded',
    /**
     * This error is for native websocket errors. Native error is wrapped by `LineError`
     * and can be accessible under `err.payload`.
     */
    WEBSOCKET_ERROR: 'cWebsocketError',
    /**
     * When disconnect timeout is exceed, this error will be emited in
     * `Client.Events.ERROR` event. After this event, the disconnect
     * procedure will be started forcefully.
     */
    DISCONNECT_TIMEOUT: 'cDisconnectError',
    /**
     * This error can be seen in rejection of `client.ping()` method. After this error,
     * client will be disconnected.
     */
    PING_ERROR: 'cPingError',
    /**
     * This error indicates the action is prohibited because client is not
     * in connected state or connection is closing.
     */
    DISCONNECTED: 'cDisconnected'
};



/**
 * @static
 * @readonly
 * @enum {string}
 */
Client.State = {
    /**
     * `ready`
     */
    READY: 'ready',
    /**
     * `connecting`
     */
    CONNECTING: 'connecting',
    /**
     * `handshaking`
     */
    HANDSHAKING: 'handshaking',
    /**
     * `connected`
     */
    CONNECTED: 'connected',
    /**
     * `disconnecting`
     */
    DISCONNECTING: 'disconnecting',
    /**
     * `disconnected`
     */
    DISCONNECTED: 'disconnected'
};


/**
 * @static
 * @readonly
 * @enum {string}
 */
Client.Event = {
    /**
     * `_connecting`
     */
    CONNECTING: '_connecting',
    /**
     * `_connecting_error`
     */
    CONNECTING_ERROR: '_connecting_error',
    /**
     * `_connected`
     */
    CONNECTED: '_connected',
    /**
     * `_disconnecting`
     */
    DISCONNECTING: '_disconnecting',
    /**
     * `_disconnected`
     */
    DISCONNECTED: '_disconnected',
    /**
     * `_error`
     */
    ERROR: '_error'
};


module.exports = Client;

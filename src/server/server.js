const Connection = require('./connection');
const Message = require('../lib/message');
const Rooms = require('./rooms');
const EventEmitterExtra = require('event-emitter-extra');
const debug = require('debug')('line:server');
const LineError = require('../lib/error');
const assign = require('lodash/assign');
const isInteger = require('lodash/isInteger');
const http = require('http');
const https = require('https');

let WebSocketServer;
let wslib;
try {
    WebSocketServer = require('uws').Server;
    wslib = 'uws';
} catch (err) {
    try {
        debug(`Could not find module uws lib, falling back to websocket lib`, err);
        WebSocketServer = require('websocket').server;
        wslib = 'websocket';
    } catch (err) {
        debug(`Could not find module websocket lib, falling back to ws lib`, err);
        WebSocketServer = require('ws').Server;
        wslib = 'ws';
    }
}

console.log('Continuing with', wslib);


/**
 * Line Server Class
 *
 * @class Server
 * @extends {EventEmitterExtra}
 * @param {Object=} options Options object.
 * @param {string=} options.host The hostname where to bind the server. [Inherited from uws.](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback)
 * @param {number=} options.port The port where to bind the server. [Inherited from uws.](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback)
 * @param {http.Server=} options.server A pre-created Node.js HTTP server. If provided, `host` and `port`
 *      will ignored. [Inherited from uws.](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback)
 * @param {string=} options.path Accept only connections matching this path. [Inherited from uws](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback)
 * @param {number=} options.responseTimeout Default timeout duration (in ms) for message responses. Default: `10000` (10 seconds)
 * @param {number=} options.handshakeTimeout This is the duration how long a client can stay connected
 *      without handshake. Default `60000` (1 minute).
 * @param {number=} options.pingInterval Ping interval in ms. Default: 15 seconds.
 * @example
 * const Server = require('line-socket/server');
 * const server = new Server({
 *   port: 8080
 * });
 */
class Server extends EventEmitterExtra {
    constructor(options = {}) {
        super();

        this.wslib = wslib;

        this.options = assign({
            responseTimeout: 10000,
            handshakeTimeout: 60000,
            pingInterval: 15000
        }, options);

        if (!isInteger(this.options.responseTimeout) || this.options.responseTimeout < 0)
            throw new LineError(Server.ErrorCode.INVALID_OPTIONS, `"options.responseTimeout" must be a positive integer or zero`);

        if (!isInteger(this.options.handshakeTimeout) || this.options.handshakeTimeout < 0)
            throw new LineError(Server.ErrorCode.INVALID_OPTIONS, `"options.handshakeTimeout" must be a positive integer or zero`);

        if (!isInteger(this.options.pingInterval) || this.options.pingInterval < 0)
            throw new LineError(Server.ErrorCode.INVALID_OPTIONS, `"options.pingInterval" must be a positive integer or zero`);

        this.rooms = new Rooms();

        debug(`Initalizing with options: ${JSON.stringify(this.options)}`);
    }

    /**
     * Starts the server.
     *
     * @returns {Promise}
     * @memberOf Server
     * @example
     * server
     *   .start()
     *   .then(() => {
     *     console.log('Server started');
     *   })
     *   .catch((err) => {
     *     console.log('Server could not started', err);
     *   });
     */
    start() {
        if (this.server) {
            return Promise.reject(new LineError(
                Server.ErrorCode.INVALID_ACTION,
                `Could not start server, already started!`
            ));
        }

        // if (!this.options.port) {
        //     debug(`Starting without port...`);

        //     try {
        //         this.server = new WebSocketServer(this.options);
        //         this.bindEvents_();
        //         return Promise.resolve();
        //     } catch (err) {
        //         return Promise.reject(new LineError(
        //             Server.ErrorCode.WEBSOCKET_ERROR,
        //             `Could not start the server, websocket error, check payload`,
        //             err
        //         ));
        //     }
        // }


        debug(`Starting with port "${this.options.port}" ...`);


        if (this.wslib == 'websocket') {
            if (this.options.secure)
                this.httpServer = https.createServer();
            else
                this.httpServer = http.createServer();

            this.server = new WebSocketServer({httpServer: this.httpServer});
            this.bindEvents_();

            return new Promise((resolve, reject) => {
                this.httpServer.listen(this.options.port, err => {
                    if (err) {
                        debug(`Could not start: ${err}`);
                        return reject(new LineError(
                            Server.ErrorCode.WEBSOCKET_ERROR,
                            `Could not start the server, websocket error, check payload`,
                            err
                        ));
                    }

                    resolve();
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                this.server = new WebSocketServer(this.options, err => {
                    if (err) {
                        debug(`Could not start: ${err}`);
                        return reject(new LineError(
                            Server.ErrorCode.WEBSOCKET_ERROR,
                            `Could not start the server, websocket error, check payload`,
                            err
                        ));
                    }

                    resolve();
                });

                this.bindEvents_();
            });
        }
    }


    /**
     * Stops the server.
     *
     * @returns {Promise}
     * @memberOf Server
     * @example
     * server
     *   .stop()
     *   .then(() => {
     *     console.log('Server stopped');
     *   })
     *   .catch((err) => {
     *     console.log('Server could not stopped', err);
     *   });
     */
    stop() {
        if (!this.server) {
            debug(`Could not stop server. Server is probably not started, or already stopped.`);
            return Promise.reject(new LineError(
                Server.ErrorCode.INVALID_ACTION,
                `Could not stop server. Server is probably not started, or already stopped!`
            ));
        }

        return new Promise(resolve => {
            debug(`Closing and disposing the server...`);
            if (this.wslib == 'websocket') {
                this.server.shutDown();
                this.httpServer.close(() => {
                    this.server = null;
                    resolve();
                });
            } else {
                this.server.close();
                this.server = null;
                resolve();
            }
        });
    }


    /**
     * Binds websocket server events.
     *
     * @ignore
     */
    bindEvents_() {
        debug(`Binding server events...`);

        if (this.wslib == 'websocket') {
            this.server.on('request', this.onRequest_.bind(this));
            this.server.on('connect', this.onConnection_.bind(this));
        } else {
            this.server.on('connection', this.onConnection_.bind(this));
            this.server.on('headers', this.onHeaders_.bind(this));
        }

        this.server.on('error', this.onError_.bind(this));
    }

    onRequest_(request) {
        const connection = request.accept(null, request.origin);
    }


    /**
     * Native "connection" event handler.
     *
     * @param {WebSocket} socket
     * @ignore
     */
    onConnection_(socket) {
        debug(`Native "connection" event recieved, creating line connection...`);
        const connection = new Connection(socket, this);
    }


    /**
     * Native "headers" event handler.
     *
     * @param {Array} headers
     * @ignore
     */
    onHeaders_(headers) {
        debug(`Native "headers" event recieved, emitting line's "headers" event... (${headers})`);
        this.emit(Server.Event.HEADERS, headers);
    }


    /**
     * Native "error" event handler.
     *
     * @param {Error} err
     * @ignore
     */
    onError_(err) {
        debug(`Native "error" event recieved, emitting line's "error" event... (${err})`);
        this.emit(Server.Event.ERROR, err);
    }


    /**
     * Returns a object where keys are connection id and values are ServerConnection.
     *
     * @returns {{string: ServerConnection}}
     * @memberOf Server
     */
    getConnections() {
        return this.rooms.root.getConnections();
    }


    /**
     * Gets a connection by id
     *
     * @param {string} id Unique connection id, which can be accessed at `connection.id`
     * @returns {?ServerConnection}
     * @memberOf Server
     * @example
     * const connection = server.getConnectionById('someId');
     *
     * if (connection) {
     *   connection.send('hello', {optional: 'payload'});
     * }
     */
    getConnectionById(id) {
        return this.rooms.root.getConnectionById(id);
    }


    /**
     * Broadcasts a message to all the connected (& handshaked) clients.
     *
     * @param {string} name Message name
     * @param {any=} payload Optional message payload.
     * @memberOf Server
     * @example
     * server.broadcast('hello', {optional: 'payload'});
     */
    broadcast(name, payload) {
        debug(`Broadcasting "${name}" message...`);
        this.rooms.root.broadcast(name, payload); // Can throw INVALID_JSON
    }


    /**
     * Gets a room by name.
     * @param {string} room Room name
     * @returns {?ServerRoom}
     */
    getRoom(room) {
        return this.rooms.getRoom(room);
    }

    /**
     * Gets all the rooms of a connection.
     * @param {ServerConnection} connection
     * @returns {Array.<string>} Array of room names.
     */
    getRoomsOf(connection) {
        return this.rooms.getRoomsOf(connection);
    }


    /**
     * Remove a connection from all the rooms.
     * @param {ServerConnection} connection
     */
    removeFromAllRooms(connection) {
        this.rooms.removeFromAll(connection);
    }
}


// Expose internal classes
Server.Message = Message;
Server.Connection = Connection;
Server.Error = LineError;


/**
 * @static
 * @readonly
 * @enum {string}
 */
Server.ErrorCode = {
    /**
     * When constructing `new Server()`, this error could be thrown.
     */
    INVALID_OPTIONS: 'sInvalidOptions',
    /**
     * This error can be seen in rejection of `server.start()` or `server.stop()` methods.
     */
    INVALID_ACTION: 'sInvalidAction',
    /**
     * This error is for native websocket errors.
     */
    WEBSOCKET_ERROR: 'sWebsocketError'
};


/**
 * @static
 * @readonly
 * @enum {string}
 * @example
 * server.on('connection', (connection) => {
 *   connection.send('hello');
 *   ...
 * });
 *
 * // or better, you can use enums
 *
 * server.on(Server.Event.CONNECTION, (connection) => {
 *   connection.send('hello');
 *   ...
 * });
 *
 * // If you want to authorize your client
 * server.on('handshake', (connection, handshake) => {
 *   if (handshake.payload && handshake.payload.authToken == '...')
 *     handshake.resolve({welcome: 'bro'});
 *   else
 *     handshake.reject(new Error('Invalid auth token'));
 * });
 */
Server.Event = {
    /**
     * `handshake` When a client connection is established, this event will be fired before
     * `connection` event. Please note that, this event has nothing in common with native websocket
     * handshaking process. If you want to authorize your clients, you must listen this event and
     * call `handshake.resolve(...)` or `handshake.reject(...)` accordingly. If you do not consume
     * this events, all the client connections will be accepted.
     *
     * ```
     * function (connection, handshake) {}
     * ```
     *
     * where `connection` is `ServerConnection` and `handshake` is a `Message` instance.
     */
    HANDSHAKE: 'handshake',
    /**
     * `connection` This event will fire on a client connects **after successful handshake**.
     *
     * ```
     * function (connection) {}
     * ```
     *
     * where `connection` is a `ServerConnection` instance.
     */
    CONNECTION: 'connection',
    /**
     * `'headers'` Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#event-headers)
     */
    HEADERS: 'headers',
    /**
     * `'error'` Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#event-error)
     */
    ERROR: 'error'
};


module.exports = Server;

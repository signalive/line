const WebSocketServer = require('uws').Server;
const Connection = require('./connection');
const Rooms = require('./rooms');
const EventEmitterExtra = require('event-emitter-extra/dist/commonjs.modern');
const debug = require('debug')('line:server');


/**
 * Line Server Class
 * Documentation is here deneme
 *
 * @class Server
 * @extends {EventEmitterExtra}
 * @param {Object=} options Options object.
 * @param {string=} options.host Server host name. Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {number=} options.port Server port. Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {http.Server=} options.server Server object to be attached. If provided, `host` and `port` will ignored. Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {Function=} options.handleProtocols Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#optionshandleprotocols).
 * @param {string=} options.path Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {boolean=} options.noServer Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {boolean=} options.clientTracking Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {Object=} options.perMessageDeflate Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#optionspermessagedeflate).
 * @param {number=} options.timeout Timeout duration (in ms) for message responses. Default: 10 seconds
 * @param {number=} options.maxReconnectDelay Maximum reconnection delay (in seconds) for clients. Default: 60 seconds
 * @param {number=} options.initialReconnectDelay Intial reconnection delay (in seconds) for clients. Defualt: 1 seconds
 * @param {number=} options.reconnectIncrementFactor Reconnection incremental factor for clients. Default: 1.5
 * @param {number=} options.pingInterval Ping interval (in ms) for both server and client. Default: 30 seconds.
 * @example
 * const Server = require('line-socket/server');
 * const server = new Server({
 *   port: 8080
 * });
 */
class Server extends EventEmitterExtra {
    constructor(options = {}) {
        super();

        this.rooms = new Rooms();

        this.options = Object.assign({
            timeout: 10000,
            maxReconnectDelay: 60,
            initialReconnectDelay: 1,
            reconnectIncrementFactor: 1.5,
            pingInterval: 30000
        }, options);

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
        if (!this.options.port) {
            debug(`Starting without port...`);
            this.server = new WebSocketServer(this.options);
            this.bindEvents();
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            debug(`Starting with port "${this.options.port}" ...`);

            this.server = new WebSocketServer(this.options, err => {
                if (err) {
                    debug(`Could not start: ${err}`);
                    return reject(err);
                }

                this.bindEvents();
                resolve();
            });
        })
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
            const err = new Error('Could not stop server. Server is probably not started, or already stopped.');
            return Promise.reject(err);
        }

        return new Promise(resolve => {
            debug(`Closing and disposing the server...`);
            this.server.close();
            this.server = null;
            resolve();
        });
    }


    bindEvents() {
        debug(`Binding server events...`);

        this.server.on('connection', this.onConnection.bind(this));
        this.server.on('headers', this.onHeaders.bind(this));
        this.server.on('error', this.onError.bind(this));
    }


    onConnection(socket) {
        debug(`Native "connection" event recieved, creating line connection...`);
        const connection = new Connection(socket, this);

        connection.on(Connection.Events.HANDSHAKE_OK, () => {
            debug(`Handshake OK, emitting line's "connection" event...`);
            this.emit(Server.Events.CONNECTION, connection);
        });
    }


    onHeaders(headers) {
        debug(`Native "headers" event recieved, emitting line's "headers" event... (${headers})`);
        this.emit(Server.Events.HEADERS, headers);
    }


    onError(err) {
        debug(`Native "error" event recieved, emitting line's "error" event... (${err})`);
        this.emit(Server.Events.ERROR, err);
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
     * if (connection)
     *   connection.send('hello', {world: ''});
     */
    getConnectionById(id) {
        return this.rooms.root.getConnectionById(id);
    }


    /**
     * Broadcasts a message to all the connected clients.
     *
     * @param {string} eventName Event name
     * @param {any=} payload Optional message payload.
     * @memberOf Server
     * @example
     * server.broadcast('hello', {world: ''});
     */
    broadcast(eventName, payload) {
        debug(`Broadcasting "${eventName}" event...`);
        this.rooms.root.broadcast(eventName, payload);
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
 * // or
 *
 * server.on(Server.Events.CONNECTION, (connection) => {
 *   connection.send('hello');
 *   ...
 * });
 *
 * // If you want to authorize your client
 * server.on('handshake', (connection, handshake) => {
 *   if (handshake.payload.token == 'test')
 *     handshake.resolve();
 *   else
 *     handshake.reject(new Error('Invalid token'));
 * });
 */
Server.Events = {
    /**
     * `'connection'` This event will fire on a client connects **after successful handshake**.
     *
     * ```
     * function (connection) {}
     * ```
     *
     * where `connection` is a `ServerConnection` instance.
     */
    CONNECTION: 'connection',
    /**
     * `'handshake'` When a client connection is established, this event will be fired before
     * `connection` event. If you want to authorize your clients, you must listen this event and
     * call `handshake.resolve(payload)` or `handshake.reject(err)` accordingly. If you do not consume
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
     * `'headers'` Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#event-headers)
     */
    HEADERS: 'headers',
    /**
     * `'error'` Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#event-error)
     */
    ERROR: 'error'
};


module.exports = Server;

import {Server as WebSocketServer} from 'uws';
import Connection from './connection';
import Rooms from './rooms';
import EventEmitter from 'event-emitter-extra/dist/commonjs.modern';


class Server extends EventEmitter {
    constructor(options) {
        super();

        this.rooms = new Rooms();

        this.options = Object.assign({
            timeout: 30000,
            maxReconnectDelay: 60,
            initialReconnectDelay: 1,
            reconnectIncrementFactor: 1,
            pingInterval: 60000
        }, options || {});
    }

    start() {
        if (!this.options.port) {
            this.server = new WebSocketServer(this.options);
            this.bindEvents();
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.server = new WebSocketServer(this.options, err => {
                if (err) return reject(err);
                this.bindEvents();
                resolve();
            });
        })
    }


    stop() {
        if (!this.server) {
            const err = new Error('Could not stop server. Server is probably not started, or already stopped.');
            return Promise.reject(err);
        }

        return new Promise(resolve => {
            this.server.close();
            this.server = null;
            resolve();
        });
    }


    bindEvents() {
        this.server.on('connection', this.onConnection.bind(this));
        this.server.on('headers', this.onHeaders.bind(this));
        this.server.on('error', this.onError.bind(this));
    }


    onConnection(socket) {
        const connection = new Connection(socket, this);
        connection.on(Connection.Events.HANDSHAKE_OK, () => this.emit(Server.Events.CONNECTION, connection));
    }


    onHeaders(headers) {
        this.emit(Server.Events.HEADERS, headers);
    }


    onError(err) {
        this.emit(Server.Events.ERROR, err);
    }


    getConnectionById(id) {
        return this.rooms.getRoom('/').getConnectionById(id);
    }


    broadcast(eventName, payload) {
        return this.rooms.getRoom('/').broadcast(eventName, payload);
    }
}


Server.Events = {
    CONNECTION: 'connection',
    HANDSHAKE: 'handshake',
    HEADERS: 'headers',
    ERROR: 'error'
};


module.exports = Server;
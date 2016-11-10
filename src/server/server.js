import {Server as WebSocketServer} from 'uws';
import Connection from './connection';
import Rooms from './rooms';
import {EventEmitter} from 'events';


class Server extends EventEmitter {
	constructor(options) {
		super();
		this.rooms = new Rooms();
		this.options = options;
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

	bindEvents() {
		this.server.on('connection', this.onConnection.bind(this));
	}

	onConnection(socket) {
		const connection = new Connection(socket, this);
		this.emit('connection', connection);
	}


}

module.exports = Server;
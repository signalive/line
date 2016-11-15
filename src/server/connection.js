import Message from '../lib/message';
import EventEmitter from 'event-emitter-extra';
import * as _ from 'lodash';
import * as uuid from 'node-uuid';


class Connection extends EventEmitter {
	constructor(socket, server) {
		super();

		this.socket = socket;
		this.server = server;

		this.promiseCallbacks = {};
		this.socket.on('message', this.onMessage.bind(this));
		this.socket.on('error', this.onError.bind(this));
		this.socket.on('close', this.onClose.bind(this));
	}


	onMessage(data, flags) {
		const message = Message.parse(data);

		// Message without response (no id fields)
		if (!message.id && Message.reservedNames.indexOf(message.name) == -1)
			return this.emit(message.name, message);

		// Message response
		if (message.name == '_r') {
			const {resolve, reject} = this.promiseCallbacks[message.id];

			if (message.err) {
				const err = _.assign(new Error(), message.err);
				reject(err);
			} else {
				resolve(message.payload);
			}

			delete this.promiseCallbacks[message.options.id];
			return;
		}

		// Message with response
		message.once('resolved', payload => {
			this.send_(message.createResponse(null, payload));
		});

		message.once('rejected', err => {
	        if (_.isObject(err) && err instanceof Error && err.name == 'Error')
	           err = {message: err.message, name: 'Error'};
			this.send_(message.createResponse(err));
		});

		this.emit(message.name, message);
	}

	onError(error) {
		this.emit('_error', error);
	}

	onClose(code, message) {
		this.server.rooms.removeFromAll(this);

		_.forEach(this.promiseCallbacks, (callbacks) => {
			callbacks.reject(new Error('Socket connection closed!'));
		});
		this.promiseCallbacks = {};

		this.emit('_close', code, message);
	}

	onOpen() {
		this.joinRoom('/');
		this.emit('_open');
	}

	joinRoom(roomName) {
		this.server.rooms.add(roomName, this);
	}


	leaveRoom(roomName) {
		this.server.rooms.remove(roomName, this);
	}

	getRooms() {
		this.server.rooms.getRoomsOf(this);
	}

	send(eventName, payload) {
		const message = new Message({name: eventName, payload});
		const messageId = message.setId();
		return this
			.send_(message)
			.then(_ => {
				return new Promise((resolve, reject) => {
					this.promiseCallbacks[messageId] = {resolve, reject};
				});
			});
	}

	send_(message) {
		return new Promise((resolve, reject) => {
			this.socket.send(message.toString(), err => {
				if (err) return reject(err);
				resolve();
			});
		});
	}
}

module.exports = Connection;

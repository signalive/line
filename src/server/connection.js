import Message from '../lib/message';
import {EventEmitter} from 'events';
import * as _ from 'lodash';
import * as uuid from 'node-uuid';


class Connection extends EventEmitter {
	constructor(socket, server) {
		super();

		this.socket = socket;
		this.server = server;

		this.promiseCallbacks = {};
		// this.id = uuid.v4();
		this.socket.on('message', this.onMessage.bind(this));
		this.socket.on('error', this.onError.bind(this));
		this.socket.on('close', this.onClose.bind(this));
		this.socket.on('ping', this.onPing.bind(this));
		this.socket.on('pong', this.onPong.bind(this));
		//this.socket.on('open', this.onOpen.bind(this));
	}


// line
// 	.send('asd', payload)
// 	.then(null => {
// 		// 123
// 	});

	onMessage(data, flags) {
		const message = Message.parse(data);
		if (!message.options.id)
			return this.emit(message.event, message.payload, message);

		if (message.event == '_ack') {
			const {resolve, reject} = this.promiseCallbacks[message.options.id];

			if (message.options.failed) {
				const err = _.assign(new Error(), err);
				reject(err);
			} else {
				resolve(message.payload);
			}

			delete this.promiseCallbacks[message.options.id];
			return;
		}

		const done = (err, payload) => {
	        if (_.isObject(err) && err instanceof Error && err.name == 'Error')
	            err = {message: err.message, name: 'Error'};

			const response = err ? new Message('_ack', err, {failed: true, id: message.options.id}) : new Message('_ack', payload, {id: message.options.id});
			this.send_(response);
		};

		this.emit(message.event, message.payload, done, message);
	}

	onError(error) {
		this.emit('error', error);
	}

	onClose(code, message) {
		this.server.rooms.removeFromAll(this);

		_.forEach(this.promiseCallbacks, (callbacks) => {
			callbacks.reject(new Error('Socket connection closed!'));
		});
		this.promiseCallbacks = {};

		this.emit('close', code, message);
	}

	onPing(data, flags) {
		this.emit('ping', data, flags);
	}

	onPong(data, flags) {
		this.emit('pong', data, flags);
	}

	onOpen() {
		this.joinRoom('/');
		this.emit('open');
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
		const message = new Message(eventName, payload);
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

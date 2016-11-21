import Utils from '../lib/utils';
import Message from '../lib/message';
import EventEmitter from 'event-emitter-extra/dist/commonjs.modern';
import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import isObject from 'lodash/isObject';
import Deferred from '../lib/deferred';
import * as uuid from 'node-uuid';


class Connection extends EventEmitter {
	constructor(socket, server) {
		super();

		this.id = uuid.v4();

		this.socket = socket;
		this.server = server;

		this.deferreds_ = {};
		this.socket.on('message', this.onMessage_.bind(this));
		this.socket.on('error', this.onError_.bind(this));
		this.socket.on('close', this.onClose_.bind(this));
	}


	onMessage_(data, flags) {
		const message = Message.parse(data);

		// Emit original _message event with raw data
		this.emit(Connection.Events.MESSAGE, data);

		// Message without response (no id fields)
		if (!message.id && Message.ReservedNames.indexOf(message.name) == -1)
			return this.emit(message.name, message);

		// Handshake
		if (message.name == '_h') {
			return this.onHandshake_(message);
		}

		// Message response
		if (message.name == '_r' && this.deferreds_[message.id]) {
			return this.onResponse_(message);
		}

		// Message with response
		message.once('resolved', payload => {
			this.send_(message.createResponse(null, payload));
			message.dispose();
		});

		message.once('rejected', err => {
	        if (isObject(err) && err instanceof Error && err.name == 'Error')
	           err = {message: err.message, name: 'Error'};
			this.send_(message.createResponse(err));
			message.dispose();
		});

		this.emit(message.name, message);
	}


	onHandshake_(message) {
		message.once('resolved', payload => {
			const responsePayload = {
				handshakePayload: payload,
				id: this.id,
				timeout: this.server.options.timeout,
				maxReconnectDelay: this.server.options.maxReconnectDelay,
				initialReconnectDelay: this.server.options.initialReconnectDelay,
				reconnectIncrementFactor: this.server.options.reconnectIncrementFactor
			};

			this
				.send_(message.createResponse(null, responsePayload))
				.then(() => {
					this.joinRoom('/');
					this.emit(Connection.Events.HANDSHAKE_OK);
				})
				.catch(() => {
					console.log(`Handshake resolve response failed to send for ${this.id}.`);
					this.onClose_(500, err);
				})
				.then(() => {
					message.dispose();
				});
		});

		message.once('rejected', err => {
	        if (isObject(err) && err instanceof Error && err.name == 'Error')
	           err = {message: err.message, name: 'Error'};

			this
				.send_(message.createResponse(null, err))
				.catch(err_ => {
					console.log(`Handshake reject response failed to send for ${this.id}.`);
				})
				.then(() => {
					this.onClose_(500, err);
					message.dispose();
				});
		});

		// Sorry for party rocking
		const handshakeResponse = this.server.emit('handshake', message);

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


	onError_(err) {
		this.emit(Connection.Events.ERROR, err);
	}


	onClose_(code, message) {
		this.server.rooms.removeFromAll(this);

		forEach(this.deferreds_, (deferred) => {
			deferred.reject(new Error('Socket connection closed!'));
		});
		this.deferreds_ = {};

		this.emit(Connection.Events.CLOSE, code, message);
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
}


Connection.Events = {
	MESSAGE: '_message',
	HANDSHAKE_OK: '_handshakeOk',
	ERROR: '_error',
	CLOSE: '_close'
};


module.exports = Connection;

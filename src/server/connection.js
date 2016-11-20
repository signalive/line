import Utils from '../lib/utils';
import Message from '../lib/message';
import EventEmitter from 'event-emitter-extra';
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
		this.socket.on('message', this.onMessage.bind(this));
		this.socket.on('error', this.onError.bind(this));
		this.socket.on('close', this.onClose.bind(this));

		this.handshake_ = false;
	}


	onMessage(data, flags) {
		const message = Message.parse(data);
		// TODO: Emit original _message event with raw data?

		// Message without response (no id fields)
		if (!message.id && Message.reservedNames.indexOf(message.name) == -1)
			return this.emit(message.name, message);

		// Handshake
		if (message.name == '_h') {
			const responsePayload = {
				id: this.id,
				timeout: this.server.options.timeout,
				maxReconnectDelay: this.server.options.maxReconnectDelay,
				initialReconnectDelay: this.server.options.initialReconnectDelay,
				reconnectIncrementFactor: this.server.options.reconnectIncrementFactor
			};

			Utils.retry(
					_ => this.send_(message.createResponse(null, responsePayload)),
					{maxCount: 3, initialDelay: 1, increaseFactor: 1}
				)
				.then(_ => {
					this.joinRoom('/');
					this.handshake_ = true;
					this.emit('_handshakeOk');
				})
				.catch(err => {
					this.handshake_ = false;
					console.log(`Handshake failed for ${this.id}.`);
					this.onClose(500, err);
				});
		}

		// Message response
		if (message.name == '_r' && this.deferreds_[message.id]) {
			const deferred = this.deferreds_[message.id];

			if (message.err) {
				const err = assign(new Error(), message.err);
				deferred.reject(err);
			} else {
				deferred.resolve(message.payload);
			}

			delete this.deferreds_[message.id];
			return;
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

	onError(error) {
		this.emit('_error', error);
	}

	onClose(code, message) {
		this.server.rooms.removeFromAll(this);

		forEach(this.deferreds_, (deferred) => {
			deferred.reject(new Error('Socket connection closed!'));
		});
		this.deferreds_ = {};

		this.emit('_close', code, message);
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

module.exports = Connection;

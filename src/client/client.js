import WebSocket from 'uws';
import Message from '../lib/message';
import EventEmitter from 'event-emitter-extra';


class Client extends EventEmitter {
	constructor(options) {
		super();

		this.promiseCallbacks = {};
		this.options = options;
	}

	connect(url = 'localhost') {
		this.ws = new WebSocket(url, this.options);
		this.readyState = this.ws.readyState;
		this.bindEvents();
	}

	bindEvents() {
		this.ws.on('open', this.onOpen.bind(this));
		this.ws.on('close', this.onClose.bind(this));
		this.ws.on('error', this.onError.bind(this));
		this.ws.on('message', this.onMessage.bind(this));
	}

	onOpen() {
		this.readyState = this.ws.readyState;
		this.emit('_open');
	}


	onClose(code, message) {
		this.readyState = this.ws.readyState;
		this.emit('_close', code, message);
	}

	onError(err) {
		this.readyState = this.ws.readyState;
		this.emit('_error', err);
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

			delete this.promiseCallbacks[message.id];
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
			this.ws.send(message.toString(), err => {
				if (err) return reject(err);
				resolve();
			});
		});
	}

}

module.exports = Client;
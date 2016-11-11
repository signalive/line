import WebSocket from 'uws';
import Message from '../lib/message';
import {EventEmitter} from 'events';


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
		this.emit('open');
	}


	onClose(code, message) {
		this.readyState = this.ws.readyState;
		this.emit('close', code, message);
	}

	onError(err) {
		this.readyState = this.ws.readyState;
		this.emit('error', err);
	}

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
			this.ws.send(message.toString(), err => {
				if (err) return reject(err);
				resolve();
			});
		});
	}

}

module.exports = Client;
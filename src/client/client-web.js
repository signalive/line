import Message from '../lib/message';
import EventEmitter from 'event-emitter-extra';


class WebClient extends EventEmitter {
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
		this.ws.onopen = this.onOpen.bind(this);
		this.ws.onclose = this.onClose.bind(this);
		this.ws.onerror = this.onError.bind(this);
		this.ws.onmessage = this.onMessage.bind(this);
	}


	onOpen() {
		this.readyState = this.ws.readyState;
		this.emit('_open');
	}


	onClose(e) {
		this.readyState = this.ws.readyState;
		this.emit('_close', e.code, e.reason);
	}


	onError(err) {
		this.readyState = this.ws.readyState;
		this.emit('_error', err);
	}


	onMessage(e) {
		const message = Message.parse(e.data);

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
			message.dispose();
		});

		message.once('rejected', err => {
	        if (_.isObject(err) && err instanceof Error && err.name == 'Error')
	           err = {message: err.message, name: 'Error'};
			this.send_(message.createResponse(err));
			message.dispose();
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
		return new Promise(resolve => {
			this.ws.send(message.toString());
			resolve();
		});
	}
}


module.exports = WebClient;

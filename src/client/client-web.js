import Message from '../lib/message';
import EventEmitter from 'event-emitter-extra';


class WebClient extends EventEmitter {
	constructor(url = 'ws://localhost', options) {
		super();

		this.url = url;
		this.options = options;

		this.ws_ = null;
		this.id = null;
		this.readyState = null;
		this.serverTimeout_ = 30000;
		this.promiseCallbacks_ = {};
		this.connectPromiseCallback_ = {};
		this.disconnectPromiseCallback_ = {};
	}


	connect() {
		switch (this.readyState) {
			case 0:
				return Promise.reject(new Error('Could not connect, already trying to connect...'));
			case 1:
				return Promise.reject(new Error('Socket already connected.'));
			case 2:
				return Promise.reject(new Error('Could not connect, socket is closing. Try again after closure.'));
			default:
				return new Promise((resolve, reject) => {
					this.ws_ = new WebSocket(this.url, this.options);
					this.connectPromiseCallback_ = {resolve, reject};
					this.updateState_();
					this.bindEvents_();
				});
		}
	}


	disconnect(code, reason) {
		switch (this.readyState) {
			case null:
			case 3:
				return Promise.reject(new Error('Socket is not connected.'));
			case 2:
				return Promise.reject(new Error('Could not disconnect, already disconnecting...'));
			default:
				return new Promise((resolve, reject) => {
					this.ws_.close(code, reason);
					this.disconnectPromiseCallback_ = {resolve, reject};
					this.updateState_();
				});
		}
	}


	updateState_() {
		this.readyState = this.ws_.readyState;
	}


	bindEvents_() {
		this.ws_.onopen = this.onOpen.bind(this);
		this.ws_.onclose = this.onClose.bind(this);
		this.ws_.onerror = this.onError.bind(this);
		this.ws_.onmessage = this.onMessage.bind(this);
	}


	onOpen() {
		// this.updateState_();
		// this.emit('_open');
	}


	onClose(e) {
		this.updateState_();
		this.id = null;
		this.emit('_close', e.code, e.reason);

		if (this.connectPromiseCallback_.reject) {
			this.connectPromiseCallback_.reject();
			this.connectPromiseCallback_ = {};
		}

		if (this.disconnectPromiseCallback_.resolve) {
			this.disconnectPromiseCallback_.resolve();
			this.disconnectPromiseCallback_ = {};
		}
	}


	onError(err) {
		this.updateState_();
		this.emit('_error', err);

		if (this.connectPromiseCallback_.reject) {
			this.connectPromiseCallback_.reject(err);
			this.connectPromiseCallback_ = {};
		}

		if (this.disconnectPromiseCallback_.reject) {
			this.disconnectPromiseCallback_.reject(err);
			this.disconnectPromiseCallback_ = {};
		}
	}


	onMessage(e) {
		const message = Message.parse(e.data);

		// Message without response (no id fields)
		if (!message.id && Message.reservedNames.indexOf(message.name) == -1)
			return this.emit(message.name, message);

		// Handshake
		if (message.name == '_h') {
			this.id = message.payload.id;
			this.serverTimeout_ = message.payload.timeout;

			if (this.connectPromiseCallback_.resolve) {
				this.connectPromiseCallback_.resolve();
				this.connectPromiseCallback_ = {};
			}

			this.updateState_();
			this.emit('_open');
			return;
		}

		// Message response
		if (message.name == '_r' && this.promiseCallbacks_[message.id]) {
			const {resolve, reject, timeout} = this.promiseCallbacks_[message.id];
			clearTimeout(timeout);

			if (message.err) {
				const err = _.assign(new Error(), message.err);
				reject(err);
			} else {
				resolve(message.payload);
			}

			delete this.promiseCallbacks_[message.id];
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
					const timeout = setTimeout(_ => {
						const {reject, timeout} = this.promiseCallbacks_[messageId];
						clearTimeout(timeout);
						reject(new Error('Timeout reached'));
						delete this.promiseCallbacks_[messageId];
					}, this.serverTimeout_);

					this.promiseCallbacks_[messageId] = {resolve, reject, timeout};
				});
			});
	}


	sendWithoutResponse(eventName, payload) {
		const message = new Message({name: eventName, payload});
		return this.send_(message);
	}


	send_(message) {
		return new Promise(resolve => {
			this.ws_.send(message.toString());
			resolve();
		});
	}
}


module.exports = WebClient;

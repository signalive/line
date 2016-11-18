import Message from '../lib/message';
import Utils from '../lib/utils';
import EventEmitter from 'event-emitter-extra';


class WebClient extends EventEmitter {
	constructor(url = 'ws://localhost', options = {}) {
		super();

		this.url = url;

		this.options = options;

		this.ws_ = null;
		this.id = null;
		this.readyState = null;
		this.reconnect = options.reconnect;

		this.serverTimeout_ = 30000;
		this.maxReconnectDelay = 60;
		this.initialReconnectDelay = 1;
		this.reconnectIncrementFactor = 2;

		this.promiseCallbacks_ = {};
		this.connectPromiseCallback_ = {};
		this.disconnectPromiseCallback_ = {};

		this.state = WebClient.States.READY;
	}


	connect() {
		switch (this.state) {
			case WebClient.States.CONNECTING:
				return Promise.reject(new Error('Could not connect, already trying to connect to a host...'));
			case WebClient.States.CONNECTED:
				return Promise.reject(new Error('Already connected.'));
			case WebClient.States.CLOSING:
				return Promise.reject(new Error('Terminating an active connecting, try again later.'));
			case WebClient.States.CLOSED:
			case WebClient.States.READY:
				return new Promise((resolve, reject) => {
					setTimeout(_ => {
						this.ws_ = new WebSocket(this.url);
						this.connectPromiseCallback_ = {resolve, reject};
						this.bindEvents_();

						this.state = WebClient.States.CONNECTING;
						this.emit(WebClient.Events.CONNECTING);
					}, 0);
				});
			default:
				return Promise.reject(new Error('Could not connect, unknown state.'))
		}
	}


	disconnect(code, reason) {
		switch (this.state) {
			case WebClient.States.ERROR:
			case WebClient.States.CONNECTED:
			case WebClient.States.CONNECTING:
				return new Promise((resolve, reject) => {
					this.ws_.close(code, reason);
					this.state = WebClient.States.CLOSING;
					this.disconnectPromiseCallback_ = {resolve, reject};
				});
			case WebClient.States.CLOSED:
				return Promise.reject(new Error('There is no connection to disconnect.'));
			case WebClient.States.CLOSING:
				return Promise.reject(new Error('Already terminating a connecting, try again later.'));
		}
	}


	bindEvents_() {
		this.ws_.onopen = this.onOpen.bind(this);
		this.ws_.onclose = this.onClose.bind(this);
		this.ws_.onerror = this.onError.bind(this);
		this.ws_.onmessage = this.onMessage.bind(this);
	}


	unBindEvents_() {
		if (!this.ws_) return;
		delete this.ws_.onopen;
		delete this.ws_.onclose;
		delete this.ws_.onerror;
		delete this.ws_.onmessage;
	}


	disposeConnectionPromisses_() {
		if (this.connectPromiseCallback_.reject) {
			this.connectPromiseCallback_.reject();
			this.connectPromiseCallback_ = {};
		}

		if (this.disconnectPromiseCallback_.resolve) {
			this.disconnectPromiseCallback_.resolve();
			this.disconnectPromiseCallback_ = {};
		}
	}


	onOpen() {
		// this.updateState_();
		// this.emit('_open');
	}


	onClose(e) {
		this.unBindEvents_();
		this.id = null;
		this.ws_ = null;
		this.state = WebClient.States.CLOSED;

		this.emit(WebClient.Events.CLOSED, e.code, e.reason);

		if (this.connectPromiseCallback_.reject) {
			this.connectPromiseCallback_.reject();
			this.connectPromiseCallback_ = {};
		}

		if (this.disconnectPromiseCallback_.resolve) {
			this.disconnectPromiseCallback_.resolve();
			this.disconnectPromiseCallback_ = {};
		}

		if (!this.reconnect || this.retrying_) return;

		this.retrying_ = true;
		Utils
			.retry(
				_ => this.connect(),
				{
					maxCount: this.maxReconnectDelay,
					initialDelay: this.initialReconnectDelay,
					increaseFactor: this.reconnectIncrementFactor
				})
			.then(_ => {
				this.retrying_ = false;
			});
	}


	onError(err) {
		const eventName = this.state == WebClient.States.CONENCTING ?
				WebClient.Events.CONNECTING_ERROR : WebClient.Events.ERROR;

		this.state = WebClient.States.CLOSED;

		this.emit(eventName, err);

		if (this.connectPromiseCallback_.reject) {
			this.connectPromiseCallback_.reject();
			this.connectPromiseCallback_ = {};
		}

		if (this.disconnectPromiseCallback_.reject) {
			this.disconnectPromiseCallback_.reject();
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
			this.maxReconnectDelay = message.payload.maxReconnectDelay;
			this.initialReconnectDelay = message.payload.initialReconnectDelay;
			this.reconnectIncrementFactor = message.payload.reconnectIncrementFactor;

			return this
				.send_(message.createResponse())
				.then(_ => {
					message.dispose();

					if (this.connectPromiseCallback_.resolve) {
						this.connectPromiseCallback_.resolve();
						this.connectPromiseCallback_ = {};
					}

					this.state = WebClient.States.CONNECTED;
					this.emit(WebClient.Events.CONNECTED);
				});
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

WebClient.States = {
	READY: -1,
	CONNECTING: 0,
	CONNECTED: 1,
	CLOSING: 2,
	CLOSED: 3
};

WebClient.Events = {
	READY: '_ready',
	CONNECTING: '_connecting',
	CONNECTING_ERROR: '_connecting_error',
	CONNECTED: '_connected',
	CLOSING: '_closing',
	CLOSED: '_closed',
	ERROR: '_error'
};


module.exports = WebClient;

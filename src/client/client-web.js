const Message = require('../lib/message');
const Utils = require('../lib/utils');
const EventEmitter = require('event-emitter-extra/dist/commonjs.modern');
const Deferred = require('../lib/deferred');
const debounce = require('lodash/debounce');
const isObject = require('lodash/isObject');


class WebClient extends EventEmitter {
    constructor(url = 'ws://localhost', options = {}) {
        super();

        this.url = url;

        this.options = options;

        this.ws_ = null;
        this.id = null;
        this.readyState = null;
        this.reconnect = options.reconnect;
        this.reconnectDisabled_ = false;

        this.serverTimeout_ = 30000;
        this.maxReconnectDelay = 60;
        this.initialReconnectDelay = 1;
        this.reconnectIncrementFactor = 2;
        this.pingInterval = 60000;

        this.deferreds_ = {};
        this.connectDeferred_ = null;
        this.disconnectDeferred_ = null;

        this.state = WebClient.States.READY;

        this.autoPing_ = this.pingInterval > 0 ?
            debounce(() => {
                if (this.state != WebClient.States.CONNECTED)
                    return;

                this
                    .ping()
                    .then(() => {
                        if (this.pingInterval > 0 && this.state == WebClient.States.CONNECTED) {
                            this.autoPing_();
                        }
                    })
                    .catch(() => {});
            }, this.pingInterval) :
            () => {};
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
                this.connectDeferred_ = new Deferred({
                    handler: () => {
                        this.state = WebClient.States.CONNECTING;
                        this.emit(WebClient.Events.CONNECTING);
                        this.reconnectDisabled_ = false;

                        setTimeout(_ => {
                            this.ws_ = new WebSocket(this.url);
                            this.bindEvents_();
                        }, 0);
                    }
                });

                return this.connectDeferred_;
            default:
                return Promise.reject(new Error('Could not connect, unknown state.'))
        }
    }


    disconnect(code, reason) {
        switch (this.state) {
            case WebClient.States.ERROR:
            case WebClient.States.CONNECTED:
            case WebClient.States.CONNECTING:
                this.reconnectDisabled_ = true;
                const deferred = this.disconnectDeferred_ = new Deferred({
                    handler: () => {
                        this.ws_.close(code, reason);
                        this.state = WebClient.States.CLOSING;
                    }
                });
                return deferred;
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
        if (this.connectDeferred_) {
            this.connectDeferred_.reject();
            this.connectDeferred_ = null;
        }

        if (this.disconnectDeferred_) {
            this.disconnectDeferred_.reject();
            this.disconnectDeferred_ = null;
        }
    }


    onOpen() {
        // this.updateState_();
        // this.emit('_open');
        Utils.retry(_ => this.send(Message.Names.HANDSHAKE, this.options.handshakePayload), {maxCount: 3, initialDelay: 1, increaseFactor: 1})
            .then(data => {
                this.id = data.id;
                this.serverTimeout_ = data.timeout;
                this.maxReconnectDelay = data.maxReconnectDelay;
                this.initialReconnectDelay = data.initialReconnectDelay;
                this.reconnectIncrementFactor = data.reconnectIncrementFactor;
                this.pingInterval = data.pingInterval;

                if (this.connectDeferred_) {
                    this.connectDeferred_.resolve(data.handshakePayload);
                    this.connectDeferred_ = null;
                }

                this.state = WebClient.States.CONNECTED;
                this.emit(WebClient.Events.CONNECTED, data.handshakePayload);
            })
            .catch(err => {
                console.log('Handshake failed', err);
                return this.disconnect();
            })
            .catch(err => {
                console.log('Could not disconnect after failed handshake', err);
            });
    }


    onClose(e) {
        this.unBindEvents_();
        this.id = null;
        this.ws_ = null;
        this.state = WebClient.States.CLOSED;

        this.emit(WebClient.Events.CLOSED, e.code, e.reason);

        if (this.connectDeferred_) {
            this.connectDeferred_.reject();
            this.connectDeferred_ = null;
        }

        if (this.disconnectDeferred_) {
            this.disconnectDeferred_.resolve();
            this.disconnectDeferred_ = null;
        }

        if (!this.reconnect || this.retrying_ || this.reconnectDisabled_) return;

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
        const eventName = this.state == WebClient.States.CONNECTING ?
                WebClient.Events.CONNECTING_ERROR : WebClient.Events.ERROR;

        this.state = WebClient.States.CLOSED;

        this.emit(eventName, err);
        this.disposeConnectionPromisses_();
    }


    onMessage(e) {
        const message = Message.parse(e.data);

        this.autoPing_();

        // Message without response (no id fields)
        if (!message.id && Message.ReservedNames.indexOf(message.name) == -1)
            return this.emit(message.name, message);

        // Ping
        if (message.name == Message.Names.PING) {
            return this.onPing_(message);
        }

        // Message response
        if (message.name == Message.Names.RESPONSE && this.deferreds_[message.id]) {
            const deferred = this.deferreds_[message.id];

            if (message.err) {
                const err = Object.assign(new Error(), message.err);
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


    onPing_(message) {
        this
            .send_(message.createResponse(null, 'pong'))
            .catch(err => {
                console.log('Ping responce failed to send', err);
            });
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
                    timeout: this.serverTimeout_
                });

                return deferred;
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


    ping() {
        return Utils
            .retry(_ => this.send(Message.Names.PING), {maxCount: 3, initialDelay: 1, increaseFactor: 1})
            .catch(err => {
                this.disconnect();
                throw err;
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

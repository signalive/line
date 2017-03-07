module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var assign = __webpack_require__(8);

function promiseDelay(ms) {
    return new Promise(function (resolve) {
        return setTimeout(function (_) {
            return resolve();
        }, ms);
    });
}

function retry(task) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var defaults = { maxDelay: 160, maxCount: 0, initialDelay: 3, increaseFactor: 2 };
    options = assign(defaults, options);
    var timeout = void 0;
    var counter = 1;
    var delay = options.initialDelay;

    var once = function once() {
        return task().catch(function (err) {
            counter++;
            delay = delay * options.increaseFactor;

            if (options.maxCount != 0 && counter > options.maxCount) {
                timeout && clearTimeout(timeout);
                throw err;
            }
            return promiseDelay(delay * 1000 / 2).then(function (_) {
                return once();
            });
        });
    };

    return once();
}

// http://stackoverflow.com/a/6248722
function generateDummyId() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

    return ("0000" + (Math.random() * Math.pow(36, length) << 0).toString(36)).slice(-length);
}

module.exports = { promiseDelay: promiseDelay, retry: retry, generateDummyId: generateDummyId };

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("event-emitter-extra/dist/commonjs.modern");

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = require("lodash/isObject");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = __webpack_require__(6);
var Utils = __webpack_require__(0);
var EventEmitterExtra = __webpack_require__(1);
var Deferred = __webpack_require__(5);
var debounce = __webpack_require__(9);
var isObject = __webpack_require__(2);
var isBoolean = __webpack_require__(10);
var debug = __webpack_require__(7)('line:client-web');

/**
 * Line client class.
 *
 * @class Client
 * @extends {EventEmitterExtra}
 * @param {string=} url Server url, default: `ws://localhost`.
 * @param {Object=} options Options object.
 * @param {boolean=} options.reconnect Try to reconnect server after unexpected disconnection, default `true`.
 * @param {boolean=} options.keepUptime Keeps uptime, default `false`.
 * @param {any=} options.handshakePayload Handshake payload to be sent to server.
 * @property {string} url Server url
 * @property {string} id Unique connection id assigned by the server
 * @property {Client.States} state Connection state
 * @example
 * // Add line-client to your html document
 * <script src="./node_modules/line-socket/dist/client-web-globals.js"></script>
 *
 * // For web browsers (consuming as a commonjs module)
 * const LineClient = require('line-socket/client-web');
 *
 * // For node.js
 * const LineClient = require('line-socket/client-node');
 *
 *
 * const client = new LineClient('ws://localhost:8080', {
 *   reconnect: false,
 *   handshakePayload: { token: 'a6g3X' }
 * });
 */

var Client = function (_EventEmitterExtra) {
    _inherits(Client, _EventEmitterExtra);

    function Client() {
        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ws://localhost';
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this));

        _this.url = url;

        _this.options = options;

        _this.ws_ = null;
        _this.id = null;
        _this.reconnect = isBoolean(options.reconnect) ? options.reconnect : true;
        _this.reconnectDisabled_ = false;

        _this.serverTimeout_ = 30000;
        _this.maxReconnectDelay = 60;
        _this.initialReconnectDelay = 1;
        _this.reconnectIncrementFactor = 2;
        _this.pingInterval = 60000;

        _this.deferreds_ = {};
        _this.connectDeferred_ = null;
        _this.connectError_ = null;
        _this.disconnectDeferred_ = null;

        _this.state = Client.States.READY;

        _this.uptimeInterval_ = 5000;
        _this.uptimeBuffer_ = [];
        _this.uptimeBufferLength_ = 5 * 60000 / _this.uptimeInterval_;
        _this.uptimeCheck_ = options.keepUptime ? setInterval(_this.uptimeTick_.bind(_this), _this.uptimeInterval_) : null;

        _this.autoPing_ = _this.pingInterval > 0 ? debounce(function () {
            if (_this.state != Client.States.CONNECTED) return;

            _this.ping().then(function () {
                if (_this.pingInterval > 0 && _this.state == Client.States.CONNECTED) {
                    _this.autoPing_();
                }
            }).catch(function () {});
        }, _this.pingInterval) : function () {};
        return _this;
    }

    /**
     * Connects to server.
     * @returns {Promise}
     * @example
     * client
     *   .connect()
     *   .then((handshakeResponse) => {
     *     // handshakeResponse will be undefined if you do not resolve
     *     // the handshake with a payload in server
     *     console.log('Connected');
     *   })
     *   .catch((err) => {
     *     console.log('Could not connect');
     *   })
     */


    _createClass(Client, [{
        key: 'connect',
        value: function connect() {
            var _this2 = this;

            switch (this.state) {
                case Client.States.CONNECTING:
                    return Promise.reject(new Error('Could not connect, already trying to connect to a host...'));
                case Client.States.CONNECTED:
                    return Promise.reject(new Error('Already connected.'));
                case Client.States.CLOSING:
                    return Promise.reject(new Error('Terminating an active connecting, try again later.'));
                case Client.States.CLOSED:
                case Client.States.READY:
                    this.connectError_ = null;
                    this.connectDeferred_ = new Deferred({
                        handler: function handler() {
                            _this2.state = Client.States.CONNECTING;
                            _this2.emit(Client.Events.CONNECTING);
                            _this2.reconnectDisabled_ = false;

                            setTimeout(function (_) {
                                debug('Connecting to "' + _this2.url + '" ...');
                                _this2.ws_ = new WebSocket(_this2.url);
                                _this2.bindEvents_();
                            }, 0);
                        }
                    });

                    return this.connectDeferred_;
                default:
                    return Promise.reject(new Error('Could not connect, unknown state.'));
            }
        }

        /**
         * Gracefully closes the connection
         *
         * @param {number=} code
         * @param {any=} reason
         * @param {boolean=} opt_retry
         * @returns {Promise}
         * @example
         * client
         *   .disconnect()
         *   .then(() => {
         *     // Client will not try to reconnect
         *     console.log('Disconnected');
         *   })
         *   .catch((err) => {
         *     console.log('Could not disconnect');
         *   })
         */

    }, {
        key: 'disconnect',
        value: function disconnect(code, reason, opt_retry) {
            switch (this.state) {
                case Client.States.ERROR:
                case Client.States.CONNECTED:
                case Client.States.CONNECTING:
                    debug('Disconnecting...');
                    this.reconnectDisabled_ = !opt_retry;
                    this.disconnectDeferred_ = new Deferred();
                    this.ws_.close(code, reason);
                    this.state = Client.States.CLOSING;
                    return this.disconnectDeferred_;
                case Client.States.CLOSED:
                    return Promise.reject(new Error('There is no connection to disconnect.'));
                case Client.States.CLOSING:
                    return Promise.reject(new Error('Already terminating a connecting, try again later.'));
            }
        }
    }, {
        key: 'bindEvents_',
        value: function bindEvents_() {
            debug('Binding native event handlers.');
            this.ws_.onopen = this.onOpen.bind(this);
            this.ws_.onclose = this.onClose.bind(this);
            this.ws_.onerror = this.onError.bind(this);
            this.ws_.onmessage = this.onMessage.bind(this);
        }
    }, {
        key: 'unBindEvents_',
        value: function unBindEvents_() {
            if (!this.ws_) return;
            debug('Unbinding native event handlers.');
            this.ws_.onopen = function () {};
            this.ws_.onclose = function () {};
            this.ws_.onerror = function () {};
            this.ws_.onmessage = function () {};
        }
    }, {
        key: 'disposeConnectionPromisses_',
        value: function disposeConnectionPromisses_() {
            debug('Disposing connection promisses...');
            if (this.connectDeferred_) {
                debug('Rejecting connect promise...');
                this.connectDeferred_.reject(this.connectError_);
                this.connectDeferred_ = null;
                this.connectError_ = null;
            }

            if (this.disconnectDeferred_) {
                debug('Rejecting disconnect promise...');
                this.disconnectDeferred_.reject();
                this.disconnectDeferred_ = null;
            }
        }
    }, {
        key: 'onOpen',
        value: function onOpen() {
            var _this3 = this;

            debug('Native "open" event received.');
            debug('State=' + this.state);
            debug('Sending handshake data...');
            this.send(Message.Names.HANDSHAKE, this.options.handshakePayload).then(function (data) {
                debug('Handshake successful.');
                _this3.id = data.id;
                _this3.serverTimeout_ = data.timeout;
                _this3.maxReconnectDelay = data.maxReconnectDelay;
                _this3.initialReconnectDelay = data.initialReconnectDelay;
                _this3.reconnectIncrementFactor = data.reconnectIncrementFactor;
                _this3.pingInterval = data.pingInterval;

                if (_this3.connectDeferred_) {
                    debug('Resolving connect promise...');
                    _this3.connectDeferred_.resolve(data.handshakePayload);
                    _this3.connectDeferred_ = null;
                    _this3.connectError_ = null;
                }

                _this3.state = Client.States.CONNECTED;
                debug('Emitting "connected" event...');
                _this3.emit(Client.Events.CONNECTED, data.handshakePayload);
            }).catch(function (err) {
                debug('Handshake failed.');
                _this3.connectError_ = err;
                debug('Emitting "error" event...');
                _this3.emit(Client.Events.ERROR, err);
                return _this3.disconnect();
            }).catch(function (err) {
                debug('Could not disconnect after handshake failure.');
                console.log('Could not disconnect after failed handshake', err);
            });
        }
    }, {
        key: 'onClose',
        value: function onClose(err) {
            var _this4 = this;

            debug('Native "close" event reveived.');
            debug('State=' + this.state);
            this.unBindEvents_();
            this.id = null;
            this.ws_ = null;

            debug('Emitting "closed" event...');
            this.emit(Client.Events.CLOSED, err);

            switch (this.state) {
                case Client.States.CLOSING:
                    this.state = Client.States.CLOSED;

                    if (this.disconnectDeferred_) {
                        debug('Resolving disconnect promise...');
                        this.disconnectDeferred_.resolve();
                        this.disconnectDeferred_ = null;
                    }

                    if (this.connectDeferred_) {
                        debug('Rejecting connect promise...');
                        this.connectDeferred_.reject(this.connectError_ || new Error('Connection closed while connecting...'));
                        this.connectDeferred_ = null;
                        this.connectError_ = null;
                    }

                    if (!this.reconnect || this.retrying_ || this.reconnectDisabled_) return;

                    break;
                case Client.States.CONNECTING:
                    this.state = Client.States.CLOSED;

                    if (this.disconnectDeferred_) {
                        debug('Rejecting disconnect promise...');
                        this.disconnectDeferred_.reject(new Error('Already disconnected'));
                        this.disconnectDeferred_ = null;
                    }

                    if (!this.reconnect || this.retrying_ || this.reconnectDisabled_) {
                        if (this.connectDeferred_) {
                            debug('Rejecting connect promise...');
                            this.connectDeferred_.reject(this.connectError_);
                            this.connectDeferred_ = null;
                            this.connectError_ = null;
                        }
                        return;
                    }

                    break;
                default:
                    this.state = Client.States.CLOSED;

                    if (this.disconnectDeferred_) {
                        debug('Rejecting disconnect promise...');
                        this.disconnectDeferred_.reject(new Error('Already disconnected'));
                        this.disconnectDeferred_ = null;
                    }

                    if (this.connectDeferred_) {
                        debug('Rejecting connect promise...');
                        this.connectDeferred_.reject(new Error('Already connected'));
                        this.connectDeferred_ = null;
                        this.connectError_ = null;
                    }

                    if (!this.reconnect || this.retrying_ || this.reconnectDisabled_) return;
            }
            debug('Retrying to connect...');
            this.retrying_ = true;
            Utils.retry(function (_) {
                return _this4.connect();
            }, {
                maxCount: this.maxReconnectDelay,
                initialDelay: this.initialReconnectDelay,
                increaseFactor: this.reconnectIncrementFactor
            }).then(function (_) {
                debug('Retry successful.');
                _this4.retrying_ = false;
            });
        }
    }, {
        key: 'onError',
        value: function onError(err) {
            debug('Native "error" event reveived.');
            debug('State=' + this.state);

            var eventName = this.state == Client.States.CONNECTING ? Client.Events.CONNECTING_ERROR : Client.Events.ERROR;

            this.emit(eventName, err || new Error('Unknown error'));
        }
    }, {
        key: 'onMessage',
        value: function onMessage(e) {
            var _this5 = this;

            debug('Native "message" event reveived.');

            var message = Message.parse(e.data);
            this.autoPing_();

            // Message without response (no id fields)
            if (!message.id && Message.ReservedNames.indexOf(message.name) == -1) {
                debug('Message without response: name="' + message.name + '"');
                return this.emit(message.name, message);
            }

            // Ping
            if (message.name == Message.Names.PING) {
                return this.onPing_(message);
            }

            // Message response
            if (message.name == Message.Names.RESPONSE && this.deferreds_[message.id]) {
                var deferred = this.deferreds_[message.id];
                debug('Message response: name="' + message.name + '" id="' + message.id + '"');
                if (message.err) {
                    var err = Object.assign(new Error(), message.err);
                    deferred.reject(err);
                } else {
                    deferred.resolve(message.payload);
                }

                delete this.deferreds_[message.id];
                return;
            }

            debug('Message with response: name="' + message.name + '" id="' + message.id + '"');
            // Message with response
            message.once('resolved', function (payload) {
                debug('Client resolving: name="' + message.name + '" id="' + message.id + '"');
                _this5.send_(message.createResponse(null, payload));
                message.dispose();
            });

            message.once('rejected', function (err) {
                if (isObject(err) && err instanceof Error && err.name == 'Error') err = { message: err.message, name: 'Error' };
                debug('Client rejecting: name="' + message.name + '" id="' + message.id + '"');
                _this5.send_(message.createResponse(err));
                message.dispose();
            });

            this.emit(message.name, message);
        }
    }, {
        key: 'onPing_',
        value: function onPing_(message) {
            debug('Ping received');
            this.send_(message.createResponse(null, 'pong')).catch(function (err) {
                console.log('Ping responce failed to send', err);
            });
        }

        /**
         * Sends a message to server with awaiting its response.
         *
         * @param {string} eventName
         * @param {any=} payload
         * @returns {Promise}
         * @example
         * client
         *   .send('hello', {some: data})
         *   .then((response) => {
         *     console.log('Sent and got the response');
         *   })
         *   .catch((err) => {
         *     console.log('Could not send message OR server rejected the message');
         *   });
         */

    }, {
        key: 'send',
        value: function send(eventName, payload) {
            var _this6 = this;

            var message = new Message({ name: eventName, payload: payload });
            message.setId();

            return this.send_(message).then(function (_) {
                var deferred = _this6.deferreds_[message.id] = new Deferred({
                    onExpire: function onExpire() {
                        delete _this6.deferreds_[message.id];
                    },
                    timeout: _this6.serverTimeout_
                });

                return deferred;
            });
        }

        /**
         * Sends a message to server without waiting its response.
         *
         * @param {string} eventName
         * @param {any=} payload
         * @returns {Promise}
         * @example
         * client
         *   .sendWithoutResponse('hello', {some: data})
         *   .then(() => {
         *     console.log('Message is sent');
         *   })
         *   .catch((err) => {
         *     console.log('Could not send message');
         *   });
         */

    }, {
        key: 'sendWithoutResponse',
        value: function sendWithoutResponse(eventName, payload) {
            var message = new Message({ name: eventName, payload: payload });
            return this.send_(message);
        }
    }, {
        key: 'send_',
        value: function send_(message) {
            var _this7 = this;

            return new Promise(function (resolve) {
                _this7.ws_.send(message.toString());
                resolve();
            });
        }

        /**
         * Sends a ping message to server, if its failed, the connection will be closed.
         * Server and client ping each other automatically with an interval specified by the server.
         *
         * @returns {Promise}
         */

    }, {
        key: 'ping',
        value: function ping() {
            var _this8 = this;

            debug('Pinging...');
            return this.send(Message.Names.PING).catch(function (err) {
                _this8.disconnect(500, 'Auto ping failed', true);
                throw err;
            });
        }
    }, {
        key: 'uptimeTick_',
        value: function uptimeTick_() {
            debug('•Uptime Tick•');
            this.uptimeBuffer_.push(this.state == Client.States.CONNECTED);

            if (this.uptimeBuffer_.length > this.uptimeBufferLength_) {
                this.uptimeBuffer_.splice(0, this.uptimeBufferLength_ - this.uptimeBuffer_.length);
            }
        }

        /**
         * Calculates (connection) uptime for last 5 minutes with 5 seconds interval.
         * Returns a number between 0 and 1. If `options.keepUptime` is false, this method
         * returns null.
         * @returns {number?}
         */

    }, {
        key: 'getUptime',
        value: function getUptime() {
            if (!this.options.keepUptime) return null;
            if (this.uptimeBuffer_.length == 0) return 0;
            return this.uptimeBuffer_.filter(function (val) {
                return val;
            }).length / this.uptimeBuffer_.length;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            debug('Disposing...');
            this.removeAllListeners();
            // TODO: Maybe reject all deferreds?
            this.uptimeBuffer_ = [];
            if (this.uptimeCheck_) clearInterval(this.uptimeCheck_);
        }
    }]);

    return Client;
}(EventEmitterExtra);

/**
 * @static
 * @readonly
 * @enum {number}
 */


Client.States = {
    /**
     * `-1`
     */
    READY: -1,
    /**
     * `0`
     */
    CONNECTING: 0,
    /**
     * `1`
     */
    CONNECTED: 1,
    /**
     * `2`
     */
    CLOSING: 2,
    /**
     * `3`
     */
    CLOSED: 3
};

/**
 * @static
 * @readonly
 * @enum {string}
 */
Client.Events = {
    /**
     * `_connecting`
     */
    CONNECTING: '_connecting',
    /**
     * `_connecting_error`
     */
    CONNECTING_ERROR: '_connecting_error',
    /**
     * `_connected`
     */
    CONNECTED: '_connected',
    /**
     * `_closed`
     */
    CLOSED: '_closed',
    /**
     * `_error`
     */
    ERROR: '_error'
};

module.exports = Client;

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = require("uws");

/***/ },
/* 5 */
/***/ function(module, exports) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Deferred = function () {
    function Deferred() {
        var _this = this;

        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$handler = _ref.handler,
            handler = _ref$handler === undefined ? function () {} : _ref$handler,
            _ref$onExpire = _ref.onExpire,
            onExpire = _ref$onExpire === undefined ? function () {} : _ref$onExpire,
            _ref$timeout = _ref.timeout,
            timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

        _classCallCheck(this, Deferred);

        this.resolve_ = null;
        this.reject_ = null;

        this.timeout_ = null;
        this.onExpire_ = onExpire;
        this.isFinished_ = false;

        this.promise = new Promise(function (resolve, reject) {
            _this.resolve_ = resolve;
            _this.reject_ = reject;

            try {
                handler(_this);
            } catch (err) {
                _this.reject(err);
            }
        });

        if (timeout > 0) {
            this.timeout_ = setTimeout(this.expire.bind(this), timeout);
        }
    }

    _createClass(Deferred, [{
        key: 'resolve',
        value: function resolve(data) {
            if (this.isFinished_) return;

            this.isFinished_ = true;
            this.clearTimeout_();
            this.resolve_(data);
        }
    }, {
        key: 'reject',
        value: function reject(err) {
            if (this.isFinished_) return;

            this.isFinished_ = true;
            this.clearTimeout_();
            this.reject_(err);
        }
    }, {
        key: 'expire',
        value: function expire() {
            this.isFinished_ = true;
            this.clearTimeout_();
            this.onExpire_();
            this.reject_(new Error('Timeout exceed'));
        }
    }, {
        key: 'then',
        value: function then() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return this.promise.then.apply(this.promise, args);
        }
    }, {
        key: 'catch',
        value: function _catch() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return this.promise.catch.apply(this.promise, args);
        }
    }, {
        key: 'clearTimeout_',
        value: function clearTimeout_() {
            if (this.timeout_) {
                clearTimeout(this.timeout_);
                this.timeout_ = null;
            }
        }
    }]);

    return Deferred;
}();

module.exports = Deferred;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isUndefined = __webpack_require__(12);
var isObject = __webpack_require__(2);
var isFunction = __webpack_require__(11);
var values = __webpack_require__(13);

var _require = __webpack_require__(0),
    generateDummyId = _require.generateDummyId;

var EventEmitterExtra = __webpack_require__(1);

/**
 * Message class.
 *
 * @private
 * @class Message
 * @extends {EventEmitterExtra}
 * @property {string} name Event name
 * @property {?any} payload Message payload.
 */

var Message = function (_EventEmitterExtra) {
    _inherits(Message, _EventEmitterExtra);

    _createClass(Message, null, [{
        key: 'parse',
        value: function parse(raw) {
            try {
                var data = JSON.parse(raw);
                return new Message({
                    name: data.n,
                    payload: data.p,
                    err: data.e,
                    id: data.i
                });
            } catch (err) {
                throw new Error('Could not parse message.');
            }
        }
    }]);

    function Message(_ref) {
        var name = _ref.name,
            payload = _ref.payload,
            id = _ref.id,
            err = _ref.err;

        _classCallCheck(this, Message);

        var _this = _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this));

        _this.name = name;
        _this.payload = payload;
        _this.id = id;
        _this.err = err;

        _this.isResponded_ = false;
        return _this;
    }

    _createClass(Message, [{
        key: 'setId',
        value: function setId() {
            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : generateDummyId();

            this.id = id;
            return id;
        }
    }, {
        key: 'createResponse',
        value: function createResponse(err, payload) {
            return new Message({ name: '_r', payload: payload, err: err, id: this.id });
        }

        /**
         * Resolves the message with sending a response back. If event source
         * does not expecting a response, you don't need to call these methods.
         * @param {any=} payload
         */

    }, {
        key: 'resolve',
        value: function resolve(payload) {
            var _this2 = this;

            if (isUndefined(this.id)) return console.warn('[line] A message without an id cannot be resolved.');

            if (this.isResponded_) return console.warn('[line] This message has already been ended.');

            // If thenable
            if (isObject(payload) && isFunction(payload.then)) {
                payload.then(function (response) {
                    _this2.isResponded_ = true;
                    _this2.emit('resolved', payload);
                }).catch(function (err) {
                    _this2.isResponded_ = true;
                    _this2.emit('rejected', err);
                });

                return;
            }

            this.isResponded_ = true;
            this.emit('resolved', payload);
        }

        /**
         * Rejects the message, with sending error response back to event source.
         * @param {any=} err
         */

    }, {
        key: 'reject',
        value: function reject(err) {
            if (isUndefined(this.id)) return console.warn('[line] A message without an id cannot be rejected.');

            if (this.isResponded_) return console.warn('[line] This message has already been ended.');

            this.isResponded_ = true;
            this.emit('rejected', err);
        }
    }, {
        key: 'toString',
        value: function toString() {
            try {
                var data = { n: this.name };

                if (!isUndefined(this.payload)) data.p = this.payload;

                if (!isUndefined(this.id)) data.i = this.id;

                if (!isUndefined(this.err)) data.e = this.err;

                return JSON.stringify(data);
            } catch (err) {
                throw new Error('Could not stringify message.');
            }
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            var _this3 = this;

            var events = this.eventNames();
            events.forEach(function (event) {
                return _this3.removeAllListeners(event);
            });
        }
    }]);

    return Message;
}(EventEmitterExtra);

Message.Names = {
    RESPONSE: '_r',
    HANDSHAKE: '_h',
    PING: '_p'
};

Message.ReservedNames = values(Message.Names);

module.exports = Message;

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("debug");

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = require("lodash/assign");

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("lodash/debounce");

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = require("lodash/isBoolean");

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = require("lodash/isFunction");

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = require("lodash/isUndefined");

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("lodash/values");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

global.WebSocket = __webpack_require__(4);
var WebClient = __webpack_require__(3);

var NodeClient = function (_WebClient) {
    _inherits(NodeClient, _WebClient);

    function NodeClient() {
        _classCallCheck(this, NodeClient);

        return _possibleConstructorReturn(this, (NodeClient.__proto__ || Object.getPrototypeOf(NodeClient)).apply(this, arguments));
    }

    _createClass(NodeClient, [{
        key: 'bindEvents_',
        value: function bindEvents_() {
            var _this2 = this;

            this.ws_.on('open', this.onOpen.bind(this));
            this.ws_.on('error', this.onError.bind(this));

            this.ws_.on('close', function (code, reason) {
                if (code == 0) code = 1005;
                _this2.onClose({ code: code, reason: reason });
            });

            this.ws_.on('message', function (data) {
                _this2.onMessage({ data: data });
            });
        }
    }, {
        key: 'send_',
        value: function send_(message) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.ws_.send(message.toString(), function (err) {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
    }, {
        key: 'onError',
        value: function onError(err) {
            var _this4 = this;

            if (!err) err = { code: 1006, reason: '' };

            _get(NodeClient.prototype.__proto__ || Object.getPrototypeOf(NodeClient.prototype), 'onError', this).call(this);

            /* Work-around for node; onClose not being called after error */
            setTimeout(function (_) {
                return _this4.onClose(err);
            });
        }
    }]);

    return NodeClient;
}(WebClient);

module.exports = NodeClient;

/***/ }
/******/ ]);
//# sourceMappingURL=client-node.js.map
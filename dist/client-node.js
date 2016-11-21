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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var _assign = __webpack_require__(6);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	options = (0, _assign2.default)(defaults, options);
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
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _message = __webpack_require__(5);

var _message2 = _interopRequireDefault(_message);

var _utils = __webpack_require__(0);

var _utils2 = _interopRequireDefault(_utils);

var _commonjs = __webpack_require__(1);

var _commonjs2 = _interopRequireDefault(_commonjs);

var _deferred = __webpack_require__(4);

var _deferred2 = _interopRequireDefault(_deferred);

var _debounce = __webpack_require__(7);

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebClient = function (_EventEmitter) {
	_inherits(WebClient, _EventEmitter);

	function WebClient() {
		var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ws://localhost';
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, WebClient);

		var _this = _possibleConstructorReturn(this, (WebClient.__proto__ || Object.getPrototypeOf(WebClient)).call(this));

		_this.url = url;

		_this.options = options;

		_this.ws_ = null;
		_this.id = null;
		_this.readyState = null;
		_this.reconnect = options.reconnect;

		_this.serverTimeout_ = 30000;
		_this.maxReconnectDelay = 60;
		_this.initialReconnectDelay = 1;
		_this.reconnectIncrementFactor = 2;
		_this.pingInterval = 60000;

		_this.deferreds_ = {};
		_this.connectDeferred_ = null;
		_this.disconnectDeferred_ = null;

		_this.state = WebClient.States.READY;

		_this.autoPing_ = _this.pingInterval > 0 ? (0, _debounce2.default)(function () {
			if (_this.state != WebClient.States.CONNECTED) return;

			_this.ping().then(function () {
				if (_this.pingInterval > 0 && _this.state == WebClient.States.CONNECTED) {
					_this.autoPing_();
				}
			}).catch(function () {});
		}, _this.pingInterval) : function () {};
		return _this;
	}

	_createClass(WebClient, [{
		key: 'connect',
		value: function connect() {
			var _this2 = this;

			switch (this.state) {
				case WebClient.States.CONNECTING:
					return Promise.reject(new Error('Could not connect, already trying to connect to a host...'));
				case WebClient.States.CONNECTED:
					return Promise.reject(new Error('Already connected.'));
				case WebClient.States.CLOSING:
					return Promise.reject(new Error('Terminating an active connecting, try again later.'));
				case WebClient.States.CLOSED:
				case WebClient.States.READY:
					this.connectDeferred_ = new _deferred2.default({
						handler: function handler() {
							_this2.state = WebClient.States.CONNECTING;
							_this2.emit(WebClient.Events.CONNECTING);

							setTimeout(function (_) {
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
	}, {
		key: 'disconnect',
		value: function disconnect(code, reason) {
			var _this3 = this;

			switch (this.state) {
				case WebClient.States.ERROR:
				case WebClient.States.CONNECTED:
				case WebClient.States.CONNECTING:
					var deferred = this.disconnectDeferred_ = new _deferred2.default({
						handler: function handler() {
							_this3.ws_.close(code, reason);
							_this3.state = WebClient.States.CLOSING;
						}
					});
					return deferred;
				case WebClient.States.CLOSED:
					return Promise.reject(new Error('There is no connection to disconnect.'));
				case WebClient.States.CLOSING:
					return Promise.reject(new Error('Already terminating a connecting, try again later.'));
			}
		}
	}, {
		key: 'bindEvents_',
		value: function bindEvents_() {
			this.ws_.onopen = this.onOpen.bind(this);
			this.ws_.onclose = this.onClose.bind(this);
			this.ws_.onerror = this.onError.bind(this);
			this.ws_.onmessage = this.onMessage.bind(this);
		}
	}, {
		key: 'unBindEvents_',
		value: function unBindEvents_() {
			if (!this.ws_) return;
			delete this.ws_.onopen;
			delete this.ws_.onclose;
			delete this.ws_.onerror;
			delete this.ws_.onmessage;
		}
	}, {
		key: 'disposeConnectionPromisses_',
		value: function disposeConnectionPromisses_() {
			if (this.connectDeferred_) {
				this.connectDeferred_.reject();
				this.connectDeferred_ = null;
			}

			if (this.disconnectDeferred_) {
				this.disconnectDeferred_.reject();
				this.disconnectDeferred_ = null;
			}
		}
	}, {
		key: 'onOpen',
		value: function onOpen() {
			var _this4 = this;

			// this.updateState_();
			// this.emit('_open');
			_utils2.default.retry(function (_) {
				return _this4.send(_message2.default.Names.HANDSHAKE, _this4.options.handshakePayload);
			}, { maxCount: 3, initialDelay: 1, increaseFactor: 1 }).then(function (data) {
				_this4.id = data.id;
				_this4.serverTimeout_ = data.timeout;
				_this4.maxReconnectDelay = data.maxReconnectDelay;
				_this4.initialReconnectDelay = data.initialReconnectDelay;
				_this4.reconnectIncrementFactor = data.reconnectIncrementFactor;
				_this4.pingInterval = data.pingInterval;

				if (_this4.connectDeferred_) {
					_this4.connectDeferred_.resolve(data.handshakePayload);
					_this4.connectDeferred_ = null;
				}

				_this4.state = WebClient.States.CONNECTED;
				_this4.emit(WebClient.Events.CONNECTED, data.handshakePayload);
			}).catch(function (err) {
				console.log('Handshake failed', err);
				return _this4.disconnect();
			}).catch(function (err) {
				console.log('Could not disconnect after failed handshake', err);
			});
		}
	}, {
		key: 'onClose',
		value: function onClose(e) {
			var _this5 = this;

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

			if (!this.reconnect || this.retrying_) return;

			this.retrying_ = true;
			_utils2.default.retry(function (_) {
				return _this5.connect();
			}, {
				maxCount: this.maxReconnectDelay,
				initialDelay: this.initialReconnectDelay,
				increaseFactor: this.reconnectIncrementFactor
			}).then(function (_) {
				_this5.retrying_ = false;
			});
		}
	}, {
		key: 'onError',
		value: function onError(err) {
			var eventName = this.state == WebClient.States.CONNECTING ? WebClient.Events.CONNECTING_ERROR : WebClient.Events.ERROR;

			this.state = WebClient.States.CLOSED;

			this.emit(eventName, err);
			this.disposeConnectionPromisses_();
		}
	}, {
		key: 'onMessage',
		value: function onMessage(e) {
			var _this6 = this;

			var message = _message2.default.parse(e.data);

			this.autoPing_();

			// Message without response (no id fields)
			if (!message.id && _message2.default.ReservedNames.indexOf(message.name) == -1) return this.emit(message.name, message);

			// Ping
			if (message.name == _message2.default.Names.PING) {
				return this.onPing_(message);
			}

			// Message response
			if (message.name == _message2.default.Names.RESPONSE && this.deferreds_[message.id]) {
				var deferred = this.deferreds_[message.id];

				if (message.err) {
					var err = Object.assign(new Error(), message.err);
					deferred.reject(err);
				} else {
					deferred.resolve(message.payload);
				}

				delete this.deferreds_[message.id];
				return;
			}

			// Message with response
			message.once('resolved', function (payload) {
				_this6.send_(message.createResponse(null, payload));
				message.dispose();
			});

			message.once('rejected', function (err) {
				if (_.isObject(err) && err instanceof Error && err.name == 'Error') err = { message: err.message, name: 'Error' };
				_this6.send_(message.createResponse(err));
				message.dispose();
			});

			this.emit(message.name, message);
		}
	}, {
		key: 'onPing_',
		value: function onPing_(message) {
			this.send_(message.createResponse(null, 'pong')).catch(function (err) {
				console.log('Ping responce failed to send', err);
			});
		}
	}, {
		key: 'send',
		value: function send(eventName, payload) {
			var _this7 = this;

			var message = new _message2.default({ name: eventName, payload: payload });
			message.setId();

			return this.send_(message).then(function (_) {
				var deferred = _this7.deferreds_[message.id] = new _deferred2.default({
					onExpire: function onExpire() {
						delete _this7.deferreds_[message.id];
					},
					timeout: _this7.serverTimeout_
				});

				return deferred;
			});
		}
	}, {
		key: 'sendWithoutResponse',
		value: function sendWithoutResponse(eventName, payload) {
			var message = new _message2.default({ name: eventName, payload: payload });
			return this.send_(message);
		}
	}, {
		key: 'send_',
		value: function send_(message) {
			var _this8 = this;

			return new Promise(function (resolve) {
				_this8.ws_.send(message.toString());
				resolve();
			});
		}
	}, {
		key: 'ping',
		value: function ping() {
			var _this9 = this;

			return _utils2.default.retry(function (_) {
				return _this9.send(_message2.default.Names.PING);
			}, { maxCount: 3, initialDelay: 1, increaseFactor: 1 }).catch(function (err) {
				_this9.disconnect();
				throw err;
			});
		}
	}]);

	return WebClient;
}(_commonjs2.default);

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

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("uws");

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isUndefined = __webpack_require__(10);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isObject = __webpack_require__(9);

var _isObject2 = _interopRequireDefault(_isObject);

var _isFunction = __webpack_require__(8);

var _isFunction2 = _interopRequireDefault(_isFunction);

var _values = __webpack_require__(11);

var _values2 = _interopRequireDefault(_values);

var _utils = __webpack_require__(0);

var _commonjs = __webpack_require__(1);

var _commonjs2 = _interopRequireDefault(_commonjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = function (_EventEmitter) {
	_inherits(Message, _EventEmitter);

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
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.generateDummyId)();

			this.id = id;
			return id;
		}
	}, {
		key: 'createResponse',
		value: function createResponse(err, payload) {
			return new Message({ name: '_r', payload: payload, err: err, id: this.id });
		}
	}, {
		key: 'resolve',
		value: function resolve(payload) {
			var _this2 = this;

			if ((0, _isUndefined2.default)(this.id)) return console.warn('[line] A message without an id cannot be resolved.');

			if (this.isResponded_) return console.warn('[line] This message has already been ended.');

			// If thenable
			if ((0, _isObject2.default)(payload) && (0, _isFunction2.default)(payload.then)) {
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
	}, {
		key: 'reject',
		value: function reject(err) {
			if ((0, _isUndefined2.default)(this.id)) return console.warn('[line] A message without an id cannot be rejected.');

			if (this.isResponded_) return console.warn('[line] This message has already been ended.');

			this.isResponded_ = true;
			this.emit('rejected', err);
		}
	}, {
		key: 'toString',
		value: function toString() {
			try {
				var data = { n: this.name };

				if (!(0, _isUndefined2.default)(this.payload)) data.p = this.payload;

				if (!(0, _isUndefined2.default)(this.id)) data.i = this.id;

				if (!(0, _isUndefined2.default)(this.err)) data.e = this.err;

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
}(_commonjs2.default);

exports.default = Message;


Message.Names = {
	RESPONSE: '_r',
	HANDSHAKE: '_h',
	PING: '_p'
};

Message.ReservedNames = (0, _values2.default)(Message.Names);

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = require("lodash/assign");

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("lodash/debounce");

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = require("lodash/isFunction");

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("lodash/isObject");

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = require("lodash/isUndefined");

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = require("lodash/values");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uws = __webpack_require__(3);

var _uws2 = _interopRequireDefault(_uws);

var _clientWeb = __webpack_require__(2);

var _clientWeb2 = _interopRequireDefault(_clientWeb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

global.WebSocket = _uws2.default;

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
	}]);

	return NodeClient;
}(_clientWeb2.default);

module.exports = NodeClient;

/***/ }
/******/ ]);
//# sourceMappingURL=client-node.js.map
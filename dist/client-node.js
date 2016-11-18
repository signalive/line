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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _uws = __webpack_require__(1);
	
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("uws");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _message = __webpack_require__(3);
	
	var _message2 = _interopRequireDefault(_message);
	
	var _utils = __webpack_require__(7);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	var _eventEmitterExtra = __webpack_require__(6);
	
	var _eventEmitterExtra2 = _interopRequireDefault(_eventEmitterExtra);
	
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
	
			_this.promiseCallbacks_ = {};
			_this.connectPromiseCallback_ = {};
			_this.disconnectPromiseCallback_ = {};
	
			_this.state = WebClient.States.READY;
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
						return new Promise(function (resolve, reject) {
							setTimeout(function (_) {
								_this2.ws_ = new WebSocket(_this2.url);
								_this2.connectPromiseCallback_ = { resolve: resolve, reject: reject };
								_this2.bindEvents_();
	
								_this2.state = WebClient.States.CONNECTING;
								_this2.emit(WebClient.Events.CONNECTING);
							}, 0);
						});
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
						return new Promise(function (resolve, reject) {
							_this3.ws_.close(code, reason);
							_this3.state = WebClient.States.CLOSING;
							_this3.disconnectPromiseCallback_ = { resolve: resolve, reject: reject };
						});
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
				if (this.connectPromiseCallback_.reject) {
					this.connectPromiseCallback_.reject();
					this.connectPromiseCallback_ = {};
				}
	
				if (this.disconnectPromiseCallback_.resolve) {
					this.disconnectPromiseCallback_.resolve();
					this.disconnectPromiseCallback_ = {};
				}
			}
		}, {
			key: 'onOpen',
			value: function onOpen() {
				// this.updateState_();
				// this.emit('_open');
			}
		}, {
			key: 'onClose',
			value: function onClose(e) {
				var _this4 = this;
	
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
				_utils2.default.retry(function (_) {
					return _this4.connect();
				}, {
					maxCount: this.maxReconnectDelay,
					initialDelay: this.initialReconnectDelay,
					increaseFactor: this.reconnectIncrementFactor
				}).then(function (_) {
					_this4.retrying_ = false;
				});
			}
		}, {
			key: 'onError',
			value: function onError(err) {
				var eventName = this.state == WebClient.States.CONENCTING ? WebClient.Events.CONNECTING_ERROR : WebClient.Events.ERROR;
	
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
		}, {
			key: 'onMessage',
			value: function onMessage(e) {
				var _this5 = this;
	
				var message = _message2.default.parse(e.data);
	
				// Message without response (no id fields)
				if (!message.id && _message2.default.reservedNames.indexOf(message.name) == -1) return this.emit(message.name, message);
	
				// Handshake
				if (message.name == '_h') {
					this.id = message.payload.id;
					this.serverTimeout_ = message.payload.timeout;
					this.maxReconnectDelay = message.payload.maxReconnectDelay;
					this.initialReconnectDelay = message.payload.initialReconnectDelay;
					this.reconnectIncrementFactor = message.payload.reconnectIncrementFactor;
	
					return this.send_(message.createResponse()).then(function (_) {
						message.dispose();
	
						if (_this5.connectPromiseCallback_.resolve) {
							_this5.connectPromiseCallback_.resolve();
							_this5.connectPromiseCallback_ = {};
						}
	
						_this5.state = WebClient.States.CONNECTED;
						_this5.emit(WebClient.Events.CONNECTED);
					});
				}
	
				// Message response
				if (message.name == '_r' && this.promiseCallbacks_[message.id]) {
					var _promiseCallbacks_$me = this.promiseCallbacks_[message.id],
					    resolve = _promiseCallbacks_$me.resolve,
					    reject = _promiseCallbacks_$me.reject,
					    timeout = _promiseCallbacks_$me.timeout;
	
					clearTimeout(timeout);
	
					if (message.err) {
						var err = _.assign(new Error(), message.err);
						reject(err);
					} else {
						resolve(message.payload);
					}
	
					delete this.promiseCallbacks_[message.id];
					return;
				}
	
				// Message with response
				message.once('resolved', function (payload) {
					_this5.send_(message.createResponse(null, payload));
					message.dispose();
				});
	
				message.once('rejected', function (err) {
					if (_.isObject(err) && err instanceof Error && err.name == 'Error') err = { message: err.message, name: 'Error' };
					_this5.send_(message.createResponse(err));
					message.dispose();
				});
	
				this.emit(message.name, message);
			}
		}, {
			key: 'send',
			value: function send(eventName, payload) {
				var _this6 = this;
	
				var message = new _message2.default({ name: eventName, payload: payload });
				var messageId = message.setId();
				return this.send_(message).then(function (_) {
					return new Promise(function (resolve, reject) {
						var timeout = setTimeout(function (_) {
							/* Connections has been closed. */
							if (!_this6.promiseCallbacks[messageId]) return;
	
							var _promiseCallbacks_$me2 = _this6.promiseCallbacks_[messageId],
							    reject = _promiseCallbacks_$me2.reject,
							    timeout = _promiseCallbacks_$me2.timeout;
	
							clearTimeout(timeout);
							reject(new Error('Timeout reached'));
							delete _this6.promiseCallbacks_[messageId];
						}, _this6.serverTimeout_);
	
						_this6.promiseCallbacks_[messageId] = { resolve: resolve, reject: reject, timeout: timeout };
					});
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
				var _this7 = this;
	
				return new Promise(function (resolve) {
					_this7.ws_.send(message.toString());
					resolve();
				});
			}
		}]);
	
		return WebClient;
	}(_eventEmitterExtra2.default);
	
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _isUndefined = __webpack_require__(4);
	
	var _isUndefined2 = _interopRequireDefault(_isUndefined);
	
	var _nodeUuid = __webpack_require__(5);
	
	var uuid = _interopRequireWildcard(_nodeUuid);
	
	var _eventEmitterExtra = __webpack_require__(6);
	
	var _eventEmitterExtra2 = _interopRequireDefault(_eventEmitterExtra);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
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
				var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : uuid.v4();
	
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
				if ((0, _isUndefined2.default)(this.id)) return console.warn('[line] A message without an id cannot be resolved.');
	
				if (this.isResponded_) return console.warn('[line] This message has already been ended.');
	
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
				var _this2 = this;
	
				var events = this.eventNames();
				events.forEach(function (event) {
					return _this2.removeAllListeners(event);
				});
			}
		}]);
	
		return Message;
	}(_eventEmitterExtra2.default);
	
	exports.default = Message;
	
	
	Message.reservedNames = ['_r', '_h'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("lodash/isUndefined");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("node-uuid");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("event-emitter-extra");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _assign = __webpack_require__(8);
	
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
	
	module.exports = { promiseDelay: promiseDelay, retry: retry };

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("lodash/assign");

/***/ }
/******/ ]);
//# sourceMappingURL=client-node.js.map
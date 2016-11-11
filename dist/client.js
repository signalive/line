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
	
	var _message = __webpack_require__(2);
	
	var _message2 = _interopRequireDefault(_message);
	
	var _events = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Client = function (_EventEmitter) {
		_inherits(Client, _EventEmitter);
	
		function Client(options) {
			_classCallCheck(this, Client);
	
			var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this));
	
			_this.promiseCallbacks = {};
			_this.options = options;
			return _this;
		}
	
		_createClass(Client, [{
			key: 'connect',
			value: function connect() {
				var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'localhost';
	
				this.ws = new _uws2.default(url, this.options);
				this.readyState = this.ws.readyState;
				this.bindEvents();
			}
		}, {
			key: 'bindEvents',
			value: function bindEvents() {
				this.ws.on('open', this.onOpen.bind(this));
				this.ws.on('close', this.onClose.bind(this));
				this.ws.on('error', this.onError.bind(this));
				this.ws.on('message', this.onMessage.bind(this));
			}
		}, {
			key: 'onOpen',
			value: function onOpen() {
				this.readyState = this.ws.readyState;
				this.emit('open');
			}
		}, {
			key: 'onClose',
			value: function onClose(code, message) {
				this.readyState = this.ws.readyState;
				this.emit('close', code, message);
			}
		}, {
			key: 'onError',
			value: function onError(err) {
				this.readyState = this.ws.readyState;
				this.emit('error', err);
			}
		}, {
			key: 'onMessage',
			value: function onMessage(data, flags) {
				var _this2 = this;
	
				var message = _message2.default.parse(data);
	
				if (!message.options.id) return this.emit(message.event, message.payload, message);
	
				if (message.event == '_ack') {
					var _promiseCallbacks$mes = this.promiseCallbacks[message.options.id],
					    resolve = _promiseCallbacks$mes.resolve,
					    reject = _promiseCallbacks$mes.reject;
	
	
					if (message.options.failed) {
						var err = _.assign(new Error(), err);
						reject(err);
					} else {
						resolve(message.payload);
					}
	
					delete this.promiseCallbacks[message.options.id];
					return;
				}
	
				var done = function done(err, payload) {
					if (_.isObject(err) && err instanceof Error && err.name == 'Error') err = { message: err.message, name: 'Error' };
	
					var response = err ? new _message2.default('_ack', err, { failed: true, id: message.options.id }) : new _message2.default('_ack', payload, { id: message.options.id });
					_this2.send_(response);
				};
	
				this.emit(message.event, message.payload, done, message);
			}
		}, {
			key: 'send',
			value: function send(eventName, payload) {
				var _this3 = this;
	
				var message = new _message2.default(eventName, payload);
				var messageId = message.setId();
				return this.send_(message).then(function (_) {
					return new Promise(function (resolve, reject) {
						_this3.promiseCallbacks[messageId] = { resolve: resolve, reject: reject };
					});
				});
			}
		}, {
			key: 'send_',
			value: function send_(message) {
				var _this4 = this;
	
				return new Promise(function (resolve, reject) {
					_this4.ws.send(message.toString(), function (err) {
						if (err) return reject(err);
						resolve();
					});
				});
			}
		}]);
	
		return Client;
	}(_events.EventEmitter);
	
	module.exports = Client;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("uws");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _lodash = __webpack_require__(3);
	
	var _ = _interopRequireWildcard(_lodash);
	
	var _nodeUuid = __webpack_require__(4);
	
	var uuid = _interopRequireWildcard(_nodeUuid);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Message = function () {
		_createClass(Message, null, [{
			key: 'parse',
			value: function parse(raw) {
				try {
					var data = JSON.parse(raw);
					return new Message(data.event, data.payload, data.options);
				} catch (err) {
					throw new Error('Could not parse message.');
				}
			}
		}]);
	
		function Message(event, payload) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
			_classCallCheck(this, Message);
	
			this.event = event;
			this.payload = payload;
			this.options = options;
		}
	
		_createClass(Message, [{
			key: 'setId',
			value: function setId(id) {
				if (!id) id = uuid.v4();
				this.options.id = id;
				return id;
			}
		}, {
			key: 'toString',
			value: function toString() {
				try {
					var data = { event: this.event };
	
					if (!_.isUndefined(this.payload)) data.payload = this.payload;
	
					if (!_.isEmpty(this.options)) data.options = this.options;
	
					return JSON.stringify(data);
				} catch (err) {
					throw new Error('Could not stringify message.');
				}
			}
		}]);
	
		return Message;
	}();
	
	exports.default = Message;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("node-uuid");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ }
/******/ ]);
//# sourceMappingURL=client.js.map
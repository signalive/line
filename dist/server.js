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
	
	var _connection = __webpack_require__(2);
	
	var _connection2 = _interopRequireDefault(_connection);
	
	var _rooms = __webpack_require__(11);
	
	var _rooms2 = _interopRequireDefault(_rooms);
	
	var _eventEmitterExtra = __webpack_require__(8);
	
	var _eventEmitterExtra2 = _interopRequireDefault(_eventEmitterExtra);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Server = function (_EventEmitter) {
		_inherits(Server, _EventEmitter);
	
		function Server(options) {
			_classCallCheck(this, Server);
	
			var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));
	
			_this.rooms = new _rooms2.default();
	
			_this.options = Object.assign({
				timeout: 30000,
				maxReconnectDelay: 60,
				initialReconnectDelay: 1,
				reconnectIncrementFactor: 1
			}, options || {});
			return _this;
		}
	
		_createClass(Server, [{
			key: 'start',
			value: function start() {
				var _this2 = this;
	
				if (!this.options.port) {
					this.server = new _uws.Server(this.options);
					this.bindEvents();
					return Promise.resolve();
				}
	
				return new Promise(function (resolve, reject) {
					_this2.server = new _uws.Server(_this2.options, function (err) {
						if (err) return reject(err);
						_this2.bindEvents();
						resolve();
					});
				});
			}
		}, {
			key: 'stop',
			value: function stop() {
				var _this3 = this;
	
				if (!this.server) {
					var err = new Error('Could not stop server. Server is probably not started, or already stopped.');
					return Promise.reject(err);
				}
	
				return new Promise(function (resolve) {
					_this3.server.close();
					_this3.server = null;
					resolve();
				});
			}
		}, {
			key: 'bindEvents',
			value: function bindEvents() {
				this.server.on('connection', this.onConnection.bind(this));
			}
		}, {
			key: 'onConnection',
			value: function onConnection(socket) {
				var _this4 = this;
	
				var connection = new _connection2.default(socket, this);
				connection.on('_handshakeOk', function () {
					return _this4.emit('connection', connection);
				});
			}
		}, {
			key: 'getConnectionById',
			value: function getConnectionById(id) {
				return this.rooms.getRoom('/').getConnectionById(id);
			}
		}, {
			key: 'broadcast',
			value: function broadcast(eventName, payload) {
				return this.rooms.getRoom('/').broadcast(eventName, payload);
			}
		}]);
	
		return Server;
	}(_eventEmitterExtra2.default);
	
	module.exports = Server;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("uws");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(3);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	var _message = __webpack_require__(5);
	
	var _message2 = _interopRequireDefault(_message);
	
	var _eventEmitterExtra = __webpack_require__(8);
	
	var _eventEmitterExtra2 = _interopRequireDefault(_eventEmitterExtra);
	
	var _assign = __webpack_require__(4);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _forEach = __webpack_require__(9);
	
	var _forEach2 = _interopRequireDefault(_forEach);
	
	var _isObject = __webpack_require__(10);
	
	var _isObject2 = _interopRequireDefault(_isObject);
	
	var _nodeUuid = __webpack_require__(7);
	
	var uuid = _interopRequireWildcard(_nodeUuid);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Connection = function (_EventEmitter) {
		_inherits(Connection, _EventEmitter);
	
		function Connection(socket, server) {
			_classCallCheck(this, Connection);
	
			var _this = _possibleConstructorReturn(this, (Connection.__proto__ || Object.getPrototypeOf(Connection)).call(this));
	
			_this.id = uuid.v4();
	
			_this.socket = socket;
			_this.server = server;
	
			_this.promiseCallbacks = {};
			_this.socket.on('message', _this.onMessage.bind(_this));
			_this.socket.on('error', _this.onError.bind(_this));
			_this.socket.on('close', _this.onClose.bind(_this));
	
			_this.handshake_ = false;
			_utils2.default.retry(function (_) {
				return _this.send('_h', {
					id: _this.id,
					timeout: _this.server.options.timeout,
					maxReconnectDelay: _this.server.options.maxReconnectDelay,
					initialReconnectDelay: _this.server.options.initialReconnectDelay,
					reconnectIncrementFactor: _this.server.options.reconnectIncrementFactor
				});
			}, { maxCount: 3, initialDelay: 1, increaseFactor: 1 }).then(function (_) {
				_this.joinRoom('/');
				_this.handshake_ = true;
				_this.emit('_handshakeOk');
			}).catch(function (err) {
				_this.handshake_ = false;
				console.log('Handshake failed for ' + _this.id + '.');
				_this.onClose(500, err);
			});
			return _this;
		}
	
		_createClass(Connection, [{
			key: 'onMessage',
			value: function onMessage(data, flags) {
				var _this2 = this;
	
				var message = _message2.default.parse(data);
	
				// Message without response (no id fields)
				if (!message.id && _message2.default.reservedNames.indexOf(message.name) == -1) return this.emit(message.name, message);
	
				// Message response
				if (message.name == '_r' && this.promiseCallbacks[message.id]) {
					var _promiseCallbacks$mes = this.promiseCallbacks[message.id],
					    resolve = _promiseCallbacks$mes.resolve,
					    reject = _promiseCallbacks$mes.reject,
					    timeout = _promiseCallbacks$mes.timeout;
	
					clearTimeout(timeout);
	
					if (message.err) {
						var err = (0, _assign2.default)(new Error(), message.err);
						reject(err);
					} else {
						resolve(message.payload);
					}
	
					delete this.promiseCallbacks[message.id];
					return;
				}
	
				// Message with response
				message.once('resolved', function (payload) {
					_this2.send_(message.createResponse(null, payload));
					message.dispose();
				});
	
				message.once('rejected', function (err) {
					if ((0, _isObject2.default)(err) && err instanceof Error && err.name == 'Error') err = { message: err.message, name: 'Error' };
					_this2.send_(message.createResponse(err));
					message.dispose();
				});
	
				this.emit(message.name, message);
			}
		}, {
			key: 'onError',
			value: function onError(error) {
				this.emit('_error', error);
			}
		}, {
			key: 'onClose',
			value: function onClose(code, message) {
				this.server.rooms.removeFromAll(this);
	
				(0, _forEach2.default)(this.promiseCallbacks, function (callbacks) {
					callbacks.reject(new Error('Socket connection closed!'));
				});
				this.promiseCallbacks = {};
	
				this.emit('_close', code, message);
			}
		}, {
			key: 'joinRoom',
			value: function joinRoom(roomName) {
				this.server.rooms.add(roomName, this);
			}
		}, {
			key: 'leaveRoom',
			value: function leaveRoom(roomName) {
				this.server.rooms.remove(roomName, this);
			}
		}, {
			key: 'getRooms',
			value: function getRooms() {
				this.server.rooms.getRoomsOf(this);
			}
		}, {
			key: 'send',
			value: function send(eventName, payload) {
				var _this3 = this;
	
				var message = new _message2.default({ name: eventName, payload: payload });
				var messageId = message.setId();
				return this.send_(message).then(function (_) {
					return new Promise(function (resolve, reject) {
						var timeout = setTimeout(function (_) {
							/* Connections has been closed. */
							if (!_this3.promiseCallbacks[messageId]) return;
	
							var _promiseCallbacks$mes2 = _this3.promiseCallbacks[messageId],
							    reject = _promiseCallbacks$mes2.reject,
							    timeout = _promiseCallbacks$mes2.timeout;
	
							clearTimeout(timeout);
							reject(new Error('Timeout reached'));
							delete _this3.promiseCallbacks[messageId];
						}, _this3.server.options.timeout);
	
						_this3.promiseCallbacks[messageId] = { resolve: resolve, reject: reject, timeout: timeout };
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
				var _this4 = this;
	
				return new Promise(function (resolve, reject) {
					_this4.socket.send(message.toString(), function (err) {
						if (err) return reject(err);
						resolve();
					});
				});
			}
		}]);
	
		return Connection;
	}(_eventEmitterExtra2.default);
	
	module.exports = Connection;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _assign = __webpack_require__(4);
	
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
/* 4 */
/***/ function(module, exports) {

	module.exports = require("lodash/assign");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _isUndefined = __webpack_require__(6);
	
	var _isUndefined2 = _interopRequireDefault(_isUndefined);
	
	var _nodeUuid = __webpack_require__(7);
	
	var uuid = _interopRequireWildcard(_nodeUuid);
	
	var _eventEmitterExtra = __webpack_require__(8);
	
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
/* 6 */
/***/ function(module, exports) {

	module.exports = require("lodash/isUndefined");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("node-uuid");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("event-emitter-extra");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("lodash/forEach");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("lodash/isObject");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _filter = __webpack_require__(12);
	
	var _filter2 = _interopRequireDefault(_filter);
	
	var _forEach = __webpack_require__(9);
	
	var _forEach2 = _interopRequireDefault(_forEach);
	
	var _map = __webpack_require__(13);
	
	var _map2 = _interopRequireDefault(_map);
	
	var _room = __webpack_require__(14);
	
	var _room2 = _interopRequireDefault(_room);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Rooms = function () {
		function Rooms() {
			_classCallCheck(this, Rooms);
	
			this.rooms = { '/': new _room2.default('/') };
		}
	
		_createClass(Rooms, [{
			key: 'add',
			value: function add(roomName, connection) {
				if (!this.rooms[roomName]) this.rooms[roomName] = new _room2.default(roomName);
	
				this.rooms[roomName].add(connection);
			}
		}, {
			key: 'remove',
			value: function remove(roomName, connection) {
				if (!this.rooms[roomName]) return;
	
				this.rooms[roomName].remove(connection);
	
				if (roomName != '/' && !this.rooms[roomName].getConnectionsCount()) delete this.rooms[roomName];
			}
		}, {
			key: 'getRoomsOf',
			value: function getRoomsOf(connection) {
				return (0, _map2.default)((0, _filter2.default)(this.rooms, function (room) {
					return room.getConnectionById(connection.id);
				}), 'name');
			}
		}, {
			key: 'getRoom',
			value: function getRoom(room) {
				return this.rooms[room];
			}
		}, {
			key: 'removeFromAll',
			value: function removeFromAll(connection) {
				var _this = this;
	
				var rooms = this.getRoomsOf(connection);
				(0, _forEach2.default)(rooms, function (roomName) {
					return _this.rooms[roomName].remove(connection);
				});
			}
		}]);
	
		return Rooms;
	}();
	
	exports.default = Rooms;

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("lodash/filter");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("lodash/map");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _forEach = __webpack_require__(9);
	
	var _forEach2 = _interopRequireDefault(_forEach);
	
	var _message = __webpack_require__(5);
	
	var _message2 = _interopRequireDefault(_message);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Room = function () {
		function Room(name) {
			var connections = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
			_classCallCheck(this, Room);
	
			this.name = name;
			this.connections = connections;
		}
	
		_createClass(Room, [{
			key: 'add',
			value: function add(connection) {
				this.connections[connection.id] = connection;
			}
		}, {
			key: 'remove',
			value: function remove(connection) {
				delete this.connections[connection.id];
			}
		}, {
			key: 'getConnectionById',
			value: function getConnectionById(connectionId) {
				return this.connections[connectionId];
			}
		}, {
			key: 'getConnectionsCount',
			value: function getConnectionsCount() {
				return Object.keys(this.connections).length;
			}
		}, {
			key: 'broadcast_',
			value: function broadcast_(message) {
				(0, _forEach2.default)(this.connections, function (connection) {
					connection.send_(message);
				});
			}
		}, {
			key: 'broadcast',
			value: function broadcast(eventName, payload) {
				var message = new _message2.default({ name: eventName, payload: payload });
				(0, _forEach2.default)(this.connections, function (connection, index) {
					connection.send_(message);
				});
			}
		}]);
	
		return Room;
	}();
	
	exports.default = Room;

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map
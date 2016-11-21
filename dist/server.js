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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("event-emitter-extra/dist/commonjs.modern");

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("lodash/forEach");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isUndefined = __webpack_require__(14);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isObject = __webpack_require__(5);

var _isObject2 = _interopRequireDefault(_isObject);

var _isFunction = __webpack_require__(13);

var _isFunction2 = _interopRequireDefault(_isFunction);

var _values = __webpack_require__(16);

var _values2 = _interopRequireDefault(_values);

var _utils = __webpack_require__(3);

var _commonjs = __webpack_require__(0);

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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

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

// http://stackoverflow.com/a/6248722
function generateDummyId() {
	var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

	return ("0000" + (Math.random() * Math.pow(36, length) << 0).toString(36)).slice(-length);
}

module.exports = { promiseDelay: promiseDelay, retry: retry, generateDummyId: generateDummyId };

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = require("lodash/assign");

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("lodash/isObject");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(3);

var _utils2 = _interopRequireDefault(_utils);

var _message = __webpack_require__(2);

var _message2 = _interopRequireDefault(_message);

var _commonjs = __webpack_require__(0);

var _commonjs2 = _interopRequireDefault(_commonjs);

var _assign = __webpack_require__(4);

var _assign2 = _interopRequireDefault(_assign);

var _forEach = __webpack_require__(1);

var _forEach2 = _interopRequireDefault(_forEach);

var _isObject = __webpack_require__(5);

var _isObject2 = _interopRequireDefault(_isObject);

var _debounce = __webpack_require__(11);

var _debounce2 = _interopRequireDefault(_debounce);

var _deferred = __webpack_require__(9);

var _deferred2 = _interopRequireDefault(_deferred);

var _nodeUuid = __webpack_require__(17);

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

		_this.deferreds_ = {};
		_this.state = Connection.States.OPEN;

		_this.socket.on('message', _this.onMessage_.bind(_this));
		_this.socket.on('error', _this.onError_.bind(_this));
		_this.socket.on('close', _this.onClose_.bind(_this));

		_this.autoPing_ = server.options.pingInterval > 0 ? (0, _debounce2.default)(function () {
			if (_this.state != Connection.States.OPEN) return;

			_this.ping().then(function () {
				if (server.options.pingInterval > 0 && _this.state == Connection.States.OPEN) {
					_this.autoPing_();
				}
			}).catch(function () {});
		}, server.options.pingInterval) : function () {};
		return _this;
	}

	_createClass(Connection, [{
		key: 'onMessage_',
		value: function onMessage_(data, flags) {
			var _this2 = this;

			var message = _message2.default.parse(data);

			this.autoPing_();

			// Emit original _message event with raw data
			this.emit(Connection.Events.MESSAGE, data);

			// Message without response (no id fields)
			if (!message.id && _message2.default.ReservedNames.indexOf(message.name) == -1) return this.emit(message.name, message);

			// Handshake
			if (message.name == _message2.default.Names.HANDSHAKE) {
				return this.onHandshake_(message);
			}

			// Ping
			if (message.name == _message2.default.Names.PING) {
				return this.onPing_(message);
			}

			// Message response
			if (message.name == _message2.default.Names.RESPONSE && this.deferreds_[message.id]) {
				return this.onResponse_(message);
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
		key: 'onHandshake_',
		value: function onHandshake_(message) {
			var _this3 = this;

			message.once('resolved', function (payload) {
				var responsePayload = {
					handshakePayload: payload,
					id: _this3.id,
					timeout: _this3.server.options.timeout,
					maxReconnectDelay: _this3.server.options.maxReconnectDelay,
					initialReconnectDelay: _this3.server.options.initialReconnectDelay,
					reconnectIncrementFactor: _this3.server.options.reconnectIncrementFactor,
					pingInterval: _this3.server.options.pingInterval
				};

				_this3.send_(message.createResponse(null, responsePayload)).then(function () {
					_this3.joinRoom('/');
					_this3.emit(Connection.Events.HANDSHAKE_OK);
				}).catch(function () {
					console.log('Handshake resolve response failed to send for ' + _this3.id + '.');
					_this3.onClose_(500, err);
				}).then(function () {
					message.dispose();
				});
			});

			message.once('rejected', function (err) {
				if ((0, _isObject2.default)(err) && err instanceof Error && err.name == 'Error') err = { message: err.message, name: 'Error' };

				_this3.send_(message.createResponse(err)).catch(function (err_) {
					console.log('Handshake reject response failed to send for ' + _this3.id + '.');
				}).then(function () {
					_this3.onClose_(500, err);
					message.dispose();
				});
			});

			// Sorry for party rocking
			var handshakeResponse = this.server.emit('handshake', this, message);

			if (!handshakeResponse) message.resolve();
		}
	}, {
		key: 'onResponse_',
		value: function onResponse_(message) {
			var deferred = this.deferreds_[message.id];

			if (message.err) {
				var _err = (0, _assign2.default)(new Error(), message.err);
				deferred.reject(_err);
			} else {
				deferred.resolve(message.payload);
			}

			delete this.deferreds_[message.id];
		}
	}, {
		key: 'onPing_',
		value: function onPing_(message) {
			this.send_(message.createResponse(null, 'pong')).catch(function (err) {
				console.log('Ping responce failed to send', err);
			});
		}
	}, {
		key: 'onError_',
		value: function onError_(err) {
			this.emit(Connection.Events.ERROR, err);
			this.onClose_(500, err);
		}
	}, {
		key: 'onClose_',
		value: function onClose_(code, message) {
			if (this.state == Connection.States.CLOSE) return;

			this.server.rooms.removeFromAll(this);

			(0, _forEach2.default)(this.deferreds_, function (deferred) {
				deferred.reject(new Error('Socket connection closed!'));
			});
			this.deferreds_ = {};

			this.state = Connection.States.CLOSE;
			this.emit(Connection.Events.CLOSE, code, message);
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
			var _this4 = this;

			var message = new _message2.default({ name: eventName, payload: payload });
			message.setId();

			return this.send_(message).then(function (_) {
				var deferred = _this4.deferreds_[message.id] = new _deferred2.default({
					onExpire: function onExpire() {
						delete _this4.deferreds_[message.id];
					},
					timeout: _this4.server.options.timeout
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
			var _this5 = this;

			return new Promise(function (resolve, reject) {
				_this5.socket.send(message.toString(), function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
		}
	}, {
		key: 'ping',
		value: function ping() {
			var _this6 = this;

			return _utils2.default.retry(function (_) {
				return _this6.send(_message2.default.Names.PING);
			}, { maxCount: 3, initialDelay: 1, increaseFactor: 1 }).catch(function (err) {
				_this6.onClose_(410, new Error('Ping failed, dead connection'));
				throw err;
			});
		}
	}]);

	return Connection;
}(_commonjs2.default);

Connection.States = {
	OPEN: 'open',
	CLOSE: 'close'
};

Connection.Events = {
	MESSAGE: '_message',
	HANDSHAKE_OK: '_handshakeOk', // Private
	ERROR: '_error',
	CLOSE: '_close'
};

module.exports = Connection;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _filter = __webpack_require__(12);

var _filter2 = _interopRequireDefault(_filter);

var _forEach = __webpack_require__(1);

var _forEach2 = _interopRequireDefault(_forEach);

var _map = __webpack_require__(15);

var _map2 = _interopRequireDefault(_map);

var _room = __webpack_require__(10);

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
/* 8 */
/***/ function(module, exports) {

module.exports = require("uws");

/***/ },
/* 9 */
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _forEach = __webpack_require__(1);

var _forEach2 = _interopRequireDefault(_forEach);

var _message = __webpack_require__(2);

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

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = require("lodash/debounce");

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = require("lodash/filter");

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("lodash/isFunction");

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = require("lodash/isUndefined");

/***/ },
/* 15 */
/***/ function(module, exports) {

module.exports = require("lodash/map");

/***/ },
/* 16 */
/***/ function(module, exports) {

module.exports = require("lodash/values");

/***/ },
/* 17 */
/***/ function(module, exports) {

module.exports = require("node-uuid");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uws = __webpack_require__(8);

var _connection = __webpack_require__(6);

var _connection2 = _interopRequireDefault(_connection);

var _rooms = __webpack_require__(7);

var _rooms2 = _interopRequireDefault(_rooms);

var _commonjs = __webpack_require__(0);

var _commonjs2 = _interopRequireDefault(_commonjs);

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
			reconnectIncrementFactor: 1,
			pingInterval: 60000
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
			this.server.on('headers', this.onHeaders.bind(this));
			this.server.on('error', this.onError.bind(this));
		}
	}, {
		key: 'onConnection',
		value: function onConnection(socket) {
			var _this4 = this;

			var connection = new _connection2.default(socket, this);
			connection.on(_connection2.default.Events.HANDSHAKE_OK, function () {
				return _this4.emit(Server.Events.CONNECTION, connection);
			});
		}
	}, {
		key: 'onHeaders',
		value: function onHeaders(headers) {
			this.emit(Server.Events.HEADERS, headers);
		}
	}, {
		key: 'onError',
		value: function onError(err) {
			this.emit(Server.Events.ERROR, err);
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
}(_commonjs2.default);

Server.Events = {
	CONNECTION: 'connection',
	HANDSHAKE: 'handshake',
	HEADERS: 'headers',
	ERROR: 'error'
};

module.exports = Server;

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map
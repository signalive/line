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
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
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
/***/ function(module, exports) {

module.exports = require("debug");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isUndefined = __webpack_require__(16);
var isObject = __webpack_require__(6);
var isFunction = __webpack_require__(15);
var values = __webpack_require__(18);

var _require = __webpack_require__(4),
    generateDummyId = _require.generateDummyId;

var EventEmitterExtra = __webpack_require__(0);

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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var assign = __webpack_require__(5);

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
/* 5 */
/***/ function(module, exports) {

module.exports = require("lodash/assign");

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = require("lodash/isObject");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Utils = __webpack_require__(4);
var Message = __webpack_require__(3);
var EventEmitterExtra = __webpack_require__(0);
var assign = __webpack_require__(5);
var forEach = __webpack_require__(1);
var isObject = __webpack_require__(6);
var debounce = __webpack_require__(13);
var Deferred = __webpack_require__(10);
var uuid = __webpack_require__(19);
var debug = __webpack_require__(2)('line:server:connection');

/**
 * Server connection class. Constructor of this class is not publicly accessible.
 * When you listen `Server.Events.CONNECTION` or `Server.Events.HANDSHAKE`, an instance
 * of `ServerConnection` will be emitted.
 *
 * @class ServerConnection
 * @extends {EventEmitterExtra}
 * @private
 * @property {string} id Unique connection id
 */

var ServerConnection = function (_EventEmitterExtra) {
    _inherits(ServerConnection, _EventEmitterExtra);

    function ServerConnection(socket, server) {
        _classCallCheck(this, ServerConnection);

        var _this = _possibleConstructorReturn(this, (ServerConnection.__proto__ || Object.getPrototypeOf(ServerConnection)).call(this));

        _this.id = uuid.v4();
        debug('Creating connection with id ' + _this.id + ' ...');

        _this.socket = socket;
        _this.server = server;

        _this.deferreds_ = {};
        _this.state = ServerConnection.States.OPEN;
        _this.handshakeResolved_ = false;

        _this.socket.on('message', _this.onMessage_.bind(_this));
        _this.socket.on('error', _this.onError_.bind(_this));
        _this.socket.on('close', _this.onClose_.bind(_this));

        _this.autoPing_ = server.options.pingInterval > 0 ? debounce(function () {
            if (_this.state != ServerConnection.States.OPEN) {
                debug('Not auto-pinging, connection state (' + _this.state + ') is not open');
                return;
            }

            _this.ping().then(function () {
                debug('Auto-ping successful');

                if (server.options.pingInterval > 0 && _this.state == ServerConnection.States.OPEN) {
                    _this.autoPing_();
                }
            }).catch(function (err) {
                debug('Auto-ping failed: ' + err.toString());
            });
        }, server.options.pingInterval) : function () {};
        return _this;
    }

    _createClass(ServerConnection, [{
        key: 'onMessage_',
        value: function onMessage_(data, flags) {
            var _this2 = this;

            var message = Message.parse(data);
            debug('Native "message" event recieved: ' + data);

            this.autoPing_();

            // Emit original _message event with raw data
            this.emit(ServerConnection.Events.MESSAGE, data);

            // Message without response (no id fields)
            if (!message.id && Message.ReservedNames.indexOf(message.name) == -1) {
                return this.emit(message.name, message);
            }

            // Handshake
            if (message.name == Message.Names.HANDSHAKE) {
                return this.onHandshake_(message);
            }

            // Ping
            if (message.name == Message.Names.PING) {
                return this.onPing_(message);
            }

            // Message response
            if (message.name == Message.Names.RESPONSE && this.deferreds_[message.id]) {
                return this.onResponse_(message);
            }

            // Message with response
            message.once('resolved', function (payload) {
                debug('Message #' + message.id + ' is resolved, sending response...');
                _this2.send_(message.createResponse(null, payload));
                message.dispose();
            });

            message.once('rejected', function (err) {
                debug('Message #' + message.id + ' is rejected, sending response...');
                if (isObject(err) && err instanceof Error) err = assign({ message: err.message, name: err.name }, err);
                _this2.send_(message.createResponse(err));
                message.dispose();
            });

            this.emit(message.name, message);
        }
    }, {
        key: 'onHandshake_',
        value: function onHandshake_(message) {
            var _this3 = this;

            debug('Handshake message recieved: ' + message);

            message.once('resolved', function (payload) {
                debug('Handshake is resolved, sending response...');
                _this3.handshakeResolved_ = true;

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
                    debug('Handshake resolving response is sent, emitting Handshake OK...');
                    _this3.server.rooms.root.add(_this3);
                    _this3.emit(ServerConnection.Events.HANDSHAKE_OK);
                }).catch(function (err) {
                    debug('Handshake resolving response could not sent, manually calling "onClose_"...');
                    console.log('Handshake resolve response failed to send for ' + _this3.id + '.');
                    _this3.onClose_(500, err);
                }).then(function () {
                    message.dispose();
                });
            });

            message.once('rejected', function (err) {
                debug('Handshake is rejected, sending response...');
                if (isObject(err) && err instanceof Error) err = assign({ message: err.message, name: 'Error' }, err);

                _this3.send_(message.createResponse(err)).catch(function (err_) {
                    debug('Handshake rejecting response could not sent, manually calling "onClose_"...');
                    console.log('Handshake reject response failed to send for ' + _this3.id + '.');
                }).then(function () {
                    _this3.onClose_(500, err);
                    message.dispose();
                });
            });

            // Sorry for party rocking
            debug('Emitting server\'s "handshake" event...');
            var handshakeResponse = this.server.emit('handshake', this, message);

            if (!handshakeResponse) {
                debug('There is no handshake listener, resolving the handshake by default...');
                message.resolve();
            }
        }
    }, {
        key: 'onResponse_',
        value: function onResponse_(message) {
            var deferred = this.deferreds_[message.id];

            if (message.err) {
                debug('Response (rejecting) recieved: ' + message);
                var err = assign(new Error(), message.err);
                deferred.reject(err);
            } else {
                debug('Response (resolving) recieved: ' + message);
                deferred.resolve(message.payload);
            }

            delete this.deferreds_[message.id];
        }
    }, {
        key: 'onPing_',
        value: function onPing_(message) {
            debug('Ping request recieved, responding with "pong"...');
            this.send_(message.createResponse(null, 'pong')).catch(function (err) {
                debug('Could not send ping response: ' + err);
                console.log('Ping responce failed to send', err);
            });
        }
    }, {
        key: 'onError_',
        value: function onError_(err) {
            debug('Native "error" event recieved, emitting line\'s "error" event: ' + err);
            this.emit(ServerConnection.Events.ERROR, err);
            debug('And manually calling "onClose_"...');
            this.onClose_(500, err);
        }
    }, {
        key: 'onClose_',
        value: function onClose_(code, message) {
            debug('Native "close" event recieved with code ' + code + ': ' + message);

            if (this.state == ServerConnection.States.CLOSE) {
                debug('Connection\'s state is already closed, ignoring...');
                return;
            }

            debug('Removing connection from all rooms, rejecting all waiting messages...');
            this.server.rooms.removeFromAll(this);
            this.server.rooms.root.remove(this);

            forEach(this.deferreds_, function (deferred) {
                deferred.reject(new Error('Socket connection closed!'));
            });
            this.deferreds_ = {};

            debug('Emitting line\'s "close" event...');
            this.state = ServerConnection.States.CLOSE;
            this.emit(ServerConnection.Events.CLOSE, code, message);
        }

        /**
         * Change connection's id, it's random by default. This method is helpful if you already have
         * custom identification for your clients. You must do this before handshake resolved. If
         * handshake is already resolved or there is conflict, this method will throw error.
         *
         * @param {string} newId New connection id
         * @memberOf ServerConnection
         */

    }, {
        key: 'setId',
        value: function setId(newId) {
            if (this.handshakeResolved_) throw new Error('Handshake already resolved, you cannot change connection id anymore');

            if (this.server.getConnectionById(newId)) throw new Error('Conflict! There is already connection with id newId');

            this.id = newId;
        }

        /**
         * Joins the connection into provided room. If there is no room, it will be created automatically.
         *
         * @param {string} roomName
         * @memberOf ServerConnection
         */

    }, {
        key: 'joinRoom',
        value: function joinRoom(roomName) {
            this.server.rooms.add(roomName, this);
        }

        /**
         * Leaves the connection from provided room.
         *
         * @param {string} roomName
         * @memberOf ServerConnection
         */

    }, {
        key: 'leaveRoom',
        value: function leaveRoom(roomName) {
            this.server.rooms.remove(roomName, this);
        }

        /**
         * Gets the joined room names.
         *
         * @returns {Array<string>}
         * @memberOf ServerConnection
         */

    }, {
        key: 'getRooms',
        value: function getRooms() {
            return this.server.rooms.getRoomsOf(this);
        }

        /**
         * Sends a message to client and waits for its response.
         *
         * @param {string} eventName
         * @param {any=} payload
         * @returns {Promise<any>}
         * @memberOf ServerConnection
         * @example
         * connection
         *   .send('hello', {optional: 'payload'})
         *   .then(responsePayload => {
         *     // Message is resolved by client
         *   })
         *   .catch(err => {
         *     // Could not send message
         *     // or
         *     // Client rejected the message!
         *   });
         */

    }, {
        key: 'send',
        value: function send(eventName, payload) {
            var _this4 = this;

            var message = new Message({ name: eventName, payload: payload });
            message.setId();

            return this.send_(message).then(function (_) {
                var deferred = _this4.deferreds_[message.id] = new Deferred({
                    onExpire: function onExpire() {
                        debug('Message #' + message.id + ' timeout!');
                        delete _this4.deferreds_[message.id];
                    },
                    timeout: _this4.server.options.timeout
                });

                return deferred;
            });
        }

        /**
         * Sends a message to client without waiting response.
         *
         * @param {string} eventName
         * @param {any=} payload
         * @returns {Promise}
         * @memberOf ServerConnection
         * @example
         * connection
         *   .sendWithoutResponse('hello', {optional: 'payload'})
         *   .then(() => {
         *     // Message sent successfully
         *   })
         *   .catch(err => {
         *     // Message could not be sent to client
         *   })
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
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                debug('Sending message: ' + message);
                _this5.socket.send(message.toString(), function (err) {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        /**
         * Pings the client. If there is no respose, closes the connection.
         *
         * @returns {Promise}
         * @memberOf ServerConnection
         */

    }, {
        key: 'ping',
        value: function ping() {
            var _this6 = this;

            debug('Pinging...');
            return this.send(Message.Names.PING).catch(function (err) {
                debug('Ping failed: ' + err.toString());
                _this6.close(410, new Error('Ping failed, dead connection'));
                throw err;
            });
        }

        /**
         * Gracefully closes the client connection.
         *
         * @param {number} code
         * @param {any} data
         * @returns {Promise}
         */

    }, {
        key: 'close',
        value: function close(code, data) {
            var _this7 = this;

            debug('Closing the connection...');
            return new Promise(function (resolve) {
                _this7.socket.close(code, data);
                resolve();
            });
        }
    }]);

    return ServerConnection;
}(EventEmitterExtra);

/**
 * @static
 * @readonly
 * @enum {string}
 */


ServerConnection.States = {
    /**
     * `open` Connection is alive and open.
     */
    OPEN: 'open',
    /**
     * `close` There is no alive connection.
     */
    CLOSE: 'close'
};

/**
 * @static
 * @readonly
 * @enum {string}
 */
ServerConnection.Events = {
    /**
     * `_message`
     */
    MESSAGE: '_message',
    /**
     * @ignore
     */
    HANDSHAKE_OK: '_handshakeOk', // Private
    /**
     * `_error`
     */
    ERROR: '_error',
    /**
     * `_close`
     */
    CLOSE: '_close'
};

module.exports = ServerConnection;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var filter = __webpack_require__(14);
var forEach = __webpack_require__(1);
var map = __webpack_require__(17);
var Room = __webpack_require__(11);

var Rooms = function () {
    function Rooms() {
        _classCallCheck(this, Rooms);

        this.rooms = {};
        this.root = new Room();
    }

    _createClass(Rooms, [{
        key: 'add',
        value: function add(roomName, connection) {
            if (!this.rooms[roomName]) this.rooms[roomName] = new Room(roomName);

            this.rooms[roomName].add(connection);
        }
    }, {
        key: 'remove',
        value: function remove(roomName, connection) {
            if (!this.rooms[roomName]) return;

            this.rooms[roomName].remove(connection);

            if (!this.rooms[roomName].getConnectionsCount()) delete this.rooms[roomName];
        }
    }, {
        key: 'getRoomsOf',
        value: function getRoomsOf(connection) {
            return map(filter(this.rooms, function (room) {
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
            forEach(rooms, function (roomName) {
                return _this.rooms[roomName].remove(connection);
            });
        }
    }]);

    return Rooms;
}();

module.exports = Rooms;

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("uws");

/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var forEach = __webpack_require__(1);
var clone = __webpack_require__(12);
var Message = __webpack_require__(3);

/**
 * Line room class.
 *
 * @private
 * @class ServerRoom
 * @param {string} name Room name
 * @property {string} name
 */

var ServerRoom = function () {
    function ServerRoom(name) {
        var connections = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, ServerRoom);

        this.name = name;
        this.connections = connections;
    }

    /**
     * Adds a connection into room.
     * @param {ServerConnection} connection
     */


    _createClass(ServerRoom, [{
        key: 'add',
        value: function add(connection) {
            this.connections[connection.id] = connection;
        }

        /**
         * Removes a connection from room.
         * @param {ServerConnection} connection
         */

    }, {
        key: 'remove',
        value: function remove(connection) {
            delete this.connections[connection.id];
        }

        /**
         * Gets a connection by id.
         * @param {string} connectionId
         * @returns {?ServerConnection}
         */

    }, {
        key: 'getConnectionById',
        value: function getConnectionById(connectionId) {
            return this.connections[connectionId];
        }

        /**
         * Gets all connections in the room. Returns a object where keys are
         * connection id and values are ServerConnection.
         * @returns {{string: ServerConnection}}
         */

    }, {
        key: 'getConnections',
        value: function getConnections() {
            return clone(this.connections);
        }

        /**
         * Returns the total connection count in room.
         * @returns {number}
         */

    }, {
        key: 'getConnectionsCount',
        value: function getConnectionsCount() {
            return Object.keys(this.connections).length;
        }
    }, {
        key: 'broadcast_',
        value: function broadcast_(message) {
            forEach(this.connections, function (connection) {
                connection.send_(message);
            });
        }

        /**
         * Broadcast a message to all connections in the room.
         * @param {string} eventName
         * @param {any=} payload
         */

    }, {
        key: 'broadcast',
        value: function broadcast(eventName, payload) {
            var message = new Message({ name: eventName, payload: payload });
            forEach(this.connections, function (connection, index) {
                connection.send_(message);
            });
        }
    }]);

    return ServerRoom;
}();

module.exports = ServerRoom;

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = require("lodash/clone");

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("lodash/debounce");

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = require("lodash/filter");

/***/ },
/* 15 */
/***/ function(module, exports) {

module.exports = require("lodash/isFunction");

/***/ },
/* 16 */
/***/ function(module, exports) {

module.exports = require("lodash/isUndefined");

/***/ },
/* 17 */
/***/ function(module, exports) {

module.exports = require("lodash/map");

/***/ },
/* 18 */
/***/ function(module, exports) {

module.exports = require("lodash/values");

/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = require("node-uuid");

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebSocketServer = __webpack_require__(9).Server;
var Connection = __webpack_require__(7);
var Rooms = __webpack_require__(8);
var EventEmitterExtra = __webpack_require__(0);
var debug = __webpack_require__(2)('line:server');

/**
 * Line Server Class
 * Documentation is here deneme
 *
 * @class Server
 * @extends {EventEmitterExtra}
 * @param {Object=} options Options object.
 * @param {string=} options.host Server host name. Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {number=} options.port Server port. Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {http.Server=} options.server Server object to be attached. If provided, `host` and `port` will ignored. Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {Function=} options.handleProtocols Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#optionshandleprotocols).
 * @param {string=} options.path Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {boolean=} options.noServer Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {boolean=} options.clientTracking Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
 * @param {Object=} options.perMessageDeflate Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#optionspermessagedeflate).
 * @param {number=} options.timeout Timeout duration (in ms) for message responses. Default: 30 seconds
 * @param {number=} options.maxReconnectDelay Maximum reconnection delay (in seconds) for clients. Default: 60 seconds
 * @param {number=} options.initialReconnectDelay Intial reconnection delay (in seconds) for clients. Defualt: 1 seconds
 * @param {number=} options.reconnectIncrementFactor Reconnection incremental factor for clients. Default: 2
 * @param {number=} options.pingInterval Ping interval (in ms) for both server and client. Default: 60 seconds.
 * @example
 * const Server = require('line-socket/server');
 * const server = new Server({
 *   port: 8080
 * });
 */

var Server = function (_EventEmitterExtra) {
    _inherits(Server, _EventEmitterExtra);

    function Server() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Server);

        var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));

        _this.rooms = new Rooms();

        _this.options = Object.assign({
            timeout: 30000,
            maxReconnectDelay: 60,
            initialReconnectDelay: 1,
            reconnectIncrementFactor: 2,
            pingInterval: 60000
        }, options);

        debug('Initalizing with options: ' + JSON.stringify(_this.options));
        return _this;
    }

    /**
     * Starts the server.
     *
     * @returns {Promise}
     * @memberOf Server
     * @example
     * server
     *   .start()
     *   .then(() => {
     *     console.log('Server started');
     *   })
     *   .catch((err) => {
     *     console.log('Server could not started', err);
     *   });
     */


    _createClass(Server, [{
        key: 'start',
        value: function start() {
            var _this2 = this;

            if (!this.options.port) {
                debug('Starting without port...');
                this.server = new WebSocketServer(this.options);
                this.bindEvents();
                return Promise.resolve();
            }

            return new Promise(function (resolve, reject) {
                debug('Starting with port "' + _this2.options.port + '" ...');

                _this2.server = new WebSocketServer(_this2.options, function (err) {
                    if (err) {
                        debug('Could not start: ' + err);
                        return reject(err);
                    }

                    _this2.bindEvents();
                    resolve();
                });
            });
        }

        /**
         * Stops the server.
         *
         * @returns {Promise}
         * @memberOf Server
         * @example
         * server
         *   .stop()
         *   .then(() => {
         *     console.log('Server stopped');
         *   })
         *   .catch((err) => {
         *     console.log('Server could not stopped', err);
         *   });
         */

    }, {
        key: 'stop',
        value: function stop() {
            var _this3 = this;

            if (!this.server) {
                debug('Could not stop server. Server is probably not started, or already stopped.');
                var err = new Error('Could not stop server. Server is probably not started, or already stopped.');
                return Promise.reject(err);
            }

            return new Promise(function (resolve) {
                debug('Closing and disposing the server...');
                _this3.server.close();
                _this3.server = null;
                resolve();
            });
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            debug('Binding server events...');

            this.server.on('connection', this.onConnection.bind(this));
            this.server.on('headers', this.onHeaders.bind(this));
            this.server.on('error', this.onError.bind(this));
        }
    }, {
        key: 'onConnection',
        value: function onConnection(socket) {
            var _this4 = this;

            debug('Native "connection" event recieved, creating line connection...');
            var connection = new Connection(socket, this);

            connection.on(Connection.Events.HANDSHAKE_OK, function () {
                debug('Handshake OK, emitting line\'s "connection" event...');
                _this4.emit(Server.Events.CONNECTION, connection);
            });
        }
    }, {
        key: 'onHeaders',
        value: function onHeaders(headers) {
            debug('Native "headers" event recieved, emitting line\'s "headers" event... (' + headers + ')');
            this.emit(Server.Events.HEADERS, headers);
        }
    }, {
        key: 'onError',
        value: function onError(err) {
            debug('Native "error" event recieved, emitting line\'s "error" event... (' + err + ')');
            this.emit(Server.Events.ERROR, err);
        }

        /**
         * Returns a object where keys are connection id and values are ServerConnection.
         *
         * @returns {{string: ServerConnection}}
         * @memberOf Server
         */

    }, {
        key: 'getConnections',
        value: function getConnections() {
            return this.rooms.root.getConnections();
        }

        /**
         * Gets a connection by id
         *
         * @param {string} id Unique connection id, which can be accessed at `connection.id`
         * @returns {?ServerConnection}
         * @memberOf Server
         * @example
         * const connection = server.getConnectionById('someId');
         *
         * if (connection)
         *   connection.send('hello', {world: ''});
         */

    }, {
        key: 'getConnectionById',
        value: function getConnectionById(id) {
            return this.rooms.root.getConnectionById(id);
        }

        /**
         * Broadcasts a message to all the connected clients.
         *
         * @param {string} eventName Event name
         * @param {any=} payload Optional message payload.
         * @memberOf Server
         * @example
         * server.broadcast('hello', {world: ''});
         */

    }, {
        key: 'broadcast',
        value: function broadcast(eventName, payload) {
            debug('Broadcasting "' + eventName + '" event...');
            this.rooms.root.broadcast(eventName, payload);
        }

        /**
         * Gets a room by name.
         * @param {string} room Room name
         * @returns {?ServerRoom}
         */

    }, {
        key: 'getRoom',
        value: function getRoom(room) {
            return this.rooms.getRoom(room);
        }

        /**
         * Gets all the rooms of a connection.
         * @param {ServerConnection} connection
         * @returns {Array.<string>} Array of room names.
         */

    }, {
        key: 'getRoomsOf',
        value: function getRoomsOf(connection) {
            return this.rooms.getRoomsOf(connection);
        }

        /**
         * Remove a connection from all the rooms.
         * @param {ServerConnection} connection
         */

    }, {
        key: 'removeFromAllRooms',
        value: function removeFromAllRooms(connection) {
            this.rooms.removeFromAll(connection);
        }
    }]);

    return Server;
}(EventEmitterExtra);

/**
 * @static
 * @readonly
 * @enum {string}
 * @example
 * server.on('connection', (connection) => {
 *   connection.send('hello');
 *   ...
 * });
 *
 * // or
 *
 * server.on(Server.Events.CONNECTION, (connection) => {
 *   connection.send('hello');
 *   ...
 * });
 *
 * // If you want to authorize your client
 * server.on('handshake', (connection, handshake) => {
 *   if (handshake.payload.token == 'test')
 *     handshake.resolve();
 *   else
 *     handshake.reject(new Error('Invalid token'));
 * });
 */


Server.Events = {
    /**
     * `'connection'` This event will fire on a client connects **after successful handshake**.
     *
     * ```
     * function (connection) {}
     * ```
     *
     * where `connection` is a `ServerConnection` instance.
     */
    CONNECTION: 'connection',
    /**
     * `'handshake'` When a client connection is established, this event will be fired before
     * `connection` event. If you want to authorize your clients, you must listen this event and
     * call `handshake.resolve(payload)` or `handshake.reject(err)` accordingly. If you do not consume
     * this events, all the client connections will be accepted.
     *
     * ```
     * function (connection, handshake) {}
     * ```
     *
     * where `connection` is `ServerConnection` and `handshake` is a `Message` instance.
     */
    HANDSHAKE: 'handshake',
    /**
     * `'headers'` Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#event-headers)
     */
    HEADERS: 'headers',
    /**
     * `'error'` Inherited from uws, [see docs](https://github.com/websockets/ws/blob/master/doc/ws.md#event-error)
     */
    ERROR: 'error'
};

module.exports = Server;

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map
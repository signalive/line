module.exports=function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};return n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,n,t){Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=19)}([function(e,n){e.exports=require("event-emitter-extra/dist/commonjs.modern")},function(e,n){e.exports=require("lodash/forEach")},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(15),u=t(5),c=t(14),l=t(17),f=t(3),h=f.generateDummyId,d=t(0),v=function(e){function n(e){var t=e.name,i=e.payload,s=e.id,a=e.err;o(this,n);var u=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return u.name=t,u.payload=i,u.id=s,u.err=a,u.isResponded_=!1,u}return i(n,e),s(n,null,[{key:"parse",value:function(e){try{var t=JSON.parse(e);return new n({name:t.n,payload:t.p,err:t.e,id:t.i})}catch(e){throw new Error("Could not parse message.")}}}]),s(n,[{key:"setId",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h();return this.id=e,e}},{key:"createResponse",value:function(e,t){return new n({name:"_r",payload:t,err:e,id:this.id})}},{key:"resolve",value:function(e){var n=this;return a(this.id)?console.warn("[line] A message without an id cannot be resolved."):this.isResponded_?console.warn("[line] This message has already been ended."):u(e)&&c(e.then)?void e.then(function(t){n.isResponded_=!0,n.emit("resolved",e)}).catch(function(e){n.isResponded_=!0,n.emit("rejected",e)}):(this.isResponded_=!0,void this.emit("resolved",e))}},{key:"reject",value:function(e){return a(this.id)?console.warn("[line] A message without an id cannot be rejected."):this.isResponded_?console.warn("[line] This message has already been ended."):(this.isResponded_=!0,void this.emit("rejected",e))}},{key:"toString",value:function(){try{var e={n:this.name};return a(this.payload)||(e.p=this.payload),a(this.id)||(e.i=this.id),a(this.err)||(e.e=this.err),JSON.stringify(e)}catch(e){throw new Error("Could not stringify message.")}}},{key:"dispose",value:function(){var e=this,n=this.eventNames();n.forEach(function(n){return e.removeAllListeners(n)})}}]),n}(d);v.Names={RESPONSE:"_r",HANDSHAKE:"_h",PING:"_p"},v.ReservedNames=l(v.Names),e.exports=v},function(e,n,t){"use strict";function o(e){return new Promise(function(n){return setTimeout(function(e){return n()},e)})}function r(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t={maxDelay:160,maxCount:0,initialDelay:3,increaseFactor:2};n=s(t,n);var r=void 0,i=1,a=n.initialDelay,u=function t(){return e().catch(function(e){if(i++,a*=n.increaseFactor,0!=n.maxCount&&i>n.maxCount)throw r&&clearTimeout(r),e;return o(1e3*a/2).then(function(e){return t()})})};return u()}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:4;return("0000"+(Math.random()*Math.pow(36,e)<<0).toString(36)).slice(-e)}var s=t(4);e.exports={promiseDelay:o,retry:r,generateDummyId:i}},function(e,n){e.exports=require("lodash/assign")},function(e,n){e.exports=require("lodash/isObject")},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(3),u=t(2),c=t(0),l=t(4),f=t(1),h=t(5),d=t(12),v=t(9),p=t(18),m=function(e){function n(e,t){o(this,n);var i=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return i.id=p.v4(),i.socket=e,i.server=t,i.deferreds_={},i.state=n.States.OPEN,i.handshakeResolved_=!1,i.socket.on("message",i.onMessage_.bind(i)),i.socket.on("error",i.onError_.bind(i)),i.socket.on("close",i.onClose_.bind(i)),i.autoPing_=t.options.pingInterval>0?d(function(){i.state==n.States.OPEN&&i.ping().then(function(){t.options.pingInterval>0&&i.state==n.States.OPEN&&i.autoPing_()}).catch(function(){})},t.options.pingInterval):function(){},i}return i(n,e),s(n,[{key:"onMessage_",value:function(e,t){var o=this,r=u.parse(e);return this.autoPing_(),this.emit(n.Events.MESSAGE,e),r.id||u.ReservedNames.indexOf(r.name)!=-1?r.name==u.Names.HANDSHAKE?this.onHandshake_(r):r.name==u.Names.PING?this.onPing_(r):r.name==u.Names.RESPONSE&&this.deferreds_[r.id]?this.onResponse_(r):(r.once("resolved",function(e){o.send_(r.createResponse(null,e)),r.dispose()}),r.once("rejected",function(e){h(e)&&e instanceof Error&&"Error"==e.name&&(e={message:e.message,name:"Error"}),o.send_(r.createResponse(e)),r.dispose()}),void this.emit(r.name,r)):this.emit(r.name,r)}},{key:"onHandshake_",value:function(e){var t=this;e.once("resolved",function(o){t.handshakeResolved_=!0;var r={handshakePayload:o,id:t.id,timeout:t.server.options.timeout,maxReconnectDelay:t.server.options.maxReconnectDelay,initialReconnectDelay:t.server.options.initialReconnectDelay,reconnectIncrementFactor:t.server.options.reconnectIncrementFactor,pingInterval:t.server.options.pingInterval};t.send_(e.createResponse(null,r)).then(function(){t.server.rooms.root.add(t),t.emit(n.Events.HANDSHAKE_OK)}).catch(function(){console.log("Handshake resolve response failed to send for "+t.id+"."),t.onClose_(500,err)}).then(function(){e.dispose()})}),e.once("rejected",function(n){h(n)&&n instanceof Error&&"Error"==n.name&&(n={message:n.message,name:"Error"}),t.send_(e.createResponse(n)).catch(function(e){console.log("Handshake reject response failed to send for "+t.id+".")}).then(function(){t.onClose_(500,n),e.dispose()})});var o=this.server.emit("handshake",this,e);o||e.resolve()}},{key:"onResponse_",value:function(e){var n=this.deferreds_[e.id];if(e.err){var t=l(new Error,e.err);n.reject(t)}else n.resolve(e.payload);delete this.deferreds_[e.id]}},{key:"onPing_",value:function(e){this.send_(e.createResponse(null,"pong")).catch(function(e){console.log("Ping responce failed to send",e)})}},{key:"onError_",value:function(e){this.emit(n.Events.ERROR,e),this.onClose_(500,e)}},{key:"onClose_",value:function(e,t){this.state!=n.States.CLOSE&&(this.server.rooms.removeFromAll(this),this.server.rooms.root.remove(this),f(this.deferreds_,function(e){e.reject(new Error("Socket connection closed!"))}),this.deferreds_={},this.state=n.States.CLOSE,this.emit(n.Events.CLOSE,e,t))}},{key:"setId",value:function(e){if(this.handshakeResolved_)throw new Error("Handshake already resolved, you cannot change connection id anymore");if(this.server.getConnectionById(e))throw new Error("Conflict! There is already connection with id newId");this.id=e}},{key:"joinRoom",value:function(e){this.server.rooms.add(e,this)}},{key:"leaveRoom",value:function(e){this.server.rooms.remove(e,this)}},{key:"getRooms",value:function(){return this.server.rooms.getRoomsOf(this)}},{key:"send",value:function(e,n){var t=this,o=new u({name:e,payload:n});return o.setId(),this.send_(o).then(function(e){var n=t.deferreds_[o.id]=new v({onExpire:function(){delete t.deferreds_[o.id]},timeout:t.server.options.timeout});return n})}},{key:"sendWithoutResponse",value:function(e,n){var t=new u({name:e,payload:n});return this.send_(t)}},{key:"send_",value:function(e){var n=this;return new Promise(function(t,o){n.socket.send(e.toString(),function(e){return e?o(e):void t()})})}},{key:"ping",value:function(){var e=this;return a.retry(function(n){return e.send(u.Names.PING)},{maxCount:3,initialDelay:1,increaseFactor:1}).catch(function(n){throw e.close(410,new Error("Ping failed, dead connection")),n})}},{key:"close",value:function(e,n){var t=this;return new Promise(function(o){t.socket.close(e,n),o()})}}]),n}(c);m.States={OPEN:"open",CLOSE:"close"},m.Events={MESSAGE:"_message",HANDSHAKE_OK:"_handshakeOk",ERROR:"_error",CLOSE:"_close"},e.exports=m},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(13),s=t(1),a=t(16),u=t(10),c=function(){function e(){o(this,e),this.rooms={},this.root=new u}return r(e,[{key:"add",value:function(e,n){this.rooms[e]||(this.rooms[e]=new u(e)),this.rooms[e].add(n)}},{key:"remove",value:function(e,n){this.rooms[e]&&(this.rooms[e].remove(n),this.rooms[e].getConnectionsCount()||delete this.rooms[e])}},{key:"getRoomsOf",value:function(e){return a(i(this.rooms,function(n){return n.getConnectionById(e.id)}),"name")}},{key:"getRoom",value:function(e){return this.rooms[e]}},{key:"removeFromAll",value:function(e){var n=this,t=this.getRoomsOf(e);s(t,function(t){return n.rooms[t].remove(e)})}}]),e}();e.exports=c},function(e,n){e.exports=require("uws")},function(e,n){"use strict";function t(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),r=function(){function e(){var n=this,o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=o.handler,i=void 0===r?function(){}:r,s=o.onExpire,a=void 0===s?function(){}:s,u=o.timeout,c=void 0===u?0:u;t(this,e),this.resolve_=null,this.reject_=null,this.timeout_=null,this.onExpire_=a,this.isFinished_=!1,this.promise=new Promise(function(e,t){n.resolve_=e,n.reject_=t;try{i(n)}catch(e){n.reject(e)}}),c>0&&(this.timeout_=setTimeout(this.expire.bind(this),c))}return o(e,[{key:"resolve",value:function(e){this.isFinished_||(this.isFinished_=!0,this.clearTimeout_(),this.resolve_(e))}},{key:"reject",value:function(e){this.isFinished_||(this.isFinished_=!0,this.clearTimeout_(),this.reject_(e))}},{key:"expire",value:function(){this.isFinished_=!0,this.clearTimeout_(),this.onExpire_(),this.reject_(new Error("Timeout exceed"))}},{key:"then",value:function(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.promise.then.apply(this.promise,n)}},{key:"catch",value:function(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.promise.catch.apply(this.promise,n)}},{key:"clearTimeout_",value:function(){this.timeout_&&(clearTimeout(this.timeout_),this.timeout_=null)}}]),e}();e.exports=r},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(1),s=t(11),a=t(2),u=function(){function e(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,e),this.name=n,this.connections=t}return r(e,[{key:"add",value:function(e){this.connections[e.id]=e}},{key:"remove",value:function(e){delete this.connections[e.id]}},{key:"getConnectionById",value:function(e){return this.connections[e]}},{key:"getConnections",value:function(){return s(this.connections)}},{key:"getConnectionsCount",value:function(){return Object.keys(this.connections).length}},{key:"broadcast_",value:function(e){i(this.connections,function(n){n.send_(e)})}},{key:"broadcast",value:function(e,n){var t=new a({name:e,payload:n});i(this.connections,function(e,n){e.send_(t)})}}]),e}();e.exports=u},function(e,n){e.exports=require("lodash/clone")},function(e,n){e.exports=require("lodash/debounce")},function(e,n){e.exports=require("lodash/filter")},function(e,n){e.exports=require("lodash/isFunction")},function(e,n){e.exports=require("lodash/isUndefined")},function(e,n){e.exports=require("lodash/map")},function(e,n){e.exports=require("lodash/values")},function(e,n){e.exports=require("node-uuid")},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(8).Server,u=t(6),c=t(7),l=t(0),f=function(e){function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o(this,n);var t=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return t.rooms=new c,t.options=Object.assign({timeout:3e4,maxReconnectDelay:60,initialReconnectDelay:1,reconnectIncrementFactor:2,pingInterval:6e4},e),t}return i(n,e),s(n,[{key:"start",value:function(){var e=this;return this.options.port?new Promise(function(n,t){e.server=new a(e.options,function(o){return o?t(o):(e.bindEvents(),void n())})}):(this.server=new a(this.options),this.bindEvents(),Promise.resolve())}},{key:"stop",value:function(){var e=this;if(!this.server){var n=new Error("Could not stop server. Server is probably not started, or already stopped.");return Promise.reject(n)}return new Promise(function(n){e.server.close(),e.server=null,n()})}},{key:"bindEvents",value:function(){this.server.on("connection",this.onConnection.bind(this)),this.server.on("headers",this.onHeaders.bind(this)),this.server.on("error",this.onError.bind(this))}},{key:"onConnection",value:function(e){var t=this,o=new u(e,this);o.on(u.Events.HANDSHAKE_OK,function(){return t.emit(n.Events.CONNECTION,o)})}},{key:"onHeaders",value:function(e){this.emit(n.Events.HEADERS,e)}},{key:"onError",value:function(e){this.emit(n.Events.ERROR,e)}},{key:"getConnections",value:function(){return this.rooms.root.getConnections()}},{key:"getConnectionById",value:function(e){return this.rooms.root.getConnectionById(e)}},{key:"broadcast",value:function(e,n){this.rooms.root.broadcast(e,n)}},{key:"getRoom",value:function(e){return this.rooms.getRoom(e)}},{key:"getRoomsOf",value:function(e){return this.rooms.getRoomsOf(e)}},{key:"removeFromAllRooms",value:function(e){this.rooms.removeFromAll(e)}}]),n}(l);f.Events={CONNECTION:"connection",HANDSHAKE:"handshake",HEADERS:"headers",ERROR:"error"},e.exports=f}]);
//# sourceMappingURL=server.js.map
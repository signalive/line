module.exports=function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(13),c=n(5),l=r(c),f=n(7),d=r(f),p=n(1),h=r(p),v=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return n.rooms=new d.default,n.options=e,n}return s(t,e),u(t,[{key:"start",value:function(){var e=this;return this.options.port?new Promise(function(t,n){e.server=new a.Server(e.options,function(r){return r?n(r):(e.bindEvents(),void t())})}):(this.server=new a.Server(this.options),this.bindEvents(),Promise.resolve())}},{key:"stop",value:function(){var e=this;if(!this.server){var t=new Error("Could not stop server. Server is probably not started, or already stopped.");return Promise.reject(t)}return new Promise(function(t){e.server.close(),e.server=null,t()})}},{key:"bindEvents",value:function(){this.server.on("connection",this.onConnection.bind(this))}},{key:"onConnection",value:function(e){var t=new l.default(e,this);this.emit("connection",t)}}]),t}(h.default);e.exports=v},function(e,t){e.exports=require("event-emitter-extra")},function(e,t){e.exports=require("lodash/forEach")},function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(11),l=o(c),f=n(4),d=r(f),p=n(1),h=o(p),v=function(e){function t(e){var n=e.name,r=e.payload,o=e.id,u=e.err;i(this,t);var a=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return a.name=n,a.payload=r,a.id=o,a.err=u,a.isResponded_=!1,a}return u(t,e),a(t,null,[{key:"parse",value:function(e){try{var n=JSON.parse(e);return new t({name:n.n,payload:n.p,err:n.e,id:n.i})}catch(e){throw new Error("Could not parse message.")}}}]),a(t,[{key:"setId",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d.v4();return this.id=e,e}},{key:"createResponse",value:function(e,n){return new t({name:"_r",payload:n,err:e,id:this.id})}},{key:"resolve",value:function(e){return(0,l.default)(this.id)?console.warn("[line] A message without an id cannot be resolved."):this.isResponded_?console.warn("[line] This message has already been ended."):(this.isResponded_=!0,void this.emit("resolved",e))}},{key:"reject",value:function(e){return(0,l.default)(this.id)?console.warn("[line] A message without an id cannot be rejected."):this.isResponded_?console.warn("[line] This message has already been ended."):(this.isResponded_=!0,void this.emit("rejected",e))}},{key:"toString",value:function(){try{var e={n:this.name};return(0,l.default)(this.payload)||(e.p=this.payload),(0,l.default)(this.id)||(e.i=this.id),(0,l.default)(this.err)||(e.e=this.err),JSON.stringify(e)}catch(e){throw new Error("Could not stringify message.")}}},{key:"dispose",value:function(){var e=this,t=this.eventNames();t.forEach(function(t){return e.removeAllListeners(t)})}}]),t}(h.default);t.default=v,v.reservedNames=["_r"]},function(e,t){e.exports=require("node-uuid")},function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(3),l=o(c),f=n(1),d=o(f),p=n(8),h=o(p),v=n(2),y=o(v),m=n(10),b=o(m),_=n(4),w=r(_),k=function(e){function t(e,n){i(this,t);var r=s(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.id=w.v4(),r.socket=e,r.server=n,r.promiseCallbacks={},r.socket.on("message",r.onMessage.bind(r)),r.socket.on("error",r.onError.bind(r)),r.socket.on("close",r.onClose.bind(r)),r.joinRoom("/"),r}return u(t,e),a(t,[{key:"onMessage",value:function(e,t){var n=this,r=l.default.parse(e);if(!r.id&&l.default.reservedNames.indexOf(r.name)==-1)return this.emit(r.name,r);if("_r"==r.name){var o=this.promiseCallbacks[r.id],i=o.resolve,s=o.reject;if(r.err){var u=(0,h.default)(new Error,r.err);s(u)}else i(r.payload);return void delete this.promiseCallbacks[r.options.id]}r.once("resolved",function(e){n.send_(r.createResponse(null,e)),r.dispose()}),r.once("rejected",function(e){(0,b.default)(e)&&e instanceof Error&&"Error"==e.name&&(e={message:e.message,name:"Error"}),n.send_(r.createResponse(e)),r.dispose()}),this.emit(r.name,r)}},{key:"onError",value:function(e){this.emit("_error",e)}},{key:"onClose",value:function(e,t){this.server.rooms.removeFromAll(this),(0,y.default)(this.promiseCallbacks,function(e){e.reject(new Error("Socket connection closed!"))}),this.promiseCallbacks={},this.emit("_close",e,t)}},{key:"joinRoom",value:function(e){this.server.rooms.add(e,this)}},{key:"leaveRoom",value:function(e){this.server.rooms.remove(e,this)}},{key:"getRooms",value:function(){this.server.rooms.getRoomsOf(this)}},{key:"send",value:function(e,t){var n=this,r=new l.default({name:e,payload:t}),o=r.setId();return this.send_(r).then(function(e){return new Promise(function(e,t){n.promiseCallbacks[o]={resolve:e,reject:t}})})}},{key:"send_",value:function(e){var t=this;return new Promise(function(n,r){t.socket.send(e.toString(),function(e){return e?r(e):void n()})})}}]),t}(d.default);e.exports=k},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(2),u=r(s),a=n(3),c=r(a),l=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,e),this.name=t,this.connections=n}return i(e,[{key:"add",value:function(e){this.connections[e.id]=e}},{key:"remove",value:function(e){delete this.connections[e.id]}},{key:"getConnectionById",value:function(e){return this.connections[e]}},{key:"getConnectionsCount",value:function(){return Object.keys(this.connections).length}},{key:"broadcast_",value:function(e){(0,u.default)(this.connections,function(t){t.send_(e)})}},{key:"broadcast",value:function(e,t){var n=new c.default({name:e,payload:t});(0,u.default)(this.connections,function(e,t){e.send_(n)})}}]),e}();t.default=l},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(9),u=r(s),a=n(2),c=r(a),l=n(12),f=r(l),d=n(6),p=r(d),h=function(){function e(){o(this,e),this.rooms={"/":new p.default("/")}}return i(e,[{key:"add",value:function(e,t){this.rooms[e]||(this.rooms[e]=new p.default(e)),this.rooms[e].add(t)}},{key:"remove",value:function(e,t){this.rooms[e]&&(this.rooms[e].remove(t.id),"/"==e||this.rooms[e].getConnectionsCount()||delete this.rooms[e])}},{key:"getRoomsOf",value:function(e){return(0,f.default)((0,u.default)(this.rooms,function(t){return t.getConnectionById(e.id)}),"name")}},{key:"getRoom",value:function(e){return this.rooms[e]}},{key:"removeFromAll",value:function(e){var t=this,n=this.getRoomsOf(e);(0,c.default)(n,function(n){return t.rooms[n].remove(e)})}}]),e}();t.default=h},function(e,t){e.exports=require("lodash/assign")},function(e,t){e.exports=require("lodash/filter")},function(e,t){e.exports=require("lodash/isObject")},function(e,t){e.exports=require("lodash/isUndefined")},function(e,t){e.exports=require("lodash/map")},function(e,t){e.exports=require("uws")}]);
//# sourceMappingURL=server.js.map
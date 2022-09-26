module.exports=function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,t,n){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=25)}([function(e,t){"use strict";function n(e,t,n){this.name="LineError",this.message=t,this.code=e,this.payload=n,this.stack=(new Error).stack}n.prototype=new Error,e.exports=n},function(e,t){e.exports=require("lodash/assign")},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(21),c=n(20),u=n(7),d=(n(19),n(23)),l=n(1),h=n(14),f=h.generateDummyId,p=n(4),v=n(0),m=function(e){function t(e){var n=e.name,i=e.payload,s=e.id,a=e.err;o(this,t);var c=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));try{JSON.stringify(i),JSON.stringify(a)}catch(e){throw new v(t.ErrorCode.INVALID_JSON,"Message payload or error must be json-friendly. Maybe circular json?")}return c.name=n,c.payload=i,c.id=s,c.err=a,c.isResponded_=!1,c}return i(t,e),s(t,null,[{key:"parse",value:function(e){try{var n=JSON.parse(e);return u(n.e)&&c(n.e.name)&&c(n.e.message)&&(n.e=l(new Error,n.e)),new t({name:n.n,payload:n.p,err:n.e,id:n.i})}catch(e){throw new v(t.ErrorCode.INVALID_JSON,"Could not parse incoming message.")}}}]),s(t,[{key:"setId",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f();return this.id=e,e}},{key:"createResponse",value:function(e,n){return new t({name:"_r",payload:n,err:e,id:this.id})}},{key:"resolve",value:function(e){if(a(this.id))throw new v(t.ErrorCode.MISSING_ID,"This message could not be resolved (no id)");if(this.isResponded_)throw new v(t.ErrorCode.ALREADY_RESPONDED,"This message has already responded");try{JSON.stringify(e)}catch(e){throw new v(t.ErrorCode.INVALID_JSON,"Message must be resolved with json-friendly payload. Maybe circular json?")}this.isResponded_=!0,this.emit("resolved",e)}},{key:"reject",value:function(e){if(a(this.id))throw new v(t.ErrorCode.MISSING_ID,"This message could not be rejected (no id)");if(this.isResponded_)throw new v(t.ErrorCode.ALREADY_RESPONDED,"This message has already responded");try{JSON.stringify(e)}catch(e){throw new v(t.ErrorCode.INVALID_JSON,"Message must be resolved with json-friendly payload. Maybe circular json?")}this.isResponded_=!0,this.emit("rejected",e)}},{key:"toString",value:function(){var e={n:this.name};return a(this.payload)||(e.p=this.payload),a(this.id)||(e.i=this.id),a(this.err)||(e.e=this.err instanceof Error?l({name:this.err.name,message:this.err.message},this.err):this.err),JSON.stringify(e)}},{key:"dispose",value:function(){var e=this,t=this.eventNames();t.forEach(function(t){return e.removeAllListeners(t)})}}]),t}(p);m.Name={RESPONSE:"_r",HANDSHAKE:"_h",PING:"_p"},m.ReservedNames=d(m.Name),m.ErrorCode={INVALID_JSON:"mInvalidJson",MISSING_ID:"mMissingId",ALREADY_RESPONDED:"mAlreadyResponded"},e.exports=m},function(e,t){e.exports=require("debug")},function(e,t){e.exports=require("event-emitter-extra")},function(e,t){e.exports=require("lodash/forEach")},function(e,t){e.exports=require("lodash/isInteger")},function(e,t){e.exports=require("lodash/isObject")},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(2),c=n(4),u=(n(1),n(5)),d=n(6),l=(n(7),n(17)),h=n(13),f=n(24),p=n(3),v=n(0),m=n(12),E=void 0,g=function(e){function t(e,n){o(this,t);var i=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return i.id=f.v4(),E=p("line:server:connection:"+i.id),E("Creating connection with id "+i.id+" ..."),i.socket=e,i.server=n,i.state=t.State.AWAITING_HANDSHAKE,i.deferreds_={},i.autoPing_=l(function(){}),i.socket.on("message",i.onMessage_.bind(i)),i.socket.on("error",i.onError_.bind(i)),i.socket.on("close",i.onClose_.bind(i)),i.idleTimeout=new h,i.idleTimeoutDuration=100*n.options.pingInterval,n.options.pingInterval>0&&(i.idleTimeout=new h({timeout:i.idleTimeoutDuration,rejectOnExpire:!1,onExpire:function(){var e=!!i.server.rooms.root.getConnectionById(i.id),n=i.getRooms().length;(e||0!==n)&&(E("Could not dispose this connection somehow. "+("ReadyState = "+["CONNECTING","OPEN","CLOSING","CLOSED"][i.socket.readyState]+" | ")+("Persists in root room: "+e+" | ")+("Belongs to this many rooms: "+n)),i.server.rooms.removeFromAll(i),i.server.rooms.root.remove(i),i.state=t.State.DISCONNECTED,i.emit(t.Event.DISCONNECTED,t.ErrorCode.IDLE_TIMEOUT,"Stayed idle for "+i.idleTimeoutDuration))}}),i.autoPing_=l(function(){i.ping().then(function(){E("Auto-ping successful"),i.idleTimeout.delay(),n.options.pingInterval>0&&i.state==t.State.CONNECTED?i.autoPing_():E("Canceling auto-ping, state: "+i.state)}).catch(function(e){E("Auto-ping failed, state: "+i.state,e)})},n.options.pingInterval)),n.options.handshakeTimeout>0&&(i.handshakeTimeout_=setTimeout(function(){return i.state!=t.State.AWAITING_HANDSHAKE?E("Handshake is not awaiting, ignoring handshake timeout..."):(E("Handshake timeout exceed, closing the connection..."),void i.close(m.HANDSHAKE_FAILED.code,"Handshake not completed after "+n.options.handshakeTimeout+" ms"))},n.options.handshakeTimeout)),i}return i(t,e),s(t,[{key:"onMessage_",value:function(e,n){E('Native "message" event recieved: '+e);var o=void 0;this.state==t.State.CONNECTED&&this.autoPing_();try{o=a.parse(e)}catch(n){return void this.emit(t.Event.ERROR,new v(t.ErrorCode.INVALID_JSON,"Could not parse message, invalid json. Check payload for incoming data.",e))}this.idleTimeout.delay(),o.name==a.Name.HANDSHAKE?this.onHandshakeMessage_(o):o.name==a.Name.PING?this.onPingMessage_(o):o.name==a.Name.RESPONSE?this.onResponseMessage_(o):a.ReservedNames.indexOf(o.name)==-1?o.id?this.onMessageWithResponse_(o):this.onMessageWithoutResponse_(o):E("Could not route the message",o)}},{key:"onHandshakeMessage_",value:function(e){var n=this;if(this.state==t.State.CONNECTED)return E("Handshake message recieved but, handshake is already resolved, ignoring..."),this.sendWithoutResponse_(e.createResponse(new Error("Handshake is already resolved"))).catch(function(){});E("Handshake message recieved: "+e),e.once("resolved",function(o){E("Handshake is resolved, sending response..."),n.state=t.State.CONNECTED,n.handshakeTimeout_&&clearTimeout(n.handshakeTimeout_),n.autoPing_();var r={payload:o,id:n.id};n.sendWithoutResponse_(e.createResponse(null,r)).then(function(){E("Handshake resolving response is sent, emitting connection..."),n.server.rooms.root.add(n),n.server.emit("connection",n)}).catch(function(e){if(E("Could not send handshake response",e),e instanceof v)switch(e.code){case t.ErrorCode.DISCONNECTED:return void E("Connection is gone before handshake completed, ignoring...");case t.ErrorCode.WEBSOCKET_ERROR:return E("Native websocket error",e.payload),n.close(m.HANDSHAKE_FAILED.code,m.HANDSHAKE_FAILED.reason);default:return E("Unhandled line error",e),n.close(m.HANDSHAKE_FAILED.code,m.HANDSHAKE_FAILED.reason)}return E("Unknown error",e),n.close(m.HANDSHAKE_FAILED.code,m.HANDSHAKE_FAILED.reason)}).then(function(){e.dispose()})}),e.once("rejected",function(t){E("Handshake is rejected, sending response..."),n.sendWithoutResponse_(e.createResponse(t)).catch(function(e){return E('Handshake rejecting response could not sent, manually calling "close"...',e)}).then(function(){return n.close(m.HANDSHAKE_REJECTED.code,m.HANDSHAKE_REJECTED.reason,50)}).then(function(){e.dispose()})}),E('Emitting server\'s "handshake" event...');var o=this.server.emit("handshake",this,e);o||(E("There is no handshake listener, resolving the handshake by default..."),e.resolve())}},{key:"onPingMessage_",value:function(e){E('Ping received, responding with "pong"...'),this.sendWithoutResponse_(e.createResponse(null,"pong")).catch(function(e){return E("Ping response failed to send back, ignoring for now...",e)})}},{key:"onResponseMessage_",value:function(e){var n=this.deferreds_[e.id];if(n){if(e.err){E("Response (rejecting) recieved: "+e);var o=new v(t.ErrorCode.MESSAGE_REJECTED,"Message is rejected by server, check payload.",e.err);n.reject(o)}else E("Response (resolving) recieved: "+e),n.resolve(e.payload);delete this.deferreds_[e.id]}}},{key:"onMessageWithoutResponse_",value:function(e){E('Message without response: name="'+e.name+'"'),this.emit(e.name,e)}},{key:"onMessageWithResponse_",value:function(e){var n=this;E('Message with response: name="'+e.name+'" id="'+e.id+'"'),e.once("resolved",function(o){E("Message #"+e.id+" is resolved, sending response..."),n.sendWithoutResponse_(e.createResponse(null,o)).catch(function(o){n.emit(t.Event.ERROR,new v(t.ErrorCode.MESSAGE_NOT_RESPONDED,'Message (name="'+e.name+'" id="'+e.id+'") could not responded (resolve)',o))}).then(function(){return e.dispose()})}),e.once("rejected",function(o){E("Message #"+e.id+" is rejected, sending response..."),n.sendWithoutResponse_(e.createResponse(o)).catch(function(o){n.emit(t.Event.ERROR,new v(t.ErrorCode.MESSAGE_NOT_RESPONDED,'Message (name="'+e.name+'" id="'+e.id+'") could not responded (reject)',o))}).then(function(){return e.dispose()})}),this.emit(e.name,e)}},{key:"onError_",value:function(e){E('Native "error" event recieved, emitting line\'s "error" event: '+e),this.emit(t.Event.ERROR,e)}},{key:"onClose_",value:function(e,n){E('Native "close" event recieved with code '+e+": "+n),E("Removing connection from all rooms, rejecting all waiting messages..."),this.handshakeTimeout_&&clearTimeout(this.handshakeTimeout_),this.autoPing_.cancel(),this.server.rooms.removeFromAll(this),this.server.rooms.root.remove(this),this.rejectAllDeferreds_(new v(t.ErrorCode.DISCONNECTED,"Socket connection closed!")),E('Emitting line\'s "close" event...'),this.state=t.State.DISCONNECTED,this.emit(t.Event.DISCONNECTED,e,n),this.idleTimeout.dispose()}},{key:"setId",value:function(e){if(this.state!=t.State.AWAITING_HANDSHAKE)throw new v(t.ErrorCode.HANDSHAKE_ENDED,"Handshake already ended, you cannot change connection id anymore");if(this.server.getConnectionById(e))throw new v(t.ErrorCode.ID_CONFLICT,"Conflict! There is already connection with id "+e);this.id=e,E=p("line:server:connection:"+this.id)}},{key:"joinRoom",value:function(e){this.server.rooms.add(e,this)}},{key:"leaveRoom",value:function(e){this.server.rooms.remove(e,this)}},{key:"getRooms",value:function(){return this.server.rooms.getRoomsOf(this)}},{key:"send",value:function(e,n,o){if(this.state!=t.State.CONNECTED)return Promise.reject(new v(t.ErrorCode.DISCONNECTED,"Could not send message, client is not connected."));try{var r=new a({name:e,payload:n});return this.send_(r,o)}catch(e){return Promise.reject(new v(t.ErrorCode.INVALID_JSON,'Could not send message, "payload" stringify error. Probably circular json issue.'))}}},{key:"sendWithoutResponse",value:function(e,n){if(this.state!=t.State.CONNECTED)return Promise.reject(new v(t.ErrorCode.DISCONNECTED,"Could not send message, client is not connected."));try{var o=new a({name:e,payload:n});return this.sendWithoutResponse_(o)}catch(e){return Promise.reject(new v(t.ErrorCode.INVALID_JSON,'Could not send message, "payload" stringify error. Probably circular json issue.'))}}},{key:"send_",value:function(e,n){var o=this,r=d(n)&&n>=0?n:this.server.options.responseTimeout;e.setId();var i=this.deferreds_[e.id]=new h({onExpire:function(){delete o.deferreds_[e.id]},timeout:r});return this.sendWithoutResponse_(e).then(function(){return i}).catch(function(e){if(i.dispose(),e instanceof v&&e.code==h.ErrorCode.EXPIRED)throw new v(t.ErrorCode.MESSAGE_TIMEOUT,"Message timeout! Its response did not recived after "+r+" ms");throw e})}},{key:"sendWithoutResponse_",value:function(e){var n=this;return this.socket&&1==this.socket.readyState?new Promise(function(o,r){E("Sending message: "+e);var i=e.toString();n.socket.send(i,function(e){return e?r(new v(t.ErrorCode.WEBSOCKET_ERROR,"Could not send message, native websocket error, check payload.",e)):void o()})}):Promise.reject(new v(t.ErrorCode.DISCONNECTED,"Could not send message, there is no open connection."))}},{key:"ping",value:function(){var e=this;return E("Pinging..."),this.send_(new a({name:a.Name.PING})).catch(function(n){throw E("Auto-ping failed, manually disconnecting...",n),e.close(m.PING_FAILED.code,m.PING_FAILED.reason),new v(t.ErrorCode.PING_ERROR,"Ping failed, manually disconnecting...",n)})}},{key:"close",value:function(e,t,n){var o=this;return E("Closing the connection in "+(n||0)+" ms with code: "+e+"."),new Promise(function(r){setTimeout(function(){o.socket.close(e||1e3,t)},n||0)})}},{key:"rejectAllDeferreds_",value:function(e){u(this.deferreds_,function(t){return t.reject(e)}),this.deferreds_={}}}]),t}(c);g.ErrorCode={MESSAGE_TIMEOUT:"scMessageTimeout",MESSAGE_REJECTED:"scMessageRejected",MESSAGE_NOT_RESPONDED:"cMessageNotResponded",INVALID_JSON:"scInvalidJson",HANDSHAKE_ENDED:"scHandshakeEnded",ID_CONFLICT:"scIdConflict",DISCONNECTED:"scDisconnected",WEBSOCKET_ERROR:"scWebsocketError",PING_ERROR:"scPingError",IDLE_TIMEOUT:"scIdleTimeout"},g.State={AWAITING_HANDSHAKE:"awaitingHandshake",CONNECTED:"connected",DISCONNECTED:"disconnected"},g.Event={ERROR:"_error",DISCONNECTED:"_disconnected"},e.exports=g},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(18),s=n(5),a=n(22),c=n(15),u=function(){function e(){o(this,e),this.rooms={},this.root=new c}return r(e,[{key:"add",value:function(e,t){this.rooms[e]||(this.rooms[e]=new c(e)),this.rooms[e].add(t)}},{key:"remove",value:function(e,t){this.rooms[e]&&(this.rooms[e].remove(t),this.rooms[e].getConnectionsCount()||delete this.rooms[e])}},{key:"getRoomsOf",value:function(e){return a(i(this.rooms,function(t){return t.getConnectionById(e.id)}),"name")}},{key:"getRoom",value:function(e){return this.rooms[e]}},{key:"removeFromAll",value:function(e){var t=this,n=this.getRoomsOf(e);s(n,function(n){return t.rooms[n].remove(e)})}}]),e}();e.exports=u},function(e,t){e.exports=require("uws")},function(e,t){e.exports=require("ws")},function(e,t){"use strict";e.exports={INTERNAL_ERROR:{code:4200,reason:"Internal error"},PING_FAILED:{code:4201,reason:"Ping failed"},HANDSHAKE_FAILED:{code:4202,reason:"Handshake failed"},HANDSHAKE_REJECTED:{code:4203,reason:"Handshake rejected"},DISCONNECT_TIMEOUT:{code:4204,reason:"Disconnect timeout"},DISPOSED:{code:4205,reason:"Client disposed"},UNKNOWN_ERROR:{code:4299,reason:"Unknown error"}}},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(0),s=function(){function e(){var t=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=n.handler,i=void 0===r?function(){}:r,s=n.onExpire,a=void 0===s?function(){}:s,c=n.timeout,u=void 0===c?0:c,d=n.rejectOnExpire,l=void 0===d||d;o(this,e),this.resolve_=null,this.reject_=null,this.timeout_=null,this.timeoutDuration_=u,this.rejectOnExpire_=l,this.onExpire_=a,this.isFinished_=!1,this.promise=new Promise(function(e,n){t.resolve_=e,t.reject_=n;try{i(t)}catch(e){t.reject(e)}}),u>0&&(this.timeout_=setTimeout(this.expire.bind(this),u))}return r(e,[{key:"resolve",value:function(e){this.isFinished_||(this.isFinished_=!0,this.clearTimeout_(),this.resolve_(e))}},{key:"reject",value:function(e){this.isFinished_||(this.isFinished_=!0,this.clearTimeout_(),this.reject_(e))}},{key:"expire",value:function(){this.isFinished_=!0,this.clearTimeout_(),this.onExpire_(),this.rejectOnExpire_&&this.reject_(new i(e.ErrorCode.EXPIRED,"Timeout "+this.timeoutDuration_+" ms exceed"))}},{key:"dispose",value:function(){this.isFinished_=!0,this.clearTimeout_()}},{key:"delay",value:function(e){this.timeoutDuration_>0&&(this.clearTimeout_(),this.timeout_=setTimeout(this.expire.bind(this),e||this.timeoutDuration_))}},{key:"then",value:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return this.promise.then.apply(this.promise,t)}},{key:"catch",value:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return this.promise.catch.apply(this.promise,t)}},{key:"clearTimeout_",value:function(){this.timeout_&&(clearTimeout(this.timeout_),this.timeout_=null)}}]),e}();s.ErrorCode={EXPIRED:"dExpired"},e.exports=s},function(e,t,n){"use strict";function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:4;return("0000"+(Math.random()*Math.pow(36,e)<<0).toString(36)).slice(-e)}n(1);e.exports={generateDummyId:o}},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(5),s=n(16),a=n(2),c=n(3)("line:server:room"),u=(n(0),function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,e),this.name=t,this.connections=n}return r(e,[{key:"add",value:function(e){this.connections[e.id]=e}},{key:"remove",value:function(e){return e!=this.connections[e.id]?(c("["+(this.name||"root")+'] Did not remove "'+e.id+'", connection instance is not added or different'),!1):(c("["+(this.name||"root")+'] Removing "'+e.id+'"'),delete this.connections[e.id],!0)}},{key:"getConnectionById",value:function(e){return this.connections[e]}},{key:"getConnections",value:function(){return s(this.connections)}},{key:"getConnectionsCount",value:function(){return Object.keys(this.connections).length}},{key:"broadcast_",value:function(e){var t=this;i(this.connections,function(n){n.sendWithoutResponse_(e).catch(function(o){c("["+(t.name||"root")+'] Could not send "'+e.name+'" to "'+n.id+'" while broadcasting, ignoring...')})})}},{key:"broadcast",value:function(e,t){var n=new a({name:e,payload:t});this.broadcast_(n)}}]),e}());e.exports=u},function(e,t){e.exports=require("lodash/clone")},function(e,t){e.exports=require("lodash/debounce")},function(e,t){e.exports=require("lodash/filter")},function(e,t){e.exports=require("lodash/isFunction")},function(e,t){e.exports=require("lodash/isString")},function(e,t){e.exports=require("lodash/isUndefined")},function(e,t){e.exports=require("lodash/map")},function(e,t){e.exports=require("lodash/values")},function(e,t){e.exports=require("uuid")},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(8),c=n(2),u=n(9),d=n(4),l=n(3)("line:server"),h=n(0),f=n(1),p=n(6),v=void 0;try{v=n(10).Server}catch(e){v=n(11).Server,l("Could not find module uws, falling back to ws",e)}var m=function(e){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o(this,t);var n=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));if(n.options=f({responseTimeout:1e4,handshakeTimeout:6e4,pingInterval:15e3},e),!p(n.options.responseTimeout)||n.options.responseTimeout<0)throw new h(t.ErrorCode.INVALID_OPTIONS,'"options.responseTimeout" must be a positive integer or zero');if(!p(n.options.handshakeTimeout)||n.options.handshakeTimeout<0)throw new h(t.ErrorCode.INVALID_OPTIONS,'"options.handshakeTimeout" must be a positive integer or zero');if(!p(n.options.pingInterval)||n.options.pingInterval<0)throw new h(t.ErrorCode.INVALID_OPTIONS,'"options.pingInterval" must be a positive integer or zero');return n.rooms=new u,l("Initalizing with options: "+JSON.stringify(n.options)),n}return i(t,e),s(t,[{key:"start",value:function(){var e=this;if(this.server)return Promise.reject(new h(t.ErrorCode.INVALID_ACTION,"Could not start server, already started!"));if(!this.options.port){l("Starting without port...");try{return this.server=new v(this.options),this.bindEvents_(),Promise.resolve()}catch(e){return Promise.reject(new h(t.ErrorCode.WEBSOCKET_ERROR,"Could not start the server, websocket error, check payload",e))}}return new Promise(function(n,o){l('Starting with port "'+e.options.port+'" ...'),e.server=new v(e.options,function(r){return r?(l("Could not start: "+r),o(new h(t.ErrorCode.WEBSOCKET_ERROR,"Could not start the server, websocket error, check payload",r))):(e.bindEvents_(),void n())})})}},{key:"stop",value:function(){var e=this;return this.server?new Promise(function(t){l("Closing and disposing the server..."),e.server.close(),e.server=null,t()}):(l("Could not stop server. Server is probably not started, or already stopped."),Promise.reject(new h(t.ErrorCode.INVALID_ACTION,"Could not stop server. Server is probably not started, or already stopped!")))}},{key:"bindEvents_",value:function(){l("Binding server events..."),this.server.on("connection",this.onConnection_.bind(this)),this.server.on("headers",this.onHeaders_.bind(this)),this.server.on("error",this.onError_.bind(this))}},{key:"onConnection_",value:function(e){l('Native "connection" event recieved, creating line connection...');new a(e,this)}},{key:"onHeaders_",value:function(e){l('Native "headers" event recieved, emitting line\'s "headers" event... ('+e+")"),this.emit(t.Event.HEADERS,e)}},{key:"onError_",value:function(e){l('Native "error" event recieved, emitting line\'s "error" event... ('+e+")"),this.emit(t.Event.ERROR,e)}},{key:"getConnections",value:function(){return this.rooms.root.getConnections()}},{key:"getConnectionById",value:function(e){return this.rooms.root.getConnectionById(e)}},{key:"broadcast",value:function(e,t){l('Broadcasting "'+e+'" message...'),this.rooms.root.broadcast(e,t)}},{key:"getRoom",value:function(e){return this.rooms.getRoom(e)}},{key:"getRoomsOf",value:function(e){return this.rooms.getRoomsOf(e)}},{key:"removeFromAllRooms",value:function(e){this.rooms.removeFromAll(e)}}]),t}(d);m.Message=c,m.Connection=a,m.Error=h,m.ErrorCode={INVALID_OPTIONS:"sInvalidOptions",INVALID_ACTION:"sInvalidAction",WEBSOCKET_ERROR:"sWebsocketError"},m.Event={HANDSHAKE:"handshake",CONNECTION:"connection",HEADERS:"headers",ERROR:"error"},e.exports=m}]);
//# sourceMappingURL=server.js.map
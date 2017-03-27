module.exports=function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};return n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,n,t){Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=24)}([function(e,n){"use strict";function t(e,n,t){this.name="LineError",this.message=n,this.code=e,this.payload=t,this.stack=(new Error).stack}t.prototype=new Error,e.exports=t},function(e,n){e.exports=require("lodash/assign")},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(20),c=t(19),u=t(7),d=(t(18),t(22)),h=t(1),l=t(13),f=l.generateDummyId,p=t(4),v=t(0),m=function(e){function n(e){var t=e.name,i=e.payload,s=e.id,a=e.err;o(this,n);var c=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));try{JSON.stringify(i),JSON.stringify(a)}catch(e){throw new v(n.ErrorCode.INVALID_JSON,"Message payload or error must be json-friendly. Maybe circular json?")}return c.name=t,c.payload=i,c.id=s,c.err=a,c.isResponded_=!1,c}return i(n,e),s(n,null,[{key:"parse",value:function(e){try{var t=JSON.parse(e);return u(t.e)&&c(t.e.name)&&c(t.e.message)&&(t.e=h(new Error,t.e)),new n({name:t.n,payload:t.p,err:t.e,id:t.i})}catch(e){throw new v(n.ErrorCode.INVALID_JSON,"Could not parse incoming message.")}}}]),s(n,[{key:"setId",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f();return this.id=e,e}},{key:"createResponse",value:function(e,t){return new n({name:"_r",payload:t,err:e,id:this.id})}},{key:"resolve",value:function(e){if(a(this.id))throw new v(n.ErrorCode.MISSING_ID,"This message could not be resolved (no id)");if(this.isResponded_)throw new v(n.ErrorCode.ALREADY_RESPONDED,"This message has already responded");try{JSON.stringify(e)}catch(e){throw new v(n.ErrorCode.INVALID_JSON,"Message must be resolved with json-friendly payload. Maybe circular json?")}this.isResponded_=!0,this.emit("resolved",e)}},{key:"reject",value:function(e){if(a(this.id))throw new v(n.ErrorCode.MISSING_ID,"This message could not be rejected (no id)");if(this.isResponded_)throw new v(n.ErrorCode.ALREADY_RESPONDED,"This message has already responded");try{JSON.stringify(e)}catch(e){throw new v(n.ErrorCode.INVALID_JSON,"Message must be resolved with json-friendly payload. Maybe circular json?")}this.isResponded_=!0,this.emit("rejected",e)}},{key:"toString",value:function(){var e={n:this.name};return a(this.payload)||(e.p=this.payload),a(this.id)||(e.i=this.id),a(this.err)||(e.e=this.err instanceof Error?h({name:this.err.name,message:this.err.message},this.err):this.err),JSON.stringify(e)}},{key:"dispose",value:function(){var e=this,n=this.eventNames();n.forEach(function(n){return e.removeAllListeners(n)})}}]),n}(p);m.Name={RESPONSE:"_r",HANDSHAKE:"_h",PING:"_p"},m.ReservedNames=d(m.Name),m.ErrorCode={INVALID_JSON:"mInvalidJson",MISSING_ID:"mMissingId",ALREADY_RESPONDED:"mAlreadyResponded"},e.exports=m},function(e,n){e.exports=require("debug")},function(e,n){e.exports=require("event-emitter-extra")},function(e,n){e.exports=require("lodash/forEach")},function(e,n){e.exports=require("lodash/isInteger")},function(e,n){e.exports=require("lodash/isObject")},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(2),c=t(4),u=(t(1),t(5)),d=t(6),h=(t(7),t(16)),l=t(12),f=t(23),p=t(3)("line:server:connection"),v=t(0),m=t(11),E=function(e){function n(e,t){o(this,n);var i=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return i.id=f.v4(),p("Creating connection with id "+i.id+" ..."),i.socket=e,i.server=t,i.state=n.State.AWAITING_HANDSHAKE,i.deferreds_={},i.autoPing_=h(function(){}),i.socket.on("message",i.onMessage_.bind(i)),i.socket.on("error",i.onError_.bind(i)),i.socket.on("close",i.onClose_.bind(i)),t.options.pingInterval>0&&(i.autoPing_=h(function(){i.ping().then(function(){p("Auto-ping successful"),t.options.pingInterval>0&&i.state==n.State.CONNECTED&&i.autoPing_()}).catch(function(e){})},t.options.pingInterval)),t.options.handshakeTimeout>0&&(i.handshakeTimeout_=setTimeout(function(){return i.state!=n.State.AWAITING_HANDSHAKE?p("Handshake is not awaiting, ignoring handshake timeout..."):(p("Handshake timeout exceed, closing the connection..."),void i.close(m.HANDSHAKE_FAILED.code,"Handshake not completed after "+t.options.handshakeTimeout+" ms"))},t.options.handshakeTimeout)),i}return i(n,e),s(n,[{key:"onMessage_",value:function(e,t){p('Native "message" event recieved: '+e);var o=void 0;this.state==n.State.CONNECTED&&this.autoPing_();try{o=a.parse(e)}catch(t){return void this.emit(n.Event.ERROR,new v(n.ErrorCode.INVALID_JSON,"Could not parse message, invalid json. Check payload for incoming data.",e))}o.name==a.Name.HANDSHAKE?this.onHandshakeMessage_(o):o.name==a.Name.PING?this.onPingMessage_(o):o.name==a.Name.RESPONSE?this.onResponseMessage_(o):a.ReservedNames.indexOf(o.name)==-1?o.id?this.onMessageWithResponse_(o):this.onMessageWithoutResponse_(o):p("Could not route the message",o)}},{key:"onHandshakeMessage_",value:function(e){var t=this;if(this.state==n.State.CONNECTED)return p("Handshake message recieved but, handshake is already resolved, ignoring..."),this.sendWithoutResponse_(e.createResponse(new Error("Handshake is already resolved"))).catch(function(){});p("Handshake message recieved: "+e),e.once("resolved",function(o){p("Handshake is resolved, sending response..."),t.state=n.State.CONNECTED,t.handshakeTimeout_&&clearTimeout(t.handshakeTimeout_),t.autoPing_();var r={payload:o,id:t.id};t.sendWithoutResponse_(e.createResponse(null,r)).then(function(){p("Handshake resolving response is sent, emitting connection..."),t.server.rooms.root.add(t),t.server.emit("connection",t)}).catch(function(e){if(p("Could not send handshake response",e),e instanceof v)switch(e.code){case n.ErrorCode.DISCONNECTED:return void p("Connection is gone before handshake completed, ignoring...");case n.ErrorCode.WEBSOCKET_ERROR:return p("Native websocket error",e.payload),t.close(m.HANDSHAKE_FAILED.code,m.HANDSHAKE_FAILED.reason);default:return p("Unhandled line error",e),t.close(m.HANDSHAKE_FAILED.code,m.HANDSHAKE_FAILED.reason)}return p("Unknown error",e),t.close(m.HANDSHAKE_FAILED.code,m.HANDSHAKE_FAILED.reason)}).then(function(){e.dispose()})}),e.once("rejected",function(n){p("Handshake is rejected, sending response..."),t.sendWithoutResponse_(e.createResponse(n)).catch(function(e){return p('Handshake rejecting response could not sent, manually calling "close"...',e)}).then(function(){return t.close(m.HANDSHAKE_REJECTED.code,m.HANDSHAKE_REJECTED.reason,50)}).then(function(){e.dispose()})}),p('Emitting server\'s "handshake" event...');var o=this.server.emit("handshake",this,e);o||(p("There is no handshake listener, resolving the handshake by default..."),e.resolve())}},{key:"onPingMessage_",value:function(e){p('Ping received, responding with "pong"...'),this.sendWithoutResponse_(e.createResponse(null,"pong")).catch(function(e){return p("Ping response failed to send back, ignoring for now...",e)})}},{key:"onResponseMessage_",value:function(e){var t=this.deferreds_[e.id];if(t){if(e.err){p("Response (rejecting) recieved: "+e);var o=new v(n.ErrorCode.MESSAGE_REJECTED,"Message is rejected by server, check payload.",e.err);t.reject(o)}else p("Response (resolving) recieved: "+e),t.resolve(e.payload);delete this.deferreds_[e.id]}}},{key:"onMessageWithoutResponse_",value:function(e){p('Message without response: name="'+e.name+'"'),this.emit(e.name,e)}},{key:"onMessageWithResponse_",value:function(e){var t=this;p('Message with response: name="'+e.name+'" id="'+e.id+'"'),e.once("resolved",function(o){p("Message #"+e.id+" is resolved, sending response..."),t.sendWithoutResponse_(e.createResponse(null,o)).catch(function(o){t.emit(n.Event.ERROR,new v(n.ErrorCode.MESSAGE_NOT_RESPONDED,'Message (name="'+e.name+'" id="'+e.id+'") could not responded (resolve)',o))}).then(function(){return e.dispose()})}),e.once("rejected",function(o){p("Message #"+e.id+" is rejected, sending response..."),t.sendWithoutResponse_(e.createResponse(o)).catch(function(o){t.emit(n.Event.ERROR,new v(n.ErrorCode.MESSAGE_NOT_RESPONDED,'Message (name="'+e.name+'" id="'+e.id+'") could not responded (reject)',o))}).then(function(){return e.dispose()})}),this.emit(e.name,e)}},{key:"onError_",value:function(e){p('Native "error" event recieved, emitting line\'s "error" event: '+e),this.emit(n.Event.ERROR,e)}},{key:"onClose_",value:function(e,t){p('Native "close" event recieved with code '+e+": "+t),p("Removing connection from all rooms, rejecting all waiting messages..."),this.handshakeTimeout_&&clearTimeout(this.handshakeTimeout_),this.autoPing_.cancel(),this.server.rooms.removeFromAll(this),this.server.rooms.root.remove(this),this.rejectAllDeferreds_(new v(n.ErrorCode.DISCONNECTED,"Socket connection closed!")),p('Emitting line\'s "close" event...'),this.state=n.State.DISCONNECTED,this.emit(n.Event.DISCONNECTED,e,t)}},{key:"setId",value:function(e){if(this.state!=n.State.AWAITING_HANDSHAKE)throw new v(n.ErrorCode.HANDSHAKE_ENDED,"Handshake already ended, you cannot change connection id anymore");if(this.server.getConnectionById(e))throw new v(n.ErrorCode.ID_CONFLICT,"Conflict! There is already connection with id "+e);this.id=e}},{key:"joinRoom",value:function(e){this.server.rooms.add(e,this)}},{key:"leaveRoom",value:function(e){this.server.rooms.remove(e,this)}},{key:"getRooms",value:function(){return this.server.rooms.getRoomsOf(this)}},{key:"send",value:function(e,t,o){if(this.state!=n.State.CONNECTED)return Promise.reject(new v(n.ErrorCode.DISCONNECTED,"Could not send message, client is not connected."));try{var r=new a({name:e,payload:t});return this.send_(r,o)}catch(e){return Promise.reject(new v(n.ErrorCode.INVALID_JSON,'Could not send message, "payload" stringify error. Probably circular json issue.'))}}},{key:"sendWithoutResponse",value:function(e,t){if(this.state!=n.State.CONNECTED)return Promise.reject(new v(n.ErrorCode.DISCONNECTED,"Could not send message, client is not connected."));try{var o=new a({name:e,payload:t});return this.sendWithoutResponse_(o)}catch(e){return Promise.reject(new v(n.ErrorCode.INVALID_JSON,'Could not send message, "payload" stringify error. Probably circular json issue.'))}}},{key:"send_",value:function(e,t){var o=this,r=d(t)&&t>=0?t:this.server.options.responseTimeout;e.setId();var i=this.deferreds_[e.id]=new l({onExpire:function(){delete o.deferreds_[e.id]},timeout:r});return this.sendWithoutResponse_(e).then(function(){return i}).catch(function(e){if(i.dispose(),e instanceof v&&e.code==l.ErrorCode.EXPIRED)throw new v(n.ErrorCode.MESSAGE_TIMEOUT,"Message timeout! Its response did not recived after "+r+" ms");throw e})}},{key:"sendWithoutResponse_",value:function(e){var t=this;return this.socket&&1==this.socket.readyState?new Promise(function(o,r){p("Sending message: "+e);var i=e.toString();t.socket.send(i,function(e){return e?r(new v(n.ErrorCode.WEBSOCKET_ERROR,"Could not send message, native websocket error, check payload.",e)):void o()})}):Promise.reject(new v(n.ErrorCode.DISCONNECTED,"Could not send message, there is no open connection."))}},{key:"ping",value:function(){var e=this;return p("Pinging..."),this.send_(new a({name:a.Name.PING})).catch(function(t){throw p("Auto-ping failed, manually disconnecting..."),e.close(m.PING_FAILED.code,m.PING_FAILED.reason),new v(n.ErrorCode.PING_ERROR,"Ping failed, manually disconnecting...",t)})}},{key:"close",value:function(e,n,t){var o=this;return p("Closing the connection in "+(t||0)+" ms..."),new Promise(function(r){setTimeout(function(){o.socket.close(e||1e3,n),r()},t||0)})}},{key:"rejectAllDeferreds_",value:function(e){u(this.deferreds_,function(n){return n.reject(e)}),this.deferreds_={}}}]),n}(c);E.ErrorCode={MESSAGE_TIMEOUT:"scMessageTimeout",MESSAGE_REJECTED:"scMessageRejected",MESSAGE_NOT_RESPONDED:"cMessageNotResponded",INVALID_JSON:"scInvalidJson",HANDSHAKE_ENDED:"scHandshakeEnded",ID_CONFLICT:"scIdConflict",DISCONNECTED:"scDisconnected",WEBSOCKET_ERROR:"scWebsocketError",PING_ERROR:"scPingError"},E.State={AWAITING_HANDSHAKE:"awaitingHandshake",CONNECTED:"connected",DISCONNECTED:"disconnected"},E.Event={ERROR:"_error",DISCONNECTED:"_disconnected"},e.exports=E},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(17),s=t(5),a=t(21),c=t(14),u=function(){function e(){o(this,e),this.rooms={},this.root=new c}return r(e,[{key:"add",value:function(e,n){this.rooms[e]||(this.rooms[e]=new c(e)),this.rooms[e].add(n)}},{key:"remove",value:function(e,n){this.rooms[e]&&(this.rooms[e].remove(n),this.rooms[e].getConnectionsCount()||delete this.rooms[e])}},{key:"getRoomsOf",value:function(e){return a(i(this.rooms,function(n){return n.getConnectionById(e.id)}),"name")}},{key:"getRoom",value:function(e){return this.rooms[e]}},{key:"removeFromAll",value:function(e){var n=this,t=this.getRoomsOf(e);s(t,function(t){return n.rooms[t].remove(e)})}}]),e}();e.exports=u},function(e,n){e.exports=require("uws")},function(e,n){"use strict";e.exports={INTERNAL_ERROR:{code:4200,reason:"Internal error"},PING_FAILED:{code:4201,reason:"Ping failed"},HANDSHAKE_FAILED:{code:4202,reason:"Handshake failed"},HANDSHAKE_REJECTED:{code:4203,reason:"Handshake rejected"},DISCONNECT_TIMEOUT:{code:4204,reason:"Disconnect timeout"},DISPOSED:{code:4205,reason:"Client disposed"},UNKNOWN_ERROR:{code:4299,reason:"Unknown error"}}},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(0),s=function(){function e(){var n=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.handler,i=void 0===r?function(){}:r,s=t.onExpire,a=void 0===s?function(){}:s,c=t.timeout,u=void 0===c?0:c;o(this,e),this.resolve_=null,this.reject_=null,this.timeout_=null,this.timeoutDuration_=u,this.onExpire_=a,this.isFinished_=!1,this.promise=new Promise(function(e,t){n.resolve_=e,n.reject_=t;try{i(n)}catch(e){n.reject(e)}}),u>0&&(this.timeout_=setTimeout(this.expire.bind(this),u))}return r(e,[{key:"resolve",value:function(e){this.isFinished_||(this.isFinished_=!0,this.clearTimeout_(),this.resolve_(e))}},{key:"reject",value:function(e){this.isFinished_||(this.isFinished_=!0,this.clearTimeout_(),this.reject_(e))}},{key:"expire",value:function(){this.isFinished_=!0,this.clearTimeout_(),this.onExpire_(),this.reject_(new i(e.ErrorCode.EXPIRED,"Timeout "+this.timeoutDuration_+" ms exceed"))}},{key:"dispose",value:function(){this.isFinished_=!0,this.clearTimeout_()}},{key:"then",value:function(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.promise.then.apply(this.promise,n)}},{key:"catch",value:function(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];return this.promise.catch.apply(this.promise,n)}},{key:"clearTimeout_",value:function(){this.timeout_&&(clearTimeout(this.timeout_),this.timeout_=null)}}]),e}();s.ErrorCode={EXPIRED:"dExpired"},e.exports=s},function(e,n,t){"use strict";function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:4;return("0000"+(Math.random()*Math.pow(36,e)<<0).toString(36)).slice(-e)}t(1);e.exports={generateDummyId:o}},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(5),s=t(15),a=t(2),c=t(3)("line:server:room"),u=(t(0),function(){function e(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,e),this.name=n,this.connections=t}return r(e,[{key:"add",value:function(e){this.connections[e.id]=e}},{key:"remove",value:function(e){return e!=this.connections[e.id]?(c("["+(this.name||"root")+'] Did not remove "'+e.id+'", connection instance is not added or different'),!1):(c("["+(this.name||"root")+'] Removing "'+e.id+'"'),delete this.connections[e.id],!0)}},{key:"getConnectionById",value:function(e){return this.connections[e]}},{key:"getConnections",value:function(){return s(this.connections)}},{key:"getConnectionsCount",value:function(){return Object.keys(this.connections).length}},{key:"broadcast_",value:function(e){var n=this;i(this.connections,function(t){t.sendWithoutResponse_(e).catch(function(o){c("["+(n.name||"root")+'] Could not send "'+e.name+'" to "'+t.id+'" while broadcasting, ignoring...')})})}},{key:"broadcast",value:function(e,n){var t=new a({name:e,payload:n});this.broadcast_(t)}}]),e}());e.exports=u},function(e,n){e.exports=require("lodash/clone")},function(e,n){e.exports=require("lodash/debounce")},function(e,n){e.exports=require("lodash/filter")},function(e,n){e.exports=require("lodash/isFunction")},function(e,n){e.exports=require("lodash/isString")},function(e,n){e.exports=require("lodash/isUndefined")},function(e,n){e.exports=require("lodash/map")},function(e,n){e.exports=require("lodash/values")},function(e,n){e.exports=require("uuid")},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(10).Server,c=t(8),u=t(2),d=t(9),h=t(4),l=t(3)("line:server"),f=t(0),p=t(1),v=t(6),m=function(e){function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o(this,n);var t=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));if(t.options=p({responseTimeout:1e4,handshakeTimeout:6e4,pingInterval:15e3},e),!v(t.options.responseTimeout)||t.options.responseTimeout<0)throw new f(n.ErrorCode.INVALID_OPTIONS,'"options.responseTimeout" must be a positive integer or zero');if(!v(t.options.handshakeTimeout)||t.options.handshakeTimeout<0)throw new f(n.ErrorCode.INVALID_OPTIONS,'"options.handshakeTimeout" must be a positive integer or zero');if(!v(t.options.pingInterval)||t.options.pingInterval<0)throw new f(n.ErrorCode.INVALID_OPTIONS,'"options.pingInterval" must be a positive integer or zero');return t.rooms=new d,l("Initalizing with options: "+JSON.stringify(t.options)),t}return i(n,e),s(n,[{key:"start",value:function(){var e=this;if(this.server)return Promise.reject(new f(n.ErrorCode.INVALID_ACTION,"Could not start server, already started!"));if(!this.options.port){l("Starting without port...");try{return this.server=new a(this.options),this.bindEvents_(),Promise.resolve()}catch(e){return Promise.reject(new f(n.ErrorCode.WEBSOCKET_ERROR,"Could not start the server, websocket error, check payload",e))}}return new Promise(function(t,o){l('Starting with port "'+e.options.port+'" ...'),e.server=new a(e.options,function(r){return r?(l("Could not start: "+r),o(new f(n.ErrorCode.WEBSOCKET_ERROR,"Could not start the server, websocket error, check payload",r))):(e.bindEvents_(),void t())})})}},{key:"stop",value:function(){var e=this;return this.server?new Promise(function(n){l("Closing and disposing the server..."),e.server.close(),e.server=null,n()}):(l("Could not stop server. Server is probably not started, or already stopped."),Promise.reject(new f(n.ErrorCode.INVALID_ACTION,"Could not stop server. Server is probably not started, or already stopped!")))}},{key:"bindEvents_",value:function(){l("Binding server events..."),this.server.on("connection",this.onConnection_.bind(this)),this.server.on("headers",this.onHeaders_.bind(this)),this.server.on("error",this.onError_.bind(this))}},{key:"onConnection_",value:function(e){l('Native "connection" event recieved, creating line connection...');new c(e,this)}},{key:"onHeaders_",value:function(e){l('Native "headers" event recieved, emitting line\'s "headers" event... ('+e+")"),this.emit(n.Event.HEADERS,e)}},{key:"onError_",value:function(e){l('Native "error" event recieved, emitting line\'s "error" event... ('+e+")"),this.emit(n.Event.ERROR,e)}},{key:"getConnections",value:function(){return this.rooms.root.getConnections()}},{key:"getConnectionById",value:function(e){return this.rooms.root.getConnectionById(e)}},{key:"broadcast",value:function(e,n){l('Broadcasting "'+e+'" message...'),this.rooms.root.broadcast(e,n)}},{key:"getRoom",value:function(e){return this.rooms.getRoom(e)}},{key:"getRoomsOf",value:function(e){return this.rooms.getRoomsOf(e)}},{key:"removeFromAllRooms",value:function(e){this.rooms.removeFromAll(e)}}]),n}(h);m.Message=u,m.Connection=c,m.Error=f,m.ErrorCode={INVALID_OPTIONS:"sInvalidOptions",INVALID_ACTION:"sInvalidAction",WEBSOCKET_ERROR:"sWebsocketError"},m.Event={HANDSHAKE:"handshake",CONNECTION:"connection",HEADERS:"headers",ERROR:"error"},e.exports=m}]);
//# sourceMappingURL=server.js.map
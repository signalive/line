module.exports=function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,t,n){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=21)}([function(e,t){"use strict";function n(e,t,n){this.name="LineError",this.message=t,this.code=e,this.payload=n,this.stack=(new Error).stack}n.prototype=new Error,e.exports=n},function(e,t){e.exports=require("lodash/assign")},function(e,t){e.exports=require("event-emitter-extra")},function(e,t){e.exports=require("lodash/isObject")},function(e,t){e.exports=require("lodash/isString")},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(9),c=n(2),u=n(8),d=(n(1),n(14)),h=n(12),l=n(3),p=n(15),E=n(4),f=n(18),m=n(17),N=n(13),_=n(11)("line:client"),O=n(0),v=n(7),C=function(e){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"ws://localhost",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));if(!E(e)||0==e.trim().length)throw new O(t.ErrorCode.INVALID_OPTIONS,"Url parameter must be string and cannot be empty");if(!l(n))throw new O(t.ErrorCode.INVALID_OPTIONS,"Options parameter must be an object");if(r.url=e.trim(),r.options=N(n,{handshake:{timeout:3e4,payload:void 0},responseTimeout:1e4,disconnectTimeout:5e3,pingInterval:2e4,reconnect:!0,reconnectOptions:{initialDelay:1e3,multiply:1.5,maxDelay:3e4,randomness:.5},uptime:!1,uptimeOptions:{interval:5e3,window:3e5}}),!l(r.options.handshake))throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.handshake" must be an object');if(!m(r.options.handshake.timeout)||r.options.handshake.timeout<0)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.handshake.timeout" must be a positive integer or zero');try{JSON.stringify(r.options.handshake.payload)}catch(e){throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.handshake.payload" must be json friendly, probably circular dependency?')}if(!m(r.options.responseTimeout)||r.options.responseTimeout<0)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.responseTimeout" must be a positive integer or zero');if(!m(r.options.disconnectTimeout)||r.options.disconnectTimeout<0)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.disconnectTimeout" must be a positive integer or zero');if(!m(r.options.pingInterval)||r.options.pingInterval<0)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.pingInterval" must be a positive integer or zero');if(!p(r.options.reconnect))throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.reconnect" must be a boolean');if(!l(r.options.reconnectOptions))throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.reconnectOptions" must be an object');if(!m(r.options.reconnectOptions.initialDelay)||r.options.reconnectOptions.initialDelay<=0)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.reconnectOptions.initialDelay" must be a positive integer');if(!f(r.options.reconnectOptions.multiply)||r.options.reconnectOptions.multiply<1)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.reconnectOptions.multiply" must be a number >= 1');if(!m(r.options.reconnectOptions.maxDelay)||r.options.reconnectOptions.maxDelay<=0)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.reconnectOptions.maxDelay" must be a positive integer');if(r.options.reconnectOptions.maxDelay<r.options.reconnectOptions.initialDelay)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.reconnectOptions.maxDelay" must be a greater than initial delay');if(!f(r.options.reconnectOptions.randomness)||r.options.reconnectOptions.randomness<0)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.reconnectOptions.randomness" must be a positive number or zero');if(!p(r.options.uptime))throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.uptime" must be a boolean');if(!l(r.options.uptimeOptions))throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.uptimeOptions" must be an object');if(!m(r.options.uptimeOptions.interval)||r.options.uptimeOptions.interval<=0)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.uptimeOptions.interval" must be a positive integer');if(!m(r.options.uptimeOptions.window)||r.options.uptimeOptions.window<=0)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.uptimeOptions.window" must be a positive integer');if(r.options.uptimeOptions.window<r.options.uptimeOptions.interval)throw new O(t.ErrorCode.INVALID_OPTIONS,'"options.uptimeOptions.window" must be a greater than interval');return r.ws_=null,r.id=null,r.state=t.State.READY,r.reconnectState_={disabled:!1,attempt:0,timeout:null},r.deferreds_={},r.disconnectTimeout_=null,r.uptimeBuffer_=[],r.uptimeBufferLength_=Math.round(r.options.uptimeOptions.window/r.options.uptimeOptions.interval),r.uptimeInterval_=n.uptime?setInterval(r.uptimeTick_.bind(r),r.options.uptimeOptions.interval):null,r.autoPing_=h(function(){}),r.options.pingInterval>0&&(r.autoPing_=h(function(){r.ping().then(function(){r.options.pingInterval>0&&r.state==t.State.CONNECTED&&r.autoPing_()}).catch(function(){})},r.options.pingInterval)),r}return r(t,e),s(t,[{key:"connect",value:function(){switch(this.state){case t.State.DISCONNECTED:case t.State.READY:_('Connecting to "'+this.url+'" ...');try{return this.reconnectState_.disabled=!1,this.ws_=new WebSocket(this.url),this.bindEvents_(),this.state=t.State.CONNECTING,this.emit(t.Event.CONNECTING),!0}catch(e){throw new O(t.ErrorCode.WEBSOCKET_ERROR,"Native websocket error. Invalid url or security error",e)}default:return _('Ignoring connect() call, client is in "'+this.state+'" state'),!1}}},{key:"connectAsync",value:function(){var e=this;return new Promise(function(n,o){e.connect();var i=function(){},r=function(e){i(),o(e)},s=function(e){i(),n(e)},a=function(e){i(),o(new O(t.ErrorCode.DISCONNECTED,"Client disconnected",e))};i=function(){e.removeListener(t.Event.CONNECTING_ERROR,r),e.removeListener(t.Event.CONNECTED,s),e.removeListener(t.Event.DISCONNECTED,a)},e.once(t.Event.CONNECTING_ERROR,r),e.once(t.Event.CONNECTED,s),e.once(t.Event.DISCONNECTED,a)})}},{key:"disconnect",value:function(e,n,o){var i=this;switch(this.state){case t.State.CONNECTING:case t.State.HANDSHAKING:case t.State.CONNECTED:_("Disconnecting... (State: "+this.state+")");try{return this.ws_.close(e||1e3,n),_("Websocket is closed"),this.reconnectState_.disabled=!o,this.rejectAllDeferreds_(new O(t.ErrorCode.DISCONNECTED,"Disconnect procedure started")),this.autoPing_.cancel(),this.disconnectTimeout_&&clearTimeout(this.disconnectTimeout_),this.options.disconnectTimeout&&(this.disconnectTimeout_=setTimeout(function(){_("Disconnect timeout exceeded, force disconnecting..."),i.emit(t.Event.ERROR,new O(t.ErrorCode.DISCONNECT_TIMEOUT,"Disconnect timeout exceeded, force disconnecting...")),i.onClose_(v.DISCONNECT_TIMEOUT),clearTimeout(i.disconnectTimeout_)},this.options.disconnectTimeout)),this.state=t.State.DISCONNECTING,this.emit(t.Event.DISCONNECTING),!0}catch(e){throw new O(t.ErrorCode.WEBSOCKET_ERROR,"Could not disconnect. Invalid code or reason, check payload.",e)}default:return _('Ignoring disconnect() call, client is in "'+this.state+'" state.'),!1}}},{key:"disconnectAsync",value:function(e,n,o){var i=this;return new Promise(function(r,s){i.disconnect(e,n,o);var a=function(e){r(e)};i.once(t.Event.DISCONNECTED,a)})}},{key:"bindEvents_",value:function(){_("Binding native event handlers."),this.ws_.onopen=this.onOpen_.bind(this),this.ws_.onclose=this.onClose_.bind(this),this.ws_.onerror=this.onError_.bind(this),this.ws_.onmessage=this.onMessage_.bind(this)}},{key:"unBindEvents_",value:function(){this.ws_&&(_("Unbinding native event handlers."),this.ws_.onopen=function(){},this.ws_.onclose=function(){},this.ws_.onerror=function(){},this.ws_.onmessage=function(){})}},{key:"onOpen_",value:function(){var e=this;_('Native "open" event received, starting handshake process'),this.state=t.State.HANDSHAKING;var n=new a({name:a.Name.HANDSHAKE,payload:this.options.handshake.payload});this.send_(n,this.options.handshake.timeout).then(function(n){return l(n)?(_("Handshake successful."),e.resetReconnectState_(),e.id=n.id,e.state=t.State.CONNECTED,e.autoPing_(),_('Emitting "connected" event...'),void e.emit(t.Event.CONNECTED,n.payload)):(_("Unexpected handshake response!?"),e.emit(t.Event.CONNECTING_ERROR,new O(t.ErrorCode.HANDSHAKE_ERROR,"Handshake response is not object. Aborting handshake...",n)),void e.disconnect(v.HANDSHAKE_FAILED.code,"Handshake failed, unexpected handshake response.",!0))}).catch(function(n){if(n instanceof O)switch(n.code){case t.ErrorCode.DISCONNECTED:return _("Handshake failed, connection lost (disconnected)"),void e.emit(t.Event.CONNECTING_ERROR,new O(t.ErrorCode.HANDSHAKE_ERROR,"Connection lost during handshake."));case t.ErrorCode.MESSAGE_TIMEOUT:return _("Handshake failed, message timeout"),e.emit(t.Event.CONNECTING_ERROR,new O(t.ErrorCode.HANDSHAKE_ERROR,"Handshake failed, request timeout.")),e.disconnect(v.HANDSHAKE_FAILED.code,"Handshake failed, request timeout.",!0);case t.ErrorCode.MESSAGE_REJECTED:return _("Handshake REJECTED!"),e.emit(t.Event.CONNECTING_ERROR,new O(t.ErrorCode.HANDSHAKE_REJECTED,"Handshake rejected, check payload for further details.",n&&n.payload)),e.disconnect(v.HANDSHAKE_REJECTED.code,"Handshake rejected",!0);case t.ErrorCode.WEBSOCKET_ERROR:return _("Handshake failed, native websocket error"),e.emit(t.Event.CONNECTING_ERROR,new O(t.ErrorCode.HANDSHAKE_ERROR,"Handshake failed. Websocket protocol error, check payload.",n&&n.payload)),e.disconnect(v.HANDSHAKE_FAILED.code,"Handshake failed, native websocket error",!0);default:return _("Handshake failed, unknown line error",n),e.disconnect(v.HANDSHAKE_FAILED.code,"Unknown line error",!0)}return _("Handshake failed, unknown error",n),e.disconnect(v.HANDSHAKE_FAILED.code,"Unknown error",!0)})}},{key:"onClose_",value:function(e){var n=this;if(_('Native "close" event received in "'+this.state+'" state (code: '+e.code+", reason: "+e.reason+")"),this.disconnectTimeout_&&clearTimeout(this.disconnectTimeout_),this.rejectAllDeferreds_(new O(t.ErrorCode.DISCONNECTED,"Client is disconnected")),this.unBindEvents_(),this.autoPing_.cancel(),this.id=null,this.ws_=null,_('Emitting "disconnected" event...'),this.state=t.State.DISCONNECTED,this.emit(t.Event.DISCONNECTED,e),this.options.reconnect&&!this.reconnectState_.disabled){var o=this.options.reconnectOptions.initialDelay*Math.max(this.options.reconnectOptions.multiply*this.reconnectState_.attempt,1);o=Math.min(o,this.options.reconnectOptions.maxDelay),o+=Math.round(Math.random()*this.options.reconnectOptions.randomness*o),_("Will try to reconnect in "+o+" ms"),this.reconnectState_.timeout&&clearTimeout(this.reconnectState_.timeout),this.reconnectState_.timeout=setTimeout(function(){n.reconnectState_.attempt++,n.connect()},o)}}},{key:"onError_",value:function(e){_('Native "error" event received in "'+this.state+'" state.');var n=t.Event.ERROR;this.state!=t.State.CONNECTING&&this.state!=t.State.HANDSHAKING||(n=t.Event.CONNECTING_ERROR),this.emit(n,new O(t.ErrorCode.WEBSOCKET_ERROR,"Native websocket error occured, check payload.",e))}},{key:"onMessage_",value:function(e){_('Native "message" event received in "'+this.state+'" state.');var n=void 0;this.state==t.State.CONNECTED&&this.autoPing_();try{n=a.parse(e.data)}catch(n){return _("Could not parse message",e.data),void this.emit(t.Event.ERROR,new O(t.ErrorCode.INVALID_JSON,"Could not parse incoming message, invalid json. Check payload for incoming data.",e.data))}n.name==a.Name.PING?this.onPingMessage_(n):n.name==a.Name.RESPONSE?this.onResponseMessage_(n):a.ReservedNames.indexOf(n.name)==-1?n.id?this.onMessageWithResponse_(n):this.onMessageWithoutResponse_(n):_("Could not route the message",n)}},{key:"onPingMessage_",value:function(e){_('Ping received, responding "pong"...'),this.sendWithoutResponse_(e.createResponse(null,"pong")).catch(function(e){return _("Ping response failed to send back, ignoring for now...",e)})}},{key:"onResponseMessage_",value:function(e){var n=this.deferreds_[e.id];return n?(_('Message response arrived: name="'+e.name+'" id="'+e.id+'"'),e.err?n.reject(new O(t.ErrorCode.MESSAGE_REJECTED,"Message is rejected by server, check payload.",e.err)):n.resolve(e.payload),void delete this.deferreds_[e.id]):_('Unknown message response, ignoring... (name="'+e.name+'" id="'+e.id+'")')}},{key:"onMessageWithoutResponse_",value:function(e){_('Message without response: name="'+e.name+'"'),this.emit(e.name,e)}},{key:"onMessageWithResponse_",value:function(e){var n=this;_('Message with response: name="'+e.name+'" id="'+e.id+'"'),e.once("resolved",function(o){_('Client resolving: name="'+e.name+'" id="'+e.id+'"'),n.sendWithoutResponse_(e.createResponse(null,o)).catch(function(o){n.emit(t.Event.ERROR,new O(t.ErrorCode.MESSAGE_NOT_RESPONDED,'Message (name="'+e.name+'" id="'+e.id+'") could not responded (resolve)',o))}).then(function(){return e.dispose()})}),e.once("rejected",function(o){_('Client rejecting: name="'+e.name+'" id="'+e.id+'"'),n.sendWithoutResponse_(e.createResponse(o)).catch(function(o){n.emit(t.Event.ERROR,new O(t.ErrorCode.MESSAGE_NOT_RESPONDED,'Message (name="'+e.name+'" id="'+e.id+'") could not responded (reject)',o))}).then(function(){return e.dispose()})}),this.emit(e.name,e)}},{key:"send",value:function(e,n,o){if(this.state!=t.State.CONNECTED)return Promise.reject(new O(t.ErrorCode.DISCONNECTED,"Could not send message, client is not connected."));try{var i=new a({name:e,payload:n});return this.send_(i,o)}catch(e){return Promise.reject(new O(t.ErrorCode.INVALID_JSON,'Could not send message, "payload" stringify error. Probably circular json issue.'))}}},{key:"sendWithoutResponse",value:function(e,n){if(this.state!=t.State.CONNECTED)return Promise.reject(new O(t.ErrorCode.DISCONNECTED,"Could not send message, client is not connected."));try{var o=new a({name:e,payload:n});return this.sendWithoutResponse_(o)}catch(e){return Promise.reject(new O(t.ErrorCode.INVALID_JSON,'Could not send message, "payload" stringify error. Probably circular json issue.'))}}},{key:"send_",value:function(e,n){var o=this,i=m(n)&&n>=0?n:this.options.responseTimeout;e.setId();var r=this.deferreds_[e.id]=new u({onExpire:function(){delete o.deferreds_[e.id]},timeout:i});return this.sendWithoutResponse_(e).then(function(){return r}).catch(function(e){if(r.dispose(),e instanceof O&&e.code==u.ErrorCode.EXPIRED)throw new O(t.ErrorCode.MESSAGE_TIMEOUT,"Message timeout! Its response did not recived after "+i+" ms");throw e})}},{key:"sendWithoutResponse_",value:function(e){var n=this;return this.ws_&&1==this.ws_.readyState?new Promise(function(o,i){var r=e.toString();try{_("Sending message: "+r),n.ws_.send(r),o()}catch(e){i(new O(t.ErrorCode.WEBSOCKET_ERROR,"Could not send message. Either socket is not connected or syntax error, check payload.",e))}}):Promise.reject(new O(t.ErrorCode.DISCONNECTED,"Could not send message, there is no open connection."))}},{key:"ping",value:function(){var e=this,n=this.ws_;return _("Pinging..."),this.send_(new a({name:a.Name.PING})).catch(function(o){if(e.ws_!=n)return void _("Auto-ping failed, but socket is also changed, dismissing...");throw _("Auto-ping failed, manually disconnecting..."),e.disconnect(v.PING_FAILED.code,"Auto ping failed",!0),new O(t.ErrorCode.PING_ERROR,"Ping failed, disconnecting...",o)})}},{key:"uptimeTick_",value:function(){_("Uptime Tick"),this.uptimeBuffer_.push(this.state==t.State.CONNECTED),this.uptimeBuffer_.length>this.uptimeBufferLength_&&this.uptimeBuffer_.splice(0,this.uptimeBufferLength_-this.uptimeBuffer_.length)}},{key:"getUptime",value:function(){if(this.options.uptime)return 0==this.uptimeBuffer_.length?0:this.uptimeBuffer_.filter(function(e){return e}).length/this.uptimeBuffer_.length}},{key:"dispose",value:function(){var e=this;switch(_("Disposing..."),this.state){case t.State.CONNECTING:case t.State.HANDSHAKING:case t.State.CONNECTED:this.once(t.Event.DISCONNECTED,function(){e.removeAllListeners(),e.uptimeBuffer_=[],e.uptimeInterval_&&clearInterval(e.uptimeInterval_),_("Disposed!")}),this.disconnect(v.DISPOSED.code,v.DISPOSED.reason);break;case t.State.READY:case t.State.DISCONNECTING:case t.State.DISCONNECTED:this.resetReconnectState_(),this.removeAllListeners(),this.uptimeBuffer_=[],this.uptimeInterval_&&clearInterval(this.uptimeInterval_),_("Disposed!")}}},{key:"rejectAllDeferreds_",value:function(e){d(this.deferreds_,function(t){return t.reject(e)}),this.deferreds_={}}},{key:"resetReconnectState_",value:function(){_("Resetting reconnection state..."),this.reconnectState_.timeout&&clearTimeout(this.reconnectState_.timeout),this.reconnectState_={disabled:!1,attempt:0,timeout:null}}}]),t}(c);C.Message=a,C.Error=O,C.ErrorCode={INVALID_OPTIONS:"cInvalidOptions",INVALID_JSON:"cInvalidJSON",HANDSHAKE_ERROR:"cHandshakeError",HANDSHAKE_REJECTED:"cHandshakeRejected",MESSAGE_TIMEOUT:"cMessageTimeout",MESSAGE_REJECTED:"cMessageRejected",MESSAGE_NOT_RESPONDED:"cMessageNotResponded",WEBSOCKET_ERROR:"cWebsocketError",DISCONNECT_TIMEOUT:"cDisconnectError",PING_ERROR:"cPingError",DISCONNECTED:"cDisconnected"},C.State={READY:"ready",CONNECTING:"connecting",HANDSHAKING:"handshaking",CONNECTED:"connected",DISCONNECTING:"disconnecting",DISCONNECTED:"disconnected"},C.Event={CONNECTING:"_connecting",CONNECTING_ERROR:"_connecting_error",CONNECTED:"_connected",DISCONNECTING:"_disconnecting",DISCONNECTED:"_disconnected",ERROR:"_error"},e.exports=C},function(e,t){e.exports=require("ws")},function(e,t){"use strict";e.exports={INTERNAL_ERROR:{code:4200,reason:"Internal error"},PING_FAILED:{code:4201,reason:"Ping failed"},HANDSHAKE_FAILED:{code:4202,reason:"Handshake failed"},HANDSHAKE_REJECTED:{code:4203,reason:"Handshake rejected"},DISCONNECT_TIMEOUT:{code:4204,reason:"Disconnect timeout"},DISPOSED:{code:4205,reason:"Client disposed"},UNKNOWN_ERROR:{code:4299,reason:"Unknown error"}}},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=n(0),s=function(){function e(){var t=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=n.handler,r=void 0===i?function(){}:i,s=n.onExpire,a=void 0===s?function(){}:s,c=n.timeout,u=void 0===c?0:c;o(this,e),this.resolve_=null,this.reject_=null,this.timeout_=null,this.timeoutDuration_=u,this.onExpire_=a,this.isFinished_=!1,this.promise=new Promise(function(e,n){t.resolve_=e,t.reject_=n;try{r(t)}catch(e){t.reject(e)}}),u>0&&(this.timeout_=setTimeout(this.expire.bind(this),u))}return i(e,[{key:"resolve",value:function(e){this.isFinished_||(this.isFinished_=!0,this.clearTimeout_(),this.resolve_(e))}},{key:"reject",value:function(e){this.isFinished_||(this.isFinished_=!0,this.clearTimeout_(),this.reject_(e))}},{key:"expire",value:function(){this.isFinished_=!0,this.clearTimeout_(),this.onExpire_(),this.reject_(new r(e.ErrorCode.EXPIRED,"Timeout "+this.timeoutDuration_+" ms exceed"))}},{key:"dispose",value:function(){this.isFinished_=!0,this.clearTimeout_()}},{key:"then",value:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return this.promise.then.apply(this.promise,t)}},{key:"catch",value:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return this.promise.catch.apply(this.promise,t)}},{key:"clearTimeout_",value:function(){this.timeout_&&(clearTimeout(this.timeout_),this.timeout_=null)}}]),e}();s.ErrorCode={EXPIRED:"dExpired"},e.exports=s},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(19),c=n(4),u=n(3),d=(n(16),n(20)),h=n(1),l=n(10),p=l.generateDummyId,E=n(2),f=n(0),m=function(e){function t(e){var n=e.name,r=e.payload,s=e.id,a=e.err;o(this,t);var c=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));try{JSON.stringify(r),JSON.stringify(a)}catch(e){throw new f(t.ErrorCode.INVALID_JSON,"Message payload or error must be json-friendly. Maybe circular json?")}return c.name=n,c.payload=r,c.id=s,c.err=a,c.isResponded_=!1,c}return r(t,e),s(t,null,[{key:"parse",value:function(e){try{var n=JSON.parse(e);return u(n.e)&&c(n.e.name)&&c(n.e.message)&&(n.e=h(new Error,n.e)),new t({name:n.n,payload:n.p,err:n.e,id:n.i})}catch(e){throw new f(t.ErrorCode.INVALID_JSON,"Could not parse incoming message.")}}}]),s(t,[{key:"setId",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p();return this.id=e,e}},{key:"createResponse",value:function(e,n){return new t({name:"_r",payload:n,err:e,id:this.id})}},{key:"resolve",value:function(e){if(a(this.id))throw new f(t.ErrorCode.MISSING_ID,"This message could not be resolved (no id)");if(this.isResponded_)throw new f(t.ErrorCode.ALREADY_RESPONDED,"This message has already responded");try{JSON.stringify(e)}catch(e){throw new f(t.ErrorCode.INVALID_JSON,"Message must be resolved with json-friendly payload. Maybe circular json?")}this.isResponded_=!0,this.emit("resolved",e)}},{key:"reject",value:function(e){if(a(this.id))throw new f(t.ErrorCode.MISSING_ID,"This message could not be rejected (no id)");if(this.isResponded_)throw new f(t.ErrorCode.ALREADY_RESPONDED,"This message has already responded");try{JSON.stringify(e)}catch(e){throw new f(t.ErrorCode.INVALID_JSON,"Message must be resolved with json-friendly payload. Maybe circular json?")}this.isResponded_=!0,this.emit("rejected",e)}},{key:"toString",value:function(){var e={n:this.name};return a(this.payload)||(e.p=this.payload),a(this.id)||(e.i=this.id),a(this.err)||(e.e=this.err instanceof Error?h({name:this.err.name,message:this.err.message},this.err):this.err),JSON.stringify(e)}},{key:"dispose",value:function(){var e=this,t=this.eventNames();t.forEach(function(t){return e.removeAllListeners(t)})}}]),t}(E);m.Name={RESPONSE:"_r",HANDSHAKE:"_h",PING:"_p"},m.ReservedNames=d(m.Name),m.ErrorCode={INVALID_JSON:"mInvalidJson",MISSING_ID:"mMissingId",ALREADY_RESPONDED:"mAlreadyResponded"},e.exports=m},function(e,t,n){"use strict";function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:4;return("0000"+(Math.random()*Math.pow(36,e)<<0).toString(36)).slice(-e)}n(1);e.exports={generateDummyId:o}},function(e,t){e.exports=require("debug")},function(e,t){e.exports=require("lodash/debounce")},function(e,t){e.exports=require("lodash/defaultsDeep")},function(e,t){e.exports=require("lodash/forEach")},function(e,t){e.exports=require("lodash/isBoolean")},function(e,t){e.exports=require("lodash/isFunction")},function(e,t){e.exports=require("lodash/isInteger")},function(e,t){e.exports=require("lodash/isNumber")},function(e,t){e.exports=require("lodash/isUndefined")},function(e,t){e.exports=require("lodash/values")},function(e,t,n){"use strict";global.WebSocket=n(6),e.exports=n(5)}]);
//# sourceMappingURL=client-node.js.map
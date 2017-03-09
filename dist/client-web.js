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
/******/ 	return __webpack_require__(__webpack_require__.s = 69);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(8),
    getRawTag = __webpack_require__(42),
    objectToString = __webpack_require__(48);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  value = Object(value);
  return (symToStringTag && symToStringTag in value)
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ },
/* 2 */
/***/ function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(12);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(5),
    isLength = __webpack_require__(17);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(1),
    isObject = __webpack_require__(0);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

var assign = __webpack_require__(54);

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
/* 7 */
/***/ function(module, exports) {

module.exports=function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,t,n){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=19)}([function(e,t,n){function r(e){return null==e?void 0===e?c:u:(e=Object(e),a&&a in e?o(e):s(e))}var i=n(7),o=n(12),s=n(14),u="[object Null]",c="[object Undefined]",a=i?i.toStringTag:void 0;e.exports=r},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t){var n=Array.isArray;e.exports=n},function(e,t,n){function r(e){if(!o(e))return!1;var t=i(e);return t==u||t==c||t==s||t==a}var i=n(0),o=n(16),s="[object AsyncFunction]",u="[object Function]",c="[object GeneratorFunction]",a="[object Proxy]";e.exports=r},function(e,t,n){function r(e){return"number"==typeof e||o(e)&&i(e)==s}var i=n(0),o=n(1),s="[object Number]";e.exports=r},function(e,t,n){var r=n(10),i=n(11),o=n(13),s=o&&o.isRegExp,u=s?i(s):r;e.exports=u},function(e,t,n){function r(e){return"string"==typeof e||!o(e)&&s(e)&&i(e)==u}var i=n(0),o=n(2),s=n(1),u="[object String]";e.exports=r},function(e,t,n){var r=n(15),i=r.Symbol;e.exports=i},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(t,n(17))},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(6),s=n(5),u=n(3),c=n(4),a=function(){function e(t,n){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;if(r(this,e),o(t))this.eventName=t;else{if(!s(t))throw new Error("Event name to be listened should be string or regex");this.eventNameRegex=t}if(!u(n))throw new Error("Handler should be a function");if(!c(i)||parseInt(i,10)!=i)throw new Error("Execute limit should be integer");this.handler=n,this.execCount=0,this.execLimit=i}return i(e,[{key:"execute",value:function(e,t){var n=this.handler.apply(e,t);return this.execCount++,this.execLimit&&this.execCount>=this.execLimit&&this.onExpire(this),n}},{key:"testRegexWith",value:function(e){var t=this.eventNameRegex;return t.test(e)}},{key:"onExpire",value:function(){}}]),e}();e.exports=a},function(e,t,n){function r(e){return o(e)&&i(e)==s}var i=n(0),o=n(1),s="[object RegExp]";e.exports=r},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){function r(e){var t=s.call(e,c),n=e[c];try{e[c]=void 0;var r=!0}catch(e){}var i=u.call(e);return r&&(t?e[c]=n:delete e[c]),i}var i=n(7),o=Object.prototype,s=o.hasOwnProperty,u=o.toString,c=i?i.toStringTag:void 0;e.exports=r},function(e,t,n){(function(e){var r=n(8),i="object"==typeof t&&t&&!t.nodeType&&t,o=i&&"object"==typeof e&&e&&!e.nodeType&&e,s=o&&o.exports===i,u=s&&r.process,c=function(){try{return u&&u.binding("util")}catch(e){}}();e.exports=c}).call(t,n(18)(e))},function(e,t){function n(e){return i.call(e)}var r=Object.prototype,i=r.toString;e.exports=n},function(e,t,n){var r=n(8),i="object"==typeof self&&self&&self.Object===Object&&self,o=r||i||Function("return this")();e.exports=o},function(e,t){function n(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,configurable:!1,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,configurable:!1,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){return"object"===("undefined"==typeof e?"undefined":s(e))&&"object"===("undefined"==typeof t?"undefined":s(t))&&e.toString()===t.toString()}function o(e,t){var n=[];return a(t)?n=e.filter(t):e.indexOf(t)>-1&&n.push(t),n.forEach(function(t){var n=e.indexOf(t);e.splice(n,1)}),n}var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(2),a=n(3),f=n(4),l=n(5),v=n(6),h=n(9),p=function(){function e(){r(this,e),this.maxListeners_=e.defaultMaxListeners,this.maxRegexListeners_=e.defaultMaxRegexListeners,this.listeners_=[],this.regexListeners_=[],this.eventListeners_={}}return u(e,[{key:"addListener",value:function(e,t,n,r){var i=this;if(c(e)||c(t)){var o=function(){var r=c(e)?e:[e],o=c(t)?t:[t];return r.forEach(function(e){o.forEach(function(t){i.addListener(e,t,n)})}),{v:i}}();if("object"===("undefined"==typeof o?"undefined":s(o)))return o.v}var u=new h(e,t,n);if(u.eventName){if(this.eventListeners_[u.eventName]||(this.eventListeners_[u.eventName]=[]),this.eventListeners_[u.eventName].length>=this.maxListeners_)throw new Error("Max listener count reached for event: "+e);this.emit("newListener",e,t),r?this.eventListeners_[u.eventName].unshift(u):this.eventListeners_[u.eventName].push(u)}else if(u.eventNameRegex){if(this.regexListeners_.length>=this.maxRegexListeners_)throw new Error("Max regex listener count reached");this.emit("newListener",e,t),r?this.regexListeners_.unshift(u):this.regexListeners_.push(u)}return u.onExpire=this.removeListener_.bind(this),this.listeners_.push(u),this}},{key:"prependListener",value:function(e,t,n){return this.addListener(e,t,n,!0)}},{key:"prependOnceListener",value:function(e,t){return this.addListener(e,t,1,!0)}},{key:"prependManyListener",value:function(e,t,n){return this.addListener(e,n,t,!0)}},{key:"removeListener_",value:function(e){o(this.listeners_,e),e.eventName&&c(this.eventListeners_[e.eventName])?(o(this.eventListeners_[e.eventName],e),0==this.eventListeners_[e.eventName].length&&delete this.eventListeners_[e.eventName]):e.eventNameRegex&&o(this.regexListeners_,e),this.emit("removeListener",e.eventName||e.eventNameRegex,e.handler)}},{key:"removeAllListeners",value:function(e){var t=this;if(c(e))e.forEach(function(e){return t.removeAllListeners(e)});else if(v(e)&&c(this.eventListeners_[e])){var n=this.eventListeners_[e].slice();n.forEach(function(e){t.removeListener_(e)})}else l(e)?!function(){var n=e,r=t.regexListeners_.filter(function(e){return i(e.eventNameRegex,n)});r.forEach(function(e){return t.removeListener_(e)})}():void 0==e&&(this.removeAllListeners(this.eventNames()),this.removeAllListeners(this.regexes()));return this}},{key:"removeListener",value:function(e,t){var n=this;if(c(e)||c(t))!function(){var r=c(e)?e:[e],i=c(t)?t:[t];r.forEach(function(e){i.forEach(function(t){n.removeListener(e,t)})})}();else if(v(e)&&c(this.eventListeners_[e])){var r=this.eventListeners_[e].filter(function(e){return e.handler==t});r.forEach(function(e){return n.removeListener_(e)})}else{if(!l(e))throw new Error("Event name should be string or regex.");!function(){var r=e,o=n.regexListeners_.filter(function(e){return i(e.eventNameRegex,r)&&e.handler==t});o.forEach(function(e){return n.removeListener_(e)})}()}return this}},{key:"eventNames",value:function(){return Object.keys(this.eventListeners_)}},{key:"regexes",value:function(){return this.regexListeners_.map(function(e){return e.eventNameRegex})}},{key:"getMaxListeners",value:function(){return this.maxListeners_}},{key:"setMaxListeners",value:function(e){if(!f(e)||parseInt(e,10)!=e)throw new Error("n must be integer");return this.maxListeners_=e,this}},{key:"getMaxRegexListeners",value:function(){return this.maxRegexListeners_}},{key:"setMaxRegexListeners",value:function(e){if(!f(e)||parseInt(e,10)!=e)throw new Error("n must be integer");return this.maxRegexListeners_=e,this}},{key:"listenerCount",value:function(e){if(v(e))return this.eventListeners_[e]?this.eventListeners_[e].length:0;if(l(e))return this.regexListeners_.filter(function(t){return i(e,t.eventNameRegex)}).length;throw new Error("Event name should be string or regex.")}},{key:"listeners",value:function(e){if(v(e))return this.eventListeners_[e]?this.eventListeners_[e].map(function(e){return e.handler}):[];if(l(e))return this.regexListeners_.filter(function(t){return i(e,t.eventNameRegex)}).map(function(e){return e.handler});throw new Error("Event name should be string or regex.")}},{key:"on",value:function(e,t){return this.addListener(e,t)}},{key:"once",value:function(e,t){return this.addListener(e,t,1)}},{key:"many",value:function(e,t,n){return this.addListener(e,n,t)}},{key:"emit",value:function(e){for(var t=this,n=arguments.length,r=Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];if(c(e)){var o=function(){var n=[];return e.forEach(function(e){var i=t.emit.apply(t,[e].concat(r));n=n.concat(i)}),{v:n}}();if("object"===("undefined"==typeof o?"undefined":s(o)))return o.v}else if(!v(e))throw new Error("Event name should be string");var u=[],a={name:e};if(this.eventListeners_[e]){var f=this.eventListeners_[e].slice().map(function(e){return e.execute(Object.assign({},e,{event:a}),r)});u=u.concat(f)}var l=this.regexListeners_.filter(function(t){return t.testRegexWith(e)}).map(function(e){return e.execute(Object.assign({},e,{event:a}),r)});return u=u.concat(l),u.length>0&&u}},{key:"emitAsync",value:function(){var e=this.emit.apply(this,arguments);return e?Promise.all(e):Promise.reject(new Error("No listener"))}}]),e}();p.defaultMaxListeners=10,p.defaultMaxRegexListeners=10,p.Listener=h,e.exports=p}]);
//# sourceMappingURL=commonjs.modern.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

var root = __webpack_require__(3);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(10),
    eq = __webpack_require__(15);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(11);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(41);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(68)))

/***/ },
/* 13 */
/***/ function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ },
/* 14 */
/***/ function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ },
/* 15 */
/***/ function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ },
/* 16 */
/***/ function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ },
/* 17 */
/***/ function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(27),
    baseKeys = __webpack_require__(32),
    isArrayLike = __webpack_require__(4);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			configurable: false,
			get: function() { return module.l; }
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			configurable: false,
			get: function() { return module.i; }
		});
		module.webpackPolyfill = 1;
	}
	return module;
}


/***/ },
/* 20 */
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isUndefined = __webpack_require__(61);
var isObject = __webpack_require__(0);
var isFunction = __webpack_require__(5);
var values = __webpack_require__(65);

var _require = __webpack_require__(6),
    generateDummyId = _require.generateDummyId;

var EventEmitterExtra = __webpack_require__(7);

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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(25);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document && 'WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window && window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  try {
    return exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (typeof process !== 'undefined' && 'env' in process) {
    return process.env.DEBUG;
  }
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(67)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(0),
    now = __webpack_require__(62),
    toNumber = __webpack_require__(64);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(1),
    isObjectLike = __webpack_require__(2);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]';

/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
 * @example
 *
 * _.isBoolean(false);
 * // => true
 *
 * _.isBoolean(null);
 * // => false
 */
function isBoolean(value) {
  return value === true || value === false ||
    (isObjectLike(value) && baseGetTag(value) == boolTag);
}

module.exports = isBoolean;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(66);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ },
/* 26 */
/***/ function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(35),
    isArguments = __webpack_require__(56),
    isArray = __webpack_require__(57),
    isBuffer = __webpack_require__(58),
    isIndex = __webpack_require__(13),
    isTypedArray = __webpack_require__(60);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ },
/* 28 */
/***/ function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(1),
    isObjectLike = __webpack_require__(2);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(5),
    isMasked = __webpack_require__(45),
    isObject = __webpack_require__(0),
    toSource = __webpack_require__(53);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(1),
    isLength = __webpack_require__(17),
    isObjectLike = __webpack_require__(2);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(14),
    nativeKeys = __webpack_require__(46);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

var identity = __webpack_require__(16),
    overRest = __webpack_require__(50),
    setToString = __webpack_require__(51);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

var constant = __webpack_require__(55),
    defineProperty = __webpack_require__(11),
    identity = __webpack_require__(16);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ },
/* 35 */
/***/ function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ },
/* 36 */
/***/ function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(28);

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(9),
    baseAssignValue = __webpack_require__(10);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

var root = __webpack_require__(3);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(33),
    isIterateeCall = __webpack_require__(44);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(30),
    getValue = __webpack_require__(43);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(8);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ },
/* 43 */
/***/ function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

var eq = __webpack_require__(15),
    isArrayLike = __webpack_require__(4),
    isIndex = __webpack_require__(13),
    isObject = __webpack_require__(0);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(39);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(49);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(12);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)(module)))

/***/ },
/* 48 */
/***/ function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ },
/* 49 */
/***/ function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

var apply = __webpack_require__(26);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(34),
    shortOut = __webpack_require__(52);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ },
/* 52 */
/***/ function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ },
/* 53 */
/***/ function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(9),
    copyObject = __webpack_require__(38),
    createAssigner = __webpack_require__(40),
    isArrayLike = __webpack_require__(4),
    isPrototype = __webpack_require__(14),
    keys = __webpack_require__(18);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;


/***/ },
/* 55 */
/***/ function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(29),
    isObjectLike = __webpack_require__(2);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ },
/* 57 */
/***/ function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(3),
    stubFalse = __webpack_require__(63);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)(module)))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(1),
    isObjectLike = __webpack_require__(2);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(31),
    baseUnary = __webpack_require__(36),
    nodeUtil = __webpack_require__(47);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ },
/* 61 */
/***/ function(module, exports) {

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

var root = __webpack_require__(3);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ },
/* 63 */
/***/ function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(0),
    isSymbol = __webpack_require__(59);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

var baseValues = __webpack_require__(37),
    keys = __webpack_require__(18);

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;


/***/ },
/* 66 */
/***/ function(module, exports) {

/**
 * Helpers.
 */

var s = 1000
var m = s * 60
var h = m * 60
var d = h * 24
var y = d * 365.25

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {}
  var type = typeof val
  if (type === 'string' && val.length > 0) {
    return parse(val)
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ?
			fmtLong(val) :
			fmtShort(val)
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
}

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str)
  if (str.length > 10000) {
    return
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
  if (!match) {
    return
  }
  var n = parseFloat(match[1])
  var type = (match[2] || 'ms').toLowerCase()
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y
    case 'days':
    case 'day':
    case 'd':
      return n * d
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n
    default:
      return undefined
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd'
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h'
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm'
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's'
  }
  return ms + 'ms'
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms'
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name
  }
  return Math.ceil(ms / n) + ' ' + name + 's'
}


/***/ },
/* 67 */
/***/ function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 68 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = __webpack_require__(21);
var Utils = __webpack_require__(6);
var EventEmitterExtra = __webpack_require__(7);
var Deferred = __webpack_require__(20);
var debounce = __webpack_require__(23);
var isObject = __webpack_require__(0);
var isBoolean = __webpack_require__(24);
var debug = __webpack_require__(22)('line:client-web');

/**
 * Line client class.
 *
 * @class Client
 * @extends {EventEmitterExtra}
 * @param {string=} url Server url, default: `ws://localhost`.
 * @param {Object=} options Options object.
 * @param {boolean=} options.reconnect Try to reconnect server after unexpected disconnection, default `true`.
 * @param {boolean=} options.keepUptime Keeps uptime, default `false`.
 * @param {any=} options.handshakePayload Handshake payload to be sent to server.
 * @property {string} url Server url
 * @property {string} id Unique connection id assigned by the server
 * @property {Client.States} state Connection state
 * @example
 * // Add line-client to your html document
 * <script src="./node_modules/line-socket/dist/client-web-globals.js"></script>
 *
 * // For web browsers (consuming as a commonjs module)
 * const LineClient = require('line-socket/client-web');
 *
 * // For node.js
 * const LineClient = require('line-socket/client-node');
 *
 *
 * const client = new LineClient('ws://localhost:8080', {
 *   reconnect: false,
 *   handshakePayload: { token: 'a6g3X' }
 * });
 */

var Client = function (_EventEmitterExtra) {
    _inherits(Client, _EventEmitterExtra);

    function Client() {
        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ws://localhost';
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this));

        _this.url = url;

        _this.options = options;

        _this.ws_ = null;
        _this.id = null;
        _this.reconnect = isBoolean(options.reconnect) ? options.reconnect : true;
        _this.reconnectDisabled_ = false;

        _this.serverTimeout_ = 30000;
        _this.maxReconnectDelay = 60;
        _this.initialReconnectDelay = 1;
        _this.reconnectIncrementFactor = 2;
        _this.pingInterval = 60000;

        _this.deferreds_ = {};
        _this.connectDeferred_ = null;
        _this.connectError_ = null;
        _this.disconnectDeferred_ = null;

        _this.state = Client.States.READY;

        _this.uptimeInterval_ = 5000;
        _this.uptimeBuffer_ = [];
        _this.uptimeBufferLength_ = 5 * 60000 / _this.uptimeInterval_;
        _this.uptimeCheck_ = options.keepUptime ? setInterval(_this.uptimeTick_.bind(_this), _this.uptimeInterval_) : null;

        _this.autoPing_ = _this.pingInterval > 0 ? debounce(function () {
            if (_this.state != Client.States.CONNECTED) return;

            _this.ping().then(function () {
                if (_this.pingInterval > 0 && _this.state == Client.States.CONNECTED) {
                    _this.autoPing_();
                }
            }).catch(function () {});
        }, _this.pingInterval) : function () {};
        return _this;
    }

    /**
     * Connects to server.
     * @returns {Promise}
     * @example
     * client
     *   .connect()
     *   .then((handshakeResponse) => {
     *     // handshakeResponse will be undefined if you do not resolve
     *     // the handshake with a payload in server
     *     console.log('Connected');
     *   })
     *   .catch((err) => {
     *     console.log('Could not connect');
     *   })
     */


    _createClass(Client, [{
        key: 'connect',
        value: function connect() {
            var _this2 = this;

            switch (this.state) {
                case Client.States.CONNECTING:
                    return Promise.reject(new Error('Could not connect, already trying to connect to a host...'));
                case Client.States.CONNECTED:
                    return Promise.reject(new Error('Already connected.'));
                case Client.States.CLOSING:
                    return Promise.reject(new Error('Terminating an active connecting, try again later.'));
                case Client.States.CLOSED:
                case Client.States.READY:
                    this.connectError_ = null;
                    this.connectDeferred_ = new Deferred({
                        handler: function handler() {
                            _this2.state = Client.States.CONNECTING;
                            _this2.emit(Client.Events.CONNECTING);
                            _this2.reconnectDisabled_ = false;

                            setTimeout(function (_) {
                                debug('Connecting to "' + _this2.url + '" ...');
                                _this2.ws_ = new WebSocket(_this2.url);
                                _this2.bindEvents_();
                            }, 0);
                        }
                    });

                    return this.connectDeferred_;
                default:
                    return Promise.reject(new Error('Could not connect, unknown state.'));
            }
        }

        /**
         * Gracefully closes the connection
         *
         * @param {number=} code
         * @param {any=} reason
         * @param {boolean=} opt_retry
         * @returns {Promise}
         * @example
         * client
         *   .disconnect()
         *   .then(() => {
         *     // Client will not try to reconnect
         *     console.log('Disconnected');
         *   })
         *   .catch((err) => {
         *     console.log('Could not disconnect');
         *   })
         */

    }, {
        key: 'disconnect',
        value: function disconnect(code, reason, opt_retry) {
            switch (this.state) {
                case Client.States.ERROR:
                case Client.States.CONNECTED:
                case Client.States.CONNECTING:
                    debug('Disconnecting...');
                    this.ws_.close(code || 1000, reason);
                    debug('Websocket closed!');
                    this.reconnectDisabled_ = !opt_retry;
                    this.disconnectDeferred_ = new Deferred();
                    this.state = Client.States.CLOSING;
                    return this.disconnectDeferred_;
                case Client.States.CLOSED:
                    return Promise.reject(new Error('There is no connection to disconnect.'));
                case Client.States.CLOSING:
                    return Promise.reject(new Error('Already terminating a connecting, try again later.'));
            }
        }
    }, {
        key: 'bindEvents_',
        value: function bindEvents_() {
            debug('Binding native event handlers.');
            this.ws_.onopen = this.onOpen.bind(this);
            this.ws_.onclose = this.onClose.bind(this);
            this.ws_.onerror = this.onError.bind(this);
            this.ws_.onmessage = this.onMessage.bind(this);
        }
    }, {
        key: 'unBindEvents_',
        value: function unBindEvents_() {
            if (!this.ws_) return;
            debug('Unbinding native event handlers.');
            this.ws_.onopen = function () {};
            this.ws_.onclose = function () {};
            this.ws_.onerror = function () {};
            this.ws_.onmessage = function () {};
        }
    }, {
        key: 'disposeConnectionPromisses_',
        value: function disposeConnectionPromisses_() {
            debug('Disposing connection promisses...');
            if (this.connectDeferred_) {
                debug('Rejecting connect promise...');
                this.connectDeferred_.reject(this.connectError_);
                this.connectDeferred_ = null;
                this.connectError_ = null;
            }

            if (this.disconnectDeferred_) {
                debug('Rejecting disconnect promise...');
                this.disconnectDeferred_.reject();
                this.disconnectDeferred_ = null;
            }
        }
    }, {
        key: 'onOpen',
        value: function onOpen() {
            var _this3 = this;

            debug('Native "open" event received.');
            debug('State=' + this.state);
            debug('Sending handshake data...');
            this.send(Message.Names.HANDSHAKE, this.options.handshakePayload).then(function (data) {
                debug('Handshake successful.');
                _this3.id = data.id;
                _this3.serverTimeout_ = data.timeout;
                _this3.maxReconnectDelay = data.maxReconnectDelay;
                _this3.initialReconnectDelay = data.initialReconnectDelay;
                _this3.reconnectIncrementFactor = data.reconnectIncrementFactor;
                _this3.pingInterval = data.pingInterval;

                if (_this3.connectDeferred_) {
                    debug('Resolving connect promise...');
                    _this3.connectDeferred_.resolve(data.handshakePayload);
                    _this3.connectDeferred_ = null;
                    _this3.connectError_ = null;
                }

                _this3.state = Client.States.CONNECTED;
                debug('Emitting "connected" event...');
                _this3.emit(Client.Events.CONNECTED, data.handshakePayload);
            }).catch(function (err) {
                debug('Handshake failed.');
                _this3.connectError_ = err;
                debug('Emitting "error" event...');
                _this3.emit(Client.Events.ERROR, err);
                return _this3.disconnect();
            }).catch(function (err) {
                debug('Could not disconnect after handshake failure.');
                console.log('Could not disconnect after failed handshake', err);
            });
        }
    }, {
        key: 'onClose',
        value: function onClose(err) {
            var _this4 = this;

            debug('Native "close" event reveived.');
            debug('State=' + this.state);
            this.unBindEvents_();
            this.id = null;
            this.ws_ = null;

            debug('Emitting "closed" event...');
            this.emit(Client.Events.CLOSED, err);

            switch (this.state) {
                case Client.States.CLOSING:
                    this.state = Client.States.CLOSED;

                    if (this.disconnectDeferred_) {
                        debug('Resolving disconnect promise...');
                        this.disconnectDeferred_.resolve();
                        this.disconnectDeferred_ = null;
                    }

                    if (this.connectDeferred_) {
                        debug('Rejecting connect promise...');
                        this.connectDeferred_.reject(this.connectError_ || new Error('Connection closed while connecting...'));
                        this.connectDeferred_ = null;
                        this.connectError_ = null;
                    }

                    if (!this.reconnect || this.retrying_ || this.reconnectDisabled_) return;

                    break;
                case Client.States.CONNECTING:
                    this.state = Client.States.CLOSED;

                    if (this.disconnectDeferred_) {
                        debug('Rejecting disconnect promise...');
                        this.disconnectDeferred_.reject(new Error('Already disconnected'));
                        this.disconnectDeferred_ = null;
                    }

                    if (!this.reconnect || this.retrying_ || this.reconnectDisabled_) {
                        if (this.connectDeferred_) {
                            debug('Rejecting connect promise...');
                            this.connectDeferred_.reject(this.connectError_);
                            this.connectDeferred_ = null;
                            this.connectError_ = null;
                        }
                        return;
                    }

                    break;
                default:
                    this.state = Client.States.CLOSED;

                    if (this.disconnectDeferred_) {
                        debug('Rejecting disconnect promise...');
                        this.disconnectDeferred_.reject(new Error('Already disconnected'));
                        this.disconnectDeferred_ = null;
                    }

                    if (this.connectDeferred_) {
                        debug('Rejecting connect promise...');
                        this.connectDeferred_.reject(new Error('Already connected'));
                        this.connectDeferred_ = null;
                        this.connectError_ = null;
                    }

                    if (!this.reconnect || this.retrying_ || this.reconnectDisabled_) return;
            }
            debug('Retrying to connect...');
            this.retrying_ = true;
            Utils.retry(function (_) {
                return _this4.connect();
            }, {
                maxCount: this.maxReconnectDelay,
                initialDelay: this.initialReconnectDelay,
                increaseFactor: this.reconnectIncrementFactor
            }).then(function (_) {
                debug('Retry successful.');
                _this4.retrying_ = false;
            });
        }
    }, {
        key: 'onError',
        value: function onError(err) {
            debug('Native "error" event reveived.');
            debug('State=' + this.state);

            var eventName = this.state == Client.States.CONNECTING ? Client.Events.CONNECTING_ERROR : Client.Events.ERROR;

            this.emit(eventName, err || new Error('Unknown error'));
        }
    }, {
        key: 'onMessage',
        value: function onMessage(e) {
            var _this5 = this;

            debug('Native "message" event reveived.');

            var message = Message.parse(e.data);
            this.autoPing_();

            // Message without response (no id fields)
            if (!message.id && Message.ReservedNames.indexOf(message.name) == -1) {
                debug('Message without response: name="' + message.name + '"');
                return this.emit(message.name, message);
            }

            // Ping
            if (message.name == Message.Names.PING) {
                return this.onPing_(message);
            }

            // Message response
            if (message.name == Message.Names.RESPONSE && this.deferreds_[message.id]) {
                var deferred = this.deferreds_[message.id];
                debug('Message response: name="' + message.name + '" id="' + message.id + '"');
                if (message.err) {
                    var err = Object.assign(new Error(), message.err);
                    deferred.reject(err);
                } else {
                    deferred.resolve(message.payload);
                }

                delete this.deferreds_[message.id];
                return;
            }

            debug('Message with response: name="' + message.name + '" id="' + message.id + '"');
            // Message with response
            message.once('resolved', function (payload) {
                debug('Client resolving: name="' + message.name + '" id="' + message.id + '"');
                _this5.send_(message.createResponse(null, payload));
                message.dispose();
            });

            message.once('rejected', function (err) {
                if (isObject(err) && err instanceof Error && err.name == 'Error') err = { message: err.message, name: 'Error' };
                debug('Client rejecting: name="' + message.name + '" id="' + message.id + '"');
                _this5.send_(message.createResponse(err));
                message.dispose();
            });

            this.emit(message.name, message);
        }
    }, {
        key: 'onPing_',
        value: function onPing_(message) {
            debug('Ping received');
            this.send_(message.createResponse(null, 'pong')).catch(function (err) {
                console.log('Ping responce failed to send', err);
            });
        }

        /**
         * Sends a message to server with awaiting its response.
         *
         * @param {string} eventName
         * @param {any=} payload
         * @returns {Promise}
         * @example
         * client
         *   .send('hello', {some: data})
         *   .then((response) => {
         *     console.log('Sent and got the response');
         *   })
         *   .catch((err) => {
         *     console.log('Could not send message OR server rejected the message');
         *   });
         */

    }, {
        key: 'send',
        value: function send(eventName, payload) {
            var _this6 = this;

            var message = new Message({ name: eventName, payload: payload });
            message.setId();

            return this.send_(message).then(function (_) {
                var deferred = _this6.deferreds_[message.id] = new Deferred({
                    onExpire: function onExpire() {
                        delete _this6.deferreds_[message.id];
                    },
                    timeout: _this6.serverTimeout_
                });

                return deferred;
            });
        }

        /**
         * Sends a message to server without waiting its response.
         *
         * @param {string} eventName
         * @param {any=} payload
         * @returns {Promise}
         * @example
         * client
         *   .sendWithoutResponse('hello', {some: data})
         *   .then(() => {
         *     console.log('Message is sent');
         *   })
         *   .catch((err) => {
         *     console.log('Could not send message');
         *   });
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
            var _this7 = this;

            return new Promise(function (resolve) {
                debug('Sending message: ' + message.toString());
                _this7.ws_.send(message.toString());
                resolve();
            });
        }

        /**
         * Sends a ping message to server, if its failed, the connection will be closed.
         * Server and client ping each other automatically with an interval specified by the server.
         *
         * @returns {Promise}
         */

    }, {
        key: 'ping',
        value: function ping() {
            var _this8 = this;

            debug('Pinging...');
            return this.send(Message.Names.PING).catch(function (err) {
                debug('Auto-ping failed, manually disconnecting...');
                _this8.disconnect(4500, 'Auto ping failed', true);
                throw err;
            });
        }
    }, {
        key: 'uptimeTick_',
        value: function uptimeTick_() {
            debug('•Uptime Tick•');
            this.uptimeBuffer_.push(this.state == Client.States.CONNECTED);

            if (this.uptimeBuffer_.length > this.uptimeBufferLength_) {
                this.uptimeBuffer_.splice(0, this.uptimeBufferLength_ - this.uptimeBuffer_.length);
            }
        }

        /**
         * Calculates (connection) uptime for last 5 minutes with 5 seconds interval.
         * Returns a number between 0 and 1. If `options.keepUptime` is false, this method
         * returns null.
         * @returns {number?}
         */

    }, {
        key: 'getUptime',
        value: function getUptime() {
            if (!this.options.keepUptime) return null;
            if (this.uptimeBuffer_.length == 0) return 0;
            return this.uptimeBuffer_.filter(function (val) {
                return val;
            }).length / this.uptimeBuffer_.length;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            debug('Disposing...');
            this.removeAllListeners();
            // TODO: Maybe reject all deferreds?
            this.uptimeBuffer_ = [];
            if (this.uptimeCheck_) clearInterval(this.uptimeCheck_);
        }
    }]);

    return Client;
}(EventEmitterExtra);

/**
 * @static
 * @readonly
 * @enum {number}
 */


Client.States = {
    /**
     * `-1`
     */
    READY: -1,
    /**
     * `0`
     */
    CONNECTING: 0,
    /**
     * `1`
     */
    CONNECTED: 1,
    /**
     * `2`
     */
    CLOSING: 2,
    /**
     * `3`
     */
    CLOSED: 3
};

/**
 * @static
 * @readonly
 * @enum {string}
 */
Client.Events = {
    /**
     * `_connecting`
     */
    CONNECTING: '_connecting',
    /**
     * `_connecting_error`
     */
    CONNECTING_ERROR: '_connecting_error',
    /**
     * `_connected`
     */
    CONNECTED: '_connected',
    /**
     * `_closed`
     */
    CLOSED: '_closed',
    /**
     * `_error`
     */
    ERROR: '_error'
};

module.exports = Client;

/***/ }
/******/ ]);
//# sourceMappingURL=client-web.js.map
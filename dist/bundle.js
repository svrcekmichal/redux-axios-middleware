(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReduxAxiosMiddleware"] = factory();
	else
		root["ReduxAxiosMiddleware"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SUCCESS_SUFFIX = exports.SUCCESS_SUFFIX = '_SUCCESS';
var ERROR_SUFFIX = exports.ERROR_SUFFIX = '_FAIL';

var getActionTypes = exports.getActionTypes = function getActionTypes(action) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$errorSuffix = _ref.errorSuffix,
      errorSuffix = _ref$errorSuffix === undefined ? ERROR_SUFFIX : _ref$errorSuffix,
      _ref$successSuffix = _ref.successSuffix,
      successSuffix = _ref$successSuffix === undefined ? SUCCESS_SUFFIX : _ref$successSuffix;

  var types = void 0;
  if (typeof action.type !== 'undefined') {
    var type = action.type;

    types = [type, '' + type + successSuffix, '' + type + errorSuffix];
  } else if (typeof action.types !== 'undefined') {
    types = action.types;
  } else {
    throw new Error('Action which matched axios middleware needs to have "type" or "types" key which is not null');
  }
  return types;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multiClientMiddleware = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defaults = __webpack_require__(2);

var defaultOptions = _interopRequireWildcard(_defaults);

var _getActionTypes3 = __webpack_require__(0);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function addInterceptor(target, candidate, injectedParameters) {
  if (!candidate) return;
  var successInterceptor = typeof candidate === 'function' ? candidate : candidate.success;
  var errorInterceptor = candidate && candidate.error;
  target.use(successInterceptor && successInterceptor.bind(null, injectedParameters), errorInterceptor && errorInterceptor.bind(null, injectedParameters));
}

function bindInterceptors(client, injectedParameters) {
  var middlewareInterceptors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var clientInterceptors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  [].concat(_toConsumableArray(middlewareInterceptors.request || []), _toConsumableArray(clientInterceptors.request || [])).forEach(function (interceptor) {
    addInterceptor(client.interceptors.request, interceptor, injectedParameters);
  });
  [].concat(_toConsumableArray(middlewareInterceptors.response || []), _toConsumableArray(clientInterceptors.response || [])).forEach(function (interceptor) {
    addInterceptor(client.interceptors.response, interceptor, injectedParameters);
  });
}

function getSourceAction(config) {
  return config.reduxSourceAction;
}

var multiClientMiddleware = exports.multiClientMiddleware = function multiClientMiddleware(clients, customMiddlewareOptions) {
  var middlewareOptions = _extends({}, defaultOptions, customMiddlewareOptions);
  var setupedClients = {};

  return function (_ref) {
    var getState = _ref.getState,
        dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        if (!middlewareOptions.isAxiosRequest(action)) {
          return next(action);
        }

        var clientName = middlewareOptions.getClientName(action) || middlewareOptions.defaultClientName;

        if (!clients[clientName]) {
          throw new Error('Client with name "' + clientName + '" has not been defined in middleware');
        }

        if (!setupedClients[clientName]) {
          var clientOptions = _extends({}, middlewareOptions, clients[clientName].options);

          if (clientOptions.interceptors) {
            var middlewareInterceptors = middlewareOptions.interceptors;
            var clientInterceptors = clients[clientName].options && clients[clientName].options.interceptors;
            var injectToInterceptor = { getState: getState, dispatch: dispatch, getSourceAction: getSourceAction };
            bindInterceptors(clients[clientName].client, injectToInterceptor, middlewareInterceptors, clientInterceptors);
          }

          setupedClients[clientName] = {
            client: clients[clientName].client,
            options: clientOptions
          };
        }

        var setupedClient = setupedClients[clientName];
        var actionOptions = _extends({}, setupedClient.options, setupedClient.options.getRequestOptions(action));

        var _getActionTypes = (0, _getActionTypes3.getActionTypes)(action, actionOptions),
            _getActionTypes2 = _slicedToArray(_getActionTypes, 1),
            REQUEST = _getActionTypes2[0];

        next(_extends({}, action, { type: REQUEST }));

        var requestConfig = _extends({}, actionOptions.getRequestConfig(action), {
          reduxSourceAction: action
        });
        return setupedClient.client.request(requestConfig).then(function (response) {
          var newAction = actionOptions.onSuccess({ action: action, next: next, response: response, getState: getState, dispatch: dispatch }, actionOptions);
          actionOptions.onComplete({ action: newAction, next: next, getState: getState, dispatch: dispatch }, actionOptions);
          return newAction;
        }, function (error) {
          var newAction = actionOptions.onError({ action: action, next: next, error: error, getState: getState, dispatch: dispatch }, actionOptions);
          actionOptions.onComplete({ action: newAction, next: next, getState: getState, dispatch: dispatch }, actionOptions);
          return actionOptions.returnRejectedPromiseOnError ? Promise.reject(newAction) : newAction;
        });
      };
    };
  };
};

exports.default = function (client, customMiddlewareOptions, customClientOptions) {
  var middlewareOptions = _extends({}, defaultOptions, customMiddlewareOptions);
  var options = customClientOptions || {};
  return multiClientMiddleware(_defineProperty({}, middlewareOptions.defaultClientName, { client: client, options: options }), middlewareOptions);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onComplete = exports.onError = exports.onSuccess = exports.getRequestOptions = exports.getClientName = exports.getRequestConfig = exports.isAxiosRequest = exports.defaultClientName = exports.returnRejectedPromiseOnError = undefined;

var _getActionTypes = __webpack_require__(0);

var returnRejectedPromiseOnError = exports.returnRejectedPromiseOnError = false;

var defaultClientName = exports.defaultClientName = 'default';

var isAxiosRequest = exports.isAxiosRequest = function isAxiosRequest(action) {
  return action.payload && action.payload.request;
};

var getRequestConfig = exports.getRequestConfig = function getRequestConfig(action) {
  return action.payload.request;
};

var getClientName = exports.getClientName = function getClientName(action) {
  return action.payload.client;
};

var getRequestOptions = exports.getRequestOptions = function getRequestOptions(action) {
  return action.payload.options;
};

var onSuccess = exports.onSuccess = function onSuccess(_ref, options) {
  var action = _ref.action,
      next = _ref.next,
      response = _ref.response;

  var nextAction = {
    type: (0, _getActionTypes.getActionTypes)(action, options)[1],
    payload: response,
    meta: {
      previousAction: action
    }
  };
  next(nextAction);
  return nextAction;
};

var onError = exports.onError = function onError(_ref2, options) {
  var action = _ref2.action,
      next = _ref2.next,
      error = _ref2.error;

  var errorObject = void 0;
  if (!error.response) {
    errorObject = {
      data: error.message,
      status: 0
    };
    if (process.env.NODE_ENV !== 'production') {
      console.log('HTTP Failure in Axios', error);
    }
  } else {
    errorObject = error;
  }
  var nextAction = {
    type: (0, _getActionTypes.getActionTypes)(action, options)[2],
    error: errorObject,
    meta: {
      previousAction: action
    }
  };

  next(nextAction);
  return nextAction;
};

var onComplete = exports.onComplete = function onComplete() {};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _middleware = __webpack_require__(1);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_middleware).default;
  }
});
Object.defineProperty(exports, 'multiClientMiddleware', {
  enumerable: true,
  get: function get() {
    return _middleware.multiClientMiddleware;
  }
});

var _getActionTypes = __webpack_require__(0);

Object.defineProperty(exports, 'getActionTypes', {
  enumerable: true,
  get: function get() {
    return _getActionTypes.getActionTypes;
  }
});
Object.defineProperty(exports, 'ERROR_SUFFIX', {
  enumerable: true,
  get: function get() {
    return _getActionTypes.ERROR_SUFFIX;
  }
});
Object.defineProperty(exports, 'SUCCESS_SUFFIX', {
  enumerable: true,
  get: function get() {
    return _getActionTypes.SUCCESS_SUFFIX;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ })
/******/ ]);
});
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.connectHost = factory());
}(this, function () { 'use strict';

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var inheritsLoose = _inheritsLoose;

  var domain; // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).

  function EventHandlers() {}

  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  // require('events') === require('events').EventEmitter

  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.usingDomains = false;
  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.

  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function () {
    this.domain = null;

    if (EventEmitter.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active && !(this instanceof domain.Domain)) ;
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  }; // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.


  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  }; // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.


  function emitNone(handler, isFn, self) {
    if (isFn) handler.call(self);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self);
      }
    }
  }

  function emitOne(handler, isFn, self, arg1) {
    if (isFn) handler.call(self, arg1);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1);
      }
    }
  }

  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn) handler.call(self, arg1, arg2);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2);
      }
    }
  }

  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn) handler.call(self, arg1, arg2, arg3);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2, arg3);
      }
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn) handler.apply(self, args);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].apply(self, args);
      }
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = type === 'error';
    events = this._events;
    if (events) doError = doError && events.error == null;else if (!doError) return false;
    domain = this.domain; // If there is no 'error' event listener then throw.

    if (doError) {
      er = arguments[1];

      if (domain) {
        if (!er) er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }

      return false;
    }

    handler = events[type];
    if (!handler) return false;
    var isFn = typeof handler === 'function';
    len = arguments.length;

    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;

      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;

      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;

      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower

      default:
        args = new Array(len - 1);

        for (i = 1; i < len; i++) {
          args[i - 1] = arguments[i];
        }

        emitMany(handler, isFn, this, args);
    }
    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = target._events;

    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object

        events = target._events;
      }

      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      } // Check for listener leak


      if (!existing.warned) {
        m = $getMaxListeners(target);

        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + type + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }

  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }

  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  };

  function _onceWrap(target, type, listener) {
    var fired = false;

    function g() {
      target.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }

    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  }; // emits a 'removeListener' event iff the listener was removed


  EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events, position, i, originalListener;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = this._events;
    if (!events) return this;
    list = events[type];
    if (!list) return this;

    if (list === listener || list.listener && list.listener === listener) {
      if (--this._eventsCount === 0) this._events = new EventHandlers();else {
        delete events[type];
        if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
      }
    } else if (typeof list !== 'function') {
      position = -1;

      for (i = list.length; i-- > 0;) {
        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }

      if (position < 0) return this;

      if (list.length === 1) {
        list[0] = undefined;

        if (--this._eventsCount === 0) {
          this._events = new EventHandlers();
          return this;
        } else {
          delete events[type];
        }
      } else {
        spliceOne(list, position);
      }

      if (events.removeListener) this.emit('removeListener', type, originalListener || listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events;
    events = this._events;
    if (!events) return this; // not listening for removeListener, no need to emit

    if (!events.removeListener) {
      if (arguments.length === 0) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      } else if (events[type]) {
        if (--this._eventsCount === 0) this._events = new EventHandlers();else delete events[type];
      }

      return this;
    } // emit removeListener for all listeners on all events


    if (arguments.length === 0) {
      var keys = Object.keys(events);

      for (var i = 0, key; i < keys.length; ++i) {
        key = keys[i];
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }

      this.removeAllListeners('removeListener');
      this._events = new EventHandlers();
      this._eventsCount = 0;
      return this;
    }

    listeners = events[type];

    if (typeof listeners === 'function') {
      this.removeListener(type, listeners);
    } else if (listeners) {
      // LIFO order
      do {
        this.removeListener(type, listeners[listeners.length - 1]);
      } while (listeners[0]);
    }

    return this;
  };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;
    if (!events) ret = [];else {
      evlistener = events[type];
      if (!evlistener) ret = [];else if (typeof evlistener === 'function') ret = [evlistener.listener || evlistener];else ret = unwrapListeners(evlistener);
    }
    return ret;
  };

  EventEmitter.listenerCount = function (emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;

  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  }; // About 1.5x faster than the two-arg version of Array#splice().


  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
      list[i] = list[k];
    }

    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);

    while (i--) {
      copy[i] = arr[i];
    }

    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);

    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }

    return ret;
  }

  var EventDispatcher =
  /*#__PURE__*/
  function (_EventEmitter) {
    inheritsLoose(EventDispatcher, _EventEmitter);

    function EventDispatcher() {
      var _this;

      _this = _EventEmitter.call(this) || this;

      _this.setMaxListeners(20);

      return _this;
    }

    var _proto = EventDispatcher.prototype;

    _proto.dispatch = function dispatch(action) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.emit.apply(this, ['before:' + action].concat(args));
      this.emit.apply(this, arguments);
      this.emit.apply(this, ['after:' + action].concat(args));
    };

    _proto.registerOnce = function registerOnce(action, callback) {
      if (typeof action === 'string') {
        this.once(action, callback);
      } else {
        throw 'ACJS: event name must be string';
      }
    };

    _proto.register = function register(action, callback) {
      if (typeof action === 'string') {
        this.on(action, callback);
      } else {
        throw 'ACJS: event name must be string';
      }
    };

    _proto.unregister = function unregister(action, callback) {
      if (typeof action === 'string') {
        this.removeListener(action, callback);
      } else {
        throw 'ACJS: event name must be string';
      }
    };

    return EventDispatcher;
  }(EventEmitter);

  var EventDispatcher$1 = new EventDispatcher();

  /**
   * The iframe-side code exposes a jquery-like implementation via _dollar.
   * This runs on the product side to provide AJS.$ under a _dollar module to provide a consistent interface
   * to code that runs on host and iframe.
   */
  var $ = window.AJS && window.AJS.$ || function () {};

  var LOG_PREFIX = "[Simple-XDM] ";
  var nativeBind = Function.prototype.bind;
  var util = {
    locationOrigin: function locationOrigin() {
      if (!window.location.origin) {
        return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
      } else {
        return window.location.origin;
      }
    },
    randomString: function randomString() {
      return Math.floor(Math.random() * 1000000000).toString(16);
    },
    isString: function isString(str) {
      return typeof str === "string" || str instanceof String;
    },
    argumentsToArray: function argumentsToArray(arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    },
    argumentNames: function argumentNames(fn) {
      return fn.toString().replace(/((\/\/.*$)|(\/\*[^]*?\*\/))/mg, '') // strip comments
      .replace(/[^(]+\(([^)]*)[^]+/, '$1') // get signature
      .match(/([^\s,]+)/g) || [];
    },
    hasCallback: function hasCallback(args) {
      var length = args.length;
      return length > 0 && typeof args[length - 1] === 'function';
    },
    error: function error(msg) {
      if (window.console && window.console.error) {
        var outputError = [];

        if (typeof msg === "string") {
          outputError.push(LOG_PREFIX + msg);
          outputError = outputError.concat(Array.prototype.slice.call(arguments, 1));
        } else {
          outputError.push(LOG_PREFIX);
          outputError = outputError.concat(Array.prototype.slice.call(arguments));
        }

        window.console.error.apply(null, outputError);
      }
    },
    warn: function warn(msg) {
      if (window.console) {
        console.warn(LOG_PREFIX + msg);
      }
    },
    log: function log(msg) {
      if (window.console) {
        window.console.log(LOG_PREFIX + msg);
      }
    },
    _bind: function _bind(thisp, fn) {
      if (nativeBind && fn.bind === nativeBind) {
        return fn.bind(thisp);
      }

      return function () {
        return fn.apply(thisp, arguments);
      };
    },
    throttle: function throttle(func, wait, context) {
      var previous = 0;
      return function () {
        var now = Date.now();

        if (now - previous > wait) {
          previous = now;
          func.apply(context, arguments);
        }
      };
    },
    each: function each(list, iteratee) {
      var length;
      var key;

      if (list) {
        length = list.length;

        if (length != null && typeof list !== 'function') {
          key = 0;

          while (key < length) {
            if (iteratee.call(list[key], key, list[key]) === false) {
              break;
            }

            key += 1;
          }
        } else {
          for (key in list) {
            if (list.hasOwnProperty(key)) {
              if (iteratee.call(list[key], key, list[key]) === false) {
                break;
              }
            }
          }
        }
      }
    },
    extend: function extend(dest) {
      var args = arguments;
      var srcs = [].slice.call(args, 1, args.length);
      srcs.forEach(function (source) {
        if (typeof source === "object") {
          Object.getOwnPropertyNames(source).forEach(function (name) {
            dest[name] = source[name];
          });
        }
      });
      return dest;
    },
    sanitizeStructuredClone: function sanitizeStructuredClone(object) {
      var whiteList = [Boolean, String, Date, RegExp, Blob, File, FileList, ArrayBuffer];
      var blackList = [Error, Node];
      var warn = util.warn;
      var visitedObjects = [];

      function _clone(value) {
        if (typeof value === 'function') {
          warn("A function was detected and removed from the message.");
          return null;
        }

        if (blackList.some(function (t) {
          if (value instanceof t) {
            warn(t.name + " object was detected and removed from the message.");
            return true;
          }

          return false;
        })) {
          return {};
        }

        if (value && typeof value === 'object' && whiteList.every(function (t) {
          return !(value instanceof t);
        })) {
          var newValue;

          if (Array.isArray(value)) {
            newValue = value.map(function (element) {
              return _clone(element);
            });
          } else {
            if (visitedObjects.indexOf(value) > -1) {
              warn("A circular reference was detected and removed from the message.");
              return null;
            }

            visitedObjects.push(value);
            newValue = {};

            for (var name in value) {
              if (value.hasOwnProperty(name)) {
                var clonedValue = _clone(value[name]);

                if (clonedValue !== null) {
                  newValue[name] = clonedValue;
                }
              }
            }

            visitedObjects.pop();
          }

          return newValue;
        }

        return value;
      }

      return _clone(object);
    },
    getOrigin: function getOrigin(url, base) {
      // everything except IE11
      if (typeof URL === 'function') {
        try {
          return new URL(url, base).origin;
        } catch (e) {}
      } // ie11 + safari 10


      var doc = document.implementation.createHTMLDocument('');

      if (base) {
        var baseElement = doc.createElement('base');
        baseElement.href = base;
        doc.head.appendChild(baseElement);
      }

      var anchorElement = doc.createElement('a');
      anchorElement.href = url;
      doc.body.appendChild(anchorElement);
      var origin = anchorElement.protocol + '//' + anchorElement.hostname; //ie11, only include port if referenced in initial URL

      if (url.match(/\/\/[^/]+:[0-9]+\//)) {
        origin += anchorElement.port ? ':' + anchorElement.port : '';
      }

      return origin;
    }
  };

  var threshold = 0.25;
  var throttle_delay = 500;
  var targets = [];
  var observe;

  var observed = function observed(target) {
    targets = targets.filter(function (_ref) {
      var element = _ref.element,
          callback = _ref.callback;

      if (element === target) {
        callback();
        return false;
      }

      return true;
    });
  };

  if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (_ref2) {
        var intersectionRatio = _ref2.intersectionRatio,
            target = _ref2.target;

        if (intersectionRatio > 0) {
          observer.unobserve(target);
          observed(target);
        }
      });
    }, {
      threshold: threshold
    });
    observe = observer.observe.bind(observer);
  } else {
    // Ponyfill for SafarIE
    var getIntersection = function getIntersection(target) {
      var docEl = document.documentElement;

      if (!docEl.contains(target) || getComputedStyle(target).display === 'none') {
        return;
      }
      var targetRect = target.getBoundingClientRect();
      var parent = target.parentNode;
      var intersection = targetRect;

      do {
        var parentStyle = getComputedStyle(parent);

        if (parentStyle.display === 'none') {
          return;
        }
        var parentRect = void 0;

        if (parent === document.body) {
          parentRect = {
            top: 0,
            left: 0,
            right: docEl.clientWidth,
            bottom: docEl.clientHeight
          };
        } else if (parentStyle.overflow !== 'visible') {
          parentRect = parent.getBoundingClientRect();
        }

        if (parentRect) {
          var top = Math.max(parentRect.top, intersection.top);
          var left = Math.max(parentRect.left, intersection.left);
          var right = Math.min(parentRect.right, intersection.right);
          var bottom = Math.min(parentRect.bottom, intersection.bottom);
          var width = right - left;
          var height = bottom - top;

          if (width <= 0 || height <= 0) {
            return;
          }
          intersection = {
            top: top,
            left: left,
            right: right,
            bottom: bottom,
            width: width,
            height: height
          };
        }

        parent = parent.parentNode;
      } while (parent !== docEl);

      if (intersection) {
        return intersection.width * intersection.height / (targetRect.width * targetRect.height);
      }
    };

    observe = function observe(element) {
      if (getIntersection(element) >= threshold) {
        observed(element);
      }
    };

    var throttled_observe = util.throttle(function () {
      targets.forEach(function (_ref3) {
        var element = _ref3.element;
        return observe(element);
      });
    }, throttle_delay);
    window.addEventListener('resize', throttled_observe);
    document.addEventListener('scroll', throttled_observe);

    if ('MutationObserver' in window) {
      document.addEventListener('DOMContentLoaded', function () {
        new MutationObserver(throttled_observe).observe(document.body, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      });
    }
  }

  var observe$1 = (function (element, callback) {
    if (typeof callback === 'function' && element instanceof Element) {
      targets.push({
        element: element,
        callback: callback
      });
      observe(element);
    }
  });

  var EVENT_NAME_PREFIX = 'connect.addon.';
  /**
   * Timings beyond 20 seconds (connect's load timeout) will be clipped to an X.
   * @const
   * @type {int}
   */

  var LOADING_TIME_THRESHOLD = 20000;
  /**
   * Trim extra zeros from the load time.
   * @const
   * @type {int}
   */

  var LOADING_TIME_TRIMP_PRECISION = 100;

  var AnalyticsDispatcher =
  /*#__PURE__*/
  function () {
    function AnalyticsDispatcher() {
      this._addons = {};
    }

    var _proto = AnalyticsDispatcher.prototype;

    _proto._track = function _track(name, data) {
      var w = window;
      var prefixedName = EVENT_NAME_PREFIX + name;
      data = data || {};
      data.version = w._AP && w._AP.version ? w._AP.version : undefined;
      data.userAgent = w.navigator.userAgent;

      if (!w.AJS) {
        return false;
      }

      if (w.AJS.Analytics) {
        w.AJS.Analytics.triggerPrivacyPolicySafeEvent(prefixedName, data);
      } else if (w.AJS.trigger) {
        // BTF fallback
        AJS.trigger('analyticsEvent', {
          name: prefixedName,
          data: data
        });
      } else {
        return false;
      }

      return true;
    };

    _proto._time = function _time() {
      return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    };

    _proto.trackLoadingStarted = function trackLoadingStarted(extension) {
      if (this._addons && extension && extension.id) {
        extension.startLoading = this._time();
        this._addons[extension.id] = extension;
      } else {
        console.error('ACJS: cannot track loading analytics', this._addons, extension);
      }
    };

    _proto.trackLoadingEnded = function trackLoadingEnded(extension) {
      if (this._addons && extension && this._addons[extension.id]) {
        var href = extension.url;
        var iframeIsCacheable = href !== undefined && href.indexOf('xdm_e=') === -1;

        var value = this._time() - this._addons[extension.id].startLoading;

        var iframeLoadApdex = this.getIframeLoadApdex(value);

        this._track('iframe.performance.load', {
          addonKey: extension.addon_key,
          moduleKey: extension.key,
          moduleType: extension.options ? extension.options.moduleType : undefined,
          moduleLocation: extension.options ? extension.options.moduleLocation : undefined,
          iframeLoadMillis: value,
          iframeLoadApdex: iframeLoadApdex,
          iframeIsCacheable: iframeIsCacheable,
          value: value > LOADING_TIME_THRESHOLD ? 'x' : Math.ceil(value / LOADING_TIME_TRIMP_PRECISION)
        });
      } else {
        console.error('ACJS: cannot track loading end analytics', this._addons, extension);
      }
    };

    _proto.getIframeLoadApdex = function getIframeLoadApdex(iframeLoadMilliseconds) {
      var apdexSatisfiedThresholdMilliseconds = 300;
      var iframeLoadApdex = iframeLoadMilliseconds <= apdexSatisfiedThresholdMilliseconds ? 1 : iframeLoadMilliseconds <= 4 * apdexSatisfiedThresholdMilliseconds ? 0.5 : 0;
      return iframeLoadApdex;
    };

    _proto.trackLoadingTimeout = function trackLoadingTimeout(extension) {
      var connectedStatus = window.navigator.onLine;

      if (typeof connectedStatus !== 'boolean') {
        connectedStatus = 'not-supported';
      }

      this._track('iframe.performance.timeout', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        moduleType: extension.options ? extension.options.moduleType : undefined,
        moduleLocation: extension.options ? extension.options.moduleLocation : undefined,
        connectedStatus: connectedStatus.toString() // convert boolean to string

      }); //track an end event during a timeout so we always have complete start / end data.


      this.trackLoadingEnded(extension);
    };

    _proto.trackLoadingCancel = function trackLoadingCancel(extension) {
      this._track('iframe.performance.cancel', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        moduleType: extension.options ? extension.options.moduleType : undefined,
        moduleLocation: extension.options ? extension.options.moduleLocation : undefined
      });
    };

    _proto.trackUseOfDeprecatedMethod = function trackUseOfDeprecatedMethod(methodUsed, extension) {
      this._track('jsapi.deprecated', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        methodUsed: methodUsed
      });
    };

    _proto.trackMultipleDialogOpening = function trackMultipleDialogOpening(dialogType, extension) {
      this._track('jsapi.dialog.multiple', {
        addonKey: extension.addon_key,
        moduleKey: extension.key,
        dialogType: dialogType
      });
    };

    _proto.trackVisible = function trackVisible(extension) {
      this._track('iframe.is_visible', {
        addonKey: extension.addon_key,
        moduleKey: extension.key
      });
    };

    _proto.dispatch = function dispatch(name, data) {
      this._track(name, data);
    };

    _proto.trackExternal = function trackExternal(name, data) {
      this._track(name, data);
    };

    return AnalyticsDispatcher;
  }();

  var analytics = new AnalyticsDispatcher();

  if ($.fn) {
    EventDispatcher$1.register('iframe-create', function (data) {
      analytics.trackLoadingStarted(data.extension);
    });
  }

  EventDispatcher$1.register('iframe-bridge-start', function (data) {
    analytics.trackLoadingStarted(data.extension);
  });
  EventDispatcher$1.register('iframe-bridge-established', function (data) {
    analytics.trackLoadingEnded(data.extension);
    observe$1(document.getElementById(data.extension.id), function () {
      analytics.trackVisible(data.extension);
    });
  });
  EventDispatcher$1.register('iframe-bridge-timeout', function (data) {
    analytics.trackLoadingTimeout(data.extension);
  });
  EventDispatcher$1.register('iframe-bridge-cancelled', function (data) {
    analytics.trackLoadingCancel(data.extension);
  });
  EventDispatcher$1.register('analytics-deprecated-method-used', function (data) {
    analytics.trackUseOfDeprecatedMethod(data.methodUsed, data.extension);
  });
  EventDispatcher$1.register('iframe-destroyed', function (data) {
    delete analytics._addons[data.extension.extension_id];
  });
  EventDispatcher$1.register('analytics-external-event-track', function (data) {
    analytics.trackExternal(data.eventName, data.values);
  });

  var LoadingIndicatorActions = {
    timeout: function timeout($el, extension) {
      EventDispatcher$1.dispatch('iframe-bridge-timeout', {
        $el: $el,
        extension: extension
      });
    },
    cancelled: function cancelled($el, extension) {
      EventDispatcher$1.dispatch('iframe-bridge-cancelled', {
        $el: $el,
        extension: extension
      });
    }
  };

  var LOADING_INDICATOR_CLASS = 'ap-status-indicator';
  var LOADING_STATUSES = {
    loading: '<div class="ap-loading"><div class="small-spinner"></div>Loading app...</div>',
    'load-timeout': '<div class="ap-load-timeout"><div class="small-spinner"></div>App is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?</div>',
    'load-error': 'App failed to load.'
  };
  var LOADING_TIMEOUT = 12000;

  var LoadingIndicator =
  /*#__PURE__*/
  function () {
    function LoadingIndicator() {
      this._stateRegistry = {};
    }

    var _proto = LoadingIndicator.prototype;

    _proto._loadingContainer = function _loadingContainer($iframeContainer) {
      return $iframeContainer.find('.' + LOADING_INDICATOR_CLASS);
    };

    _proto.render = function render() {
      var container = document.createElement('div');
      container.classList.add(LOADING_INDICATOR_CLASS);
      container.innerHTML = LOADING_STATUSES.loading;
      var $container = $(container);

      this._startSpinner($container);

      return $container;
    };

    _proto._startSpinner = function _startSpinner($container) {
      // TODO: AUI or spin.js broke something. This is bad but ironically matches v3's implementation.
      setTimeout(function () {
        var spinner = $container.find('.small-spinner');

        if (spinner.length && spinner.spin) {
          spinner.spin({
            lines: 12,
            length: 3,
            width: 2,
            radius: 3,
            trail: 60,
            speed: 1.5,
            zIndex: 1
          });
        }
      }, 10);
    };

    _proto.hide = function hide($iframeContainer, extensionId) {
      clearTimeout(this._stateRegistry[extensionId]);
      delete this._stateRegistry[extensionId];
      this._loadingContainer($iframeContainer)[0].style.display = 'none';
    };

    _proto.cancelled = function cancelled($iframeContainer, extensionId) {
      var status = LOADING_STATUSES['load-error'];

      this._loadingContainer($iframeContainer).empty().text(status);
    };

    _proto._setupTimeout = function _setupTimeout($container, extension) {
      this._stateRegistry[extension.id] = setTimeout(function () {
        LoadingIndicatorActions.timeout($container, extension);
      }, LOADING_TIMEOUT);
    };

    _proto.timeout = function timeout($iframeContainer, extensionId) {
      var status = $(LOADING_STATUSES['load-timeout']);

      var container = this._loadingContainer($iframeContainer);

      container.empty().append(status);

      this._startSpinner(container);

      $('a.ap-btn-cancel', container).click(function () {
        LoadingIndicatorActions.cancelled($iframeContainer, extensionId);
      });
      delete this._stateRegistry[extensionId];
      return container;
    };

    return LoadingIndicator;
  }();

  var LoadingComponent = new LoadingIndicator();
  EventDispatcher$1.register('iframe-create', function (data) {
    if (!data.extension.options.noDom) {
      LoadingComponent._setupTimeout(data.$el.parents('.ap-iframe-container'), data.extension);
    }
  });
  EventDispatcher$1.register('iframe-bridge-established', function (data) {
    if (!data.extension.options.noDom) {
      LoadingComponent.hide(data.$el.parents('.ap-iframe-container'), data.extension.id);
    }
  });
  EventDispatcher$1.register('iframe-bridge-timeout', function (data) {
    if (!data.extension.options.noDom) {
      LoadingComponent.timeout(data.$el, data.extension.id);
    }
  });
  EventDispatcher$1.register('iframe-bridge-cancelled', function (data) {
    if (!data.extension.options.noDom) {
      LoadingComponent.cancelled(data.$el, data.extension.id);
    }
  });

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var setPrototypeOf = createCommonjsModule(function (module) {
  function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  module.exports = _setPrototypeOf;
  });

  var construct = createCommonjsModule(function (module) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      module.exports = _construct = Reflect.construct;
    } else {
      module.exports = _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  module.exports = _construct;
  });

  var PostMessage =
  /*#__PURE__*/
  function () {
    function PostMessage(data) {
      var d = data || {};

      this._registerListener(d.listenOn);
    }

    var _proto = PostMessage.prototype;

    _proto._registerListener = function _registerListener(listenOn) {
      if (!listenOn || !listenOn.addEventListener) {
        listenOn = window;
      }

      listenOn.addEventListener("message", util._bind(this, this._receiveMessage), false);
    };

    _proto._receiveMessage = function _receiveMessage(event) {
      var handler = this._messageHandlers[event.data.type],
          extensionId = event.data.eid,
          reg;

      if (extensionId && this._registeredExtensions) {
        reg = this._registeredExtensions[extensionId];
      }

      if (!handler || !this._checkOrigin(event, reg)) {
        return false;
      }

      handler.call(this, event, reg);
    };

    return PostMessage;
  }();

  var VALID_EVENT_TIME_MS = 30000; //30 seconds

  var XDMRPC =
  /*#__PURE__*/
  function (_PostMessage) {
    inheritsLoose(XDMRPC, _PostMessage);

    var _proto = XDMRPC.prototype;

    _proto._padUndefinedArguments = function _padUndefinedArguments(array, length) {
      return array.length >= length ? array : array.concat(new Array(length - array.length));
    };

    function XDMRPC(config) {
      var _this;

      config = config || {};
      _this = _PostMessage.call(this, config) || this;
      _this._registeredExtensions = config.extensions || {};
      _this._registeredAPIModules = {};
      _this._registeredAPIModules._globals = {};
      _this._pendingCallbacks = {};
      _this._keycodeCallbacks = {};
      _this._clickHandler = null;
      _this._pendingEvents = {};
      _this._messageHandlers = {
        init: _this._handleInit,
        req: _this._handleRequest,
        resp: _this._handleResponse,
        broadcast: _this._handleBroadcast,
        event_query: _this._handleEventQuery,
        key_triggered: _this._handleKeyTriggered,
        addon_clicked: _this._handleAddonClick,
        get_host_offset: _this._getHostOffset,
        unload: _this._handleUnload,
        sub: _this._handleSubInit
      };
      return _this;
    }

    _proto._verifyAPI = function _verifyAPI(event, reg) {
      var untrustedTargets = event.data.targets;

      if (!untrustedTargets) {
        return;
      }

      var trustedSpec = this.getApiSpec();
      var tampered = false;

      function check(trusted, untrusted) {
        Object.getOwnPropertyNames(untrusted).forEach(function (name) {
          if (typeof untrusted[name] === 'object' && trusted[name]) {
            check(trusted[name], untrusted[name]);
          } else {
            if (untrusted[name] === 'parent' && trusted[name]) {
              tampered = true;
            }
          }
        });
      }

      check(trustedSpec, untrustedTargets);
      event.source.postMessage({
        type: 'api_tamper',
        tampered: tampered
      }, reg.extension.url);
    };

    _proto._handleInit = function _handleInit(event, reg) {
      this._registeredExtensions[reg.extension_id].source = event.source;

      if (reg.initCallback) {
        reg.initCallback(event.data.eid);
        delete reg.initCallback;
      }

      if (event.data.targets) {
        this._verifyAPI(event, reg);
      }
    } // postMessage method to do registerExtension
    ;

    _proto._handleSubInit = function _handleSubInit(event, reg) {
      if (reg.extension.options.noSub) {
        util.error("Sub-Extension requested by [" + reg.extension.addon_key + "] but feature is disabled");
      } else {
        this.registerExtension(event.data.ext.id, {
          extension: event.data.ext
        });
      }
    };

    _proto._getHostOffset = function _getHostOffset(event, _window) {
      var hostWindow = event.source;
      var hostFrameOffset = null;
      var windowReference = _window || window; // For testing

      if (windowReference === windowReference.top && typeof windowReference.getHostOffsetFunctionOverride === 'function') {
        hostFrameOffset = windowReference.getHostOffsetFunctionOverride(hostWindow);
      }

      if (typeof hostFrameOffset !== 'number') {
        hostFrameOffset = 0; // Find the closest frame that has the same origin as event source

        while (!this._hasSameOrigin(hostWindow)) {
          // Climb up the iframe tree 1 layer
          hostFrameOffset++;
          hostWindow = hostWindow.parent;
        }
      }

      event.source.postMessage({
        hostFrameOffset: hostFrameOffset
      }, event.origin);
    };

    _proto._hasSameOrigin = function _hasSameOrigin(window) {
      if (window === window.top) {
        return true;
      }

      try {
        // Try set & read a variable on the given window
        // If we can successfully read the value then it means the given window has the same origin
        // as the window that is currently executing the script
        var testVariableName = 'test_var_' + Math.random().toString(16).substr(2);
        window[testVariableName] = true;
        return window[testVariableName];
      } catch (e) {// A exception will be thrown if the windows doesn't have the same origin
      }

      return false;
    };

    _proto._handleResponse = function _handleResponse(event) {
      var data = event.data;
      var pendingCallback = this._pendingCallbacks[data.mid];

      if (pendingCallback) {
        delete this._pendingCallbacks[data.mid];
        pendingCallback.apply(window, data.args);
      }
    };

    _proto.registerRequestNotifier = function registerRequestNotifier(cb) {
      this._registeredRequestNotifier = cb;
    };

    _proto._handleRequest = function _handleRequest(event, reg) {
      function sendResponse() {
        var args = util.sanitizeStructuredClone(util.argumentsToArray(arguments));
        event.source.postMessage({
          mid: event.data.mid,
          type: 'resp',
          forPlugin: true,
          args: args
        }, reg.extension.url);
      }

      var data = event.data;
      var module = this._registeredAPIModules[data.mod];
      var extension = this.getRegisteredExtensions(reg.extension)[0];

      if (module) {
        var fnName = data.fn;

        if (data._cls) {
          var Cls = module[data._cls];
          var ns = data.mod + '-' + data._cls + '-';
          sendResponse._id = data._id;

          if (fnName === 'constructor') {
            if (!Cls._construct) {
              Cls.constructor.prototype._destroy = function () {
                delete this._context._proxies[ns + this._id];
              };

              Cls._construct = function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                var inst = construct(Cls.constructor, args);

                var callback = args[args.length - 1];
                inst._id = callback._id;
                inst._context = callback._context;
                inst._context._proxies[ns + inst._id] = inst;
                return inst;
              };
            }

            module = Cls;
            fnName = '_construct';
          } else {
            module = extension._proxies[ns + data._id];
          }
        }

        var method = module[fnName];

        if (method) {
          var methodArgs = data.args;
          var padLength = method.length - 1;

          if (fnName === '_construct') {
            padLength = module.constructor.length - 1;
          }

          sendResponse._context = extension;
          methodArgs = this._padUndefinedArguments(methodArgs, padLength);
          methodArgs.push(sendResponse);
          var promiseResult = method.apply(module, methodArgs);

          if (method.returnsPromise) {
            if (!(typeof promiseResult === 'object' || typeof promiseResult === 'function') || typeof promiseResult.then !== 'function') {
              sendResponse('Defined module method did not return a promise.');
            } else {
              promiseResult.then(function (result) {
                sendResponse(undefined, result);
              }).catch(function (err) {
                err = err instanceof Error ? err.message : err;
                sendResponse(err);
              });
            }
          }

          if (this._registeredRequestNotifier) {
            this._registeredRequestNotifier.call(null, {
              module: data.mod,
              fn: data.fn,
              type: data.type,
              addon_key: reg.extension.addon_key,
              key: reg.extension.key,
              extension_id: reg.extension_id
            });
          }
        }
      }
    };

    _proto._handleBroadcast = function _handleBroadcast(event, reg) {
      var event_data = event.data;

      var targetSpec = function targetSpec(r) {
        return r.extension.addon_key === reg.extension.addon_key && r.extension_id !== reg.extension_id;
      };

      this.dispatch(event_data.etyp, targetSpec, event_data.evnt, null, null);
    };

    _proto._handleKeyTriggered = function _handleKeyTriggered(event, reg) {
      var eventData = event.data;

      var keycodeEntry = this._keycodeKey(eventData.keycode, eventData.modifiers, reg.extension_id);

      var listeners = this._keycodeCallbacks[keycodeEntry];

      if (listeners) {
        listeners.forEach(function (listener) {
          listener.call(null, {
            addon_key: reg.extension.addon_key,
            key: reg.extension.key,
            extension_id: reg.extension_id,
            keycode: eventData.keycode,
            modifiers: eventData.modifiers
          });
        }, this);
      }
    };

    _proto.defineAPIModule = function defineAPIModule(module, moduleName) {
      moduleName = moduleName || '_globals';
      this._registeredAPIModules[moduleName] = util.extend({}, this._registeredAPIModules[moduleName] || {}, module);
      return this._registeredAPIModules;
    };

    _proto._pendingEventKey = function _pendingEventKey(targetSpec, time) {
      var key = targetSpec.addon_key || 'global';

      if (targetSpec.key) {
        key = key + "@@" + targetSpec.key;
      }

      key = key + "@@" + time;
      return key;
    };

    _proto.queueEvent = function queueEvent(type, targetSpec, event, callback) {
      var loaded_frame,
          targets = this._findRegistrations(targetSpec);

      loaded_frame = targets.some(function (target) {
        return target.registered_events !== undefined;
      }, this);

      if (loaded_frame) {
        this.dispatch(type, targetSpec, event, callback);
      } else {
        this._cleanupInvalidEvents();

        var time = new Date().getTime();
        this._pendingEvents[this._pendingEventKey(targetSpec, time)] = {
          type: type,
          targetSpec: targetSpec,
          event: event,
          callback: callback,
          time: time,
          uid: util.randomString()
        };
      }
    };

    _proto._cleanupInvalidEvents = function _cleanupInvalidEvents() {
      var _this2 = this;

      var now = new Date().getTime();
      var keys = Object.keys(this._pendingEvents);
      keys.forEach(function (index) {
        var element = _this2._pendingEvents[index];
        var eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;

        if (!eventIsValid) {
          delete _this2._pendingEvents[index];
        }
      });
    };

    _proto._handleEventQuery = function _handleEventQuery(message, extension) {
      var _this3 = this;

      var executed = {};
      var now = new Date().getTime();
      var keys = Object.keys(this._pendingEvents);
      keys.forEach(function (index) {
        var element = _this3._pendingEvents[index];
        var eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;
        var isSameTarget = !element.targetSpec || _this3._findRegistrations(element.targetSpec).length !== 0;

        if (isSameTarget && element.targetSpec.key) {
          isSameTarget = element.targetSpec.addon_key === extension.extension.addon_key && element.targetSpec.key === extension.extension.key;
        }

        if (eventIsValid && isSameTarget) {
          executed[index] = element;
          element.targetSpec = element.targetSpec || {};

          _this3.dispatch(element.type, element.targetSpec, element.event, element.callback, message.source);
        } else if (!eventIsValid) {
          delete _this3._pendingEvents[index];
        }
      });
      this._registeredExtensions[extension.extension_id].registered_events = message.data.args;
      return executed;
    };

    _proto._handleUnload = function _handleUnload(event, reg) {
      if (!reg) {
        return;
      }

      if (reg.extension_id && this._registeredExtensions[reg.extension_id]) {
        delete this._registeredExtensions[reg.extension_id].source;
      }

      if (reg.unloadCallback) {
        reg.unloadCallback(event.data.eid);
      }
    };

    _proto.dispatch = function dispatch(type, targetSpec, event, callback, source) {
      function sendEvent(reg, evnt) {
        if (reg.source && reg.source.postMessage) {
          var mid;

          if (callback) {
            mid = util.randomString();
            this._pendingCallbacks[mid] = callback;
          }

          reg.source.postMessage({
            type: 'evt',
            mid: mid,
            etyp: type,
            evnt: evnt
          }, reg.extension.url);
        }
      }

      var registrations = this._findRegistrations(targetSpec || {});

      registrations.forEach(function (reg) {
        if (source && !reg.source) {
          reg.source = source;
        }

        if (reg.source) {
          util._bind(this, sendEvent)(reg, event);
        }
      }, this);
    };

    _proto._findRegistrations = function _findRegistrations(targetSpec) {
      var _this4 = this;

      if (this._registeredExtensions.length === 0) {
        util.error('no registered extensions', this._registeredExtensions);
        return [];
      }

      var keys = Object.getOwnPropertyNames(targetSpec);
      var registrations = Object.getOwnPropertyNames(this._registeredExtensions).map(function (key) {
        return _this4._registeredExtensions[key];
      });

      if (targetSpec instanceof Function) {
        return registrations.filter(targetSpec);
      } else {
        return registrations.filter(function (reg) {
          return keys.every(function (key) {
            return reg.extension[key] === targetSpec[key];
          });
        });
      }
    };

    _proto.registerExtension = function registerExtension(extension_id, data) {
      data._proxies = {};
      data.extension_id = extension_id;
      this._registeredExtensions[extension_id] = data;
    };

    _proto._keycodeKey = function _keycodeKey(key, modifiers, extension_id) {
      var code = key;

      if (modifiers) {
        if (typeof modifiers === "string") {
          modifiers = [modifiers];
        }

        modifiers.sort();
        modifiers.forEach(function (modifier) {
          code += '$$' + modifier;
        }, this);
      }

      return code + '__' + extension_id;
    };

    _proto.registerKeyListener = function registerKeyListener(extension_id, key, modifiers, callback) {
      if (typeof modifiers === "string") {
        modifiers = [modifiers];
      }

      var reg = this._registeredExtensions[extension_id];

      var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);

      if (!this._keycodeCallbacks[keycodeEntry]) {
        this._keycodeCallbacks[keycodeEntry] = [];
        reg.source.postMessage({
          type: 'key_listen',
          keycode: key,
          modifiers: modifiers,
          action: 'add'
        }, reg.extension.url);
      }

      this._keycodeCallbacks[keycodeEntry].push(callback);
    };

    _proto.unregisterKeyListener = function unregisterKeyListener(extension_id, key, modifiers, callback) {
      var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);

      var potentialCallbacks = this._keycodeCallbacks[keycodeEntry];
      var reg = this._registeredExtensions[extension_id];

      if (potentialCallbacks) {
        if (callback) {
          var index = potentialCallbacks.indexOf(callback);

          this._keycodeCallbacks[keycodeEntry].splice(index, 1);
        } else {
          delete this._keycodeCallbacks[keycodeEntry];
        }

        if (reg.source && reg.source.postMessage) {
          reg.source.postMessage({
            type: 'key_listen',
            keycode: key,
            modifiers: modifiers,
            action: 'remove'
          }, reg.extension.url);
        }
      }
    };

    _proto.registerClickHandler = function registerClickHandler(callback) {
      if (typeof callback !== 'function') {
        throw new Error('callback must be a function');
      }

      if (this._clickHandler !== null) {
        throw new Error('ClickHandler already registered');
      }

      this._clickHandler = callback;
    };

    _proto._handleAddonClick = function _handleAddonClick(event, reg) {
      if (typeof this._clickHandler === 'function') {
        this._clickHandler({
          addon_key: reg.extension.addon_key,
          key: reg.extension.key,
          extension_id: reg.extension_id
        });
      }
    };

    _proto.unregisterClickHandler = function unregisterClickHandler() {
      this._clickHandler = null;
    };

    _proto.getApiSpec = function getApiSpec() {
      var that = this;

      function createModule(moduleName) {
        var module = that._registeredAPIModules[moduleName];

        if (!module) {
          throw new Error("unregistered API module: " + moduleName);
        }

        function getModuleDefinition(mod) {
          return Object.getOwnPropertyNames(mod).reduce(function (accumulator, memberName) {
            var member = mod[memberName];

            switch (typeof member) {
              case 'function':
                accumulator[memberName] = {
                  args: util.argumentNames(member),
                  returnsPromise: member.returnsPromise || false
                };
                break;

              case 'object':
                if (member.hasOwnProperty('constructor')) {
                  accumulator[memberName] = getModuleDefinition(member);
                }

                break;
            }

            return accumulator;
          }, {});
        }

        return getModuleDefinition(module);
      }

      return Object.getOwnPropertyNames(this._registeredAPIModules).reduce(function (accumulator, moduleName) {
        accumulator[moduleName] = createModule(moduleName);
        return accumulator;
      }, {});
    };

    _proto._originEqual = function _originEqual(url, origin) {
      function strCheck(str) {
        return typeof str === 'string' && str.length > 0;
      }

      var urlOrigin = util.getOrigin(url); // check strings are strings and they contain something

      if (!strCheck(url) || !strCheck(origin) || !strCheck(urlOrigin)) {
        return false;
      }

      return origin === urlOrigin;
    } // validate origin of postMessage
    ;

    _proto._checkOrigin = function _checkOrigin(event, reg) {
      var no_source_types = ['init'];
      var isNoSourceType = reg && !reg.source && no_source_types.indexOf(event.data.type) > -1;
      var sourceTypeMatches = reg && event.source === reg.source;

      var hasExtensionUrl = reg && this._originEqual(reg.extension.url, event.origin);

      var isValidOrigin = hasExtensionUrl && (isNoSourceType || sourceTypeMatches); // get_host_offset fires before init

      if (event.data.type === 'get_host_offset' && window === window.top) {
        isValidOrigin = true;
      } // check undefined for chromium (Issue 395010)


      if (event.data.type === 'unload' && (sourceTypeMatches || event.source === undefined)) {
        isValidOrigin = true;
      }

      return isValidOrigin;
    };

    _proto.getRegisteredExtensions = function getRegisteredExtensions(filter) {
      if (filter) {
        return this._findRegistrations(filter);
      }

      return this._registeredExtensions;
    };

    _proto.unregisterExtension = function unregisterExtension(filter) {
      var registrations = this._findRegistrations(filter);

      if (registrations.length !== 0) {
        registrations.forEach(function (registration) {
          var _this5 = this;

          var keys = Object.keys(this._pendingEvents);
          keys.forEach(function (index) {
            var element = _this5._pendingEvents[index];
            var targetSpec = element.targetSpec || {};

            if (targetSpec.addon_key === registration.extension.addon_key && targetSpec.key === registration.extension.key) {
              delete _this5._pendingEvents[index];
            }
          });
          delete this._registeredExtensions[registration.extension_id];
        }, this);
      }
    };

    return XDMRPC;
  }(PostMessage);

  var Connect =
  /*#__PURE__*/
  function () {
    function Connect() {
      this._xdm = new XDMRPC();
    }
    /**
     * Send a message to iframes matching the targetSpec. This message is added to
     *  a message queue for delivery to ensure the message is received if an iframe
     *  has not yet loaded
     *
     * @param type The name of the event type
     * @param targetSpec The spec to match against extensions when sending this event
     * @param event The event payload
     * @param callback A callback to be executed when the remote iframe calls its callback
     */


    var _proto = Connect.prototype;

    _proto.dispatch = function dispatch(type, targetSpec, event, callback) {
      this._xdm.queueEvent(type, targetSpec, event, callback);

      return this.getExtensions(targetSpec);
    }
    /**
     * Send a message to iframes matching the targetSpec immediately. This message will
     *  only be sent to iframes that are already open, and will not be delivered if none
     *  are currently open.
     *
     * @param type The name of the event type
     * @param targetSpec The spec to match against extensions when sending this event
     * @param event The event payload
     */
    ;

    _proto.broadcast = function broadcast(type, targetSpec, event) {
      this._xdm.dispatch(type, targetSpec, event, null, null);

      return this.getExtensions(targetSpec);
    };

    _proto._createId = function _createId(extension) {
      if (!extension.addon_key || !extension.key) {
        throw Error('Extensions require addon_key and key');
      }

      return extension.addon_key + '__' + extension.key + '__' + util.randomString();
    }
    /**
    * Creates a new iframed module, without actually creating the DOM element.
    * The iframe attributes are passed to the 'setupCallback', which is responsible for creating
    * the DOM element and returning the window reference.
    *
    * @param extension The extension definition. Example:
    *   {
    *     addon_key: 'my-addon',
    *     key: 'my-module',
    *     url: 'https://example.com/my-module',
    *     options: {
    *         autoresize: false,
    *         hostOrigin: 'https://connect-host.example.com/'
    *     }
    *   }
    *
    * @param initCallback The optional initCallback is called when the bridge between host and iframe is established.
    **/
    ;

    _proto.create = function create(extension, initCallback, unloadCallback) {
      var extension_id = this.registerExtension(extension, initCallback, unloadCallback);
      var options = extension.options || {};
      var data = {
        extension_id: extension_id,
        api: this._xdm.getApiSpec(),
        origin: util.locationOrigin(),
        options: options
      };
      return {
        id: extension_id,
        name: JSON.stringify(data),
        src: extension.url
      };
    };

    _proto.registerRequestNotifier = function registerRequestNotifier(callback) {
      this._xdm.registerRequestNotifier(callback);
    };

    _proto.registerExtension = function registerExtension(extension, initCallback, unloadCallback) {
      var extension_id = this._createId(extension);

      this._xdm.registerExtension(extension_id, {
        extension: extension,
        initCallback: initCallback,
        unloadCallback: unloadCallback
      });

      return extension_id;
    };

    _proto.registerKeyListener = function registerKeyListener(extension_id, key, modifiers, callback) {
      this._xdm.registerKeyListener(extension_id, key, modifiers, callback);
    };

    _proto.unregisterKeyListener = function unregisterKeyListener(extension_id, key, modifiers, callback) {
      this._xdm.unregisterKeyListener(extension_id, key, modifiers, callback);
    };

    _proto.registerClickHandler = function registerClickHandler(callback) {
      this._xdm.registerClickHandler(callback);
    };

    _proto.unregisterClickHandler = function unregisterClickHandler() {
      this._xdm.unregisterClickHandler();
    };

    _proto.defineModule = function defineModule(moduleName, module, options) {
      this._xdm.defineAPIModule(module, moduleName, options);
    };

    _proto.defineGlobals = function defineGlobals(module) {
      this._xdm.defineAPIModule(module);
    };

    _proto.getExtensions = function getExtensions(filter) {
      return this._xdm.getRegisteredExtensions(filter);
    };

    _proto.unregisterExtension = function unregisterExtension(filter) {
      return this._xdm.unregisterExtension(filter);
    };

    _proto.returnsPromise = function returnsPromise(wrappedMethod) {
      wrappedMethod.returnsPromise = true;
    };

    return Connect;
  }();

  var host = new Connect();

  var EventActions = {
    broadcast: function broadcast(type, targetSpec, event) {
      host.dispatch(type, targetSpec, event);
      EventDispatcher$1.dispatch('event-dispatch', {
        type: type,
        targetSpec: targetSpec,
        event: event
      });
    },
    broadcastPublic: function broadcastPublic(type, event, sender) {
      EventDispatcher$1.dispatch('event-public-dispatch', {
        type: type,
        event: event,
        sender: sender
      });
      host.dispatch(type, {}, {
        sender: {
          addonKey: sender.addon_key,
          key: sender.key,
          options: util.sanitizeStructuredClone(sender.options)
        },
        event: event
      });
    }
  };

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */

  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
    }

    return Object(val);
  }

  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      } // Detect buggy property enumeration order in older V8 versions.
      // https://bugs.chromium.org/p/v8/issues/detail?id=4118


      var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

      test1[5] = 'de';

      if (Object.getOwnPropertyNames(test1)[0] === '5') {
        return false;
      } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


      var test2 = {};

      for (var i = 0; i < 10; i++) {
        test2['_' + String.fromCharCode(i)] = i;
      }

      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      });

      if (order2.join('') !== '0123456789') {
        return false;
      } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


      var test3 = {};
      'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
        test3[letter] = letter;
      });

      if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
        return false;
      }

      return true;
    } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
    }
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    var from;
    var to = toObject(target);
    var symbols;

    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);

      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }

      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);

        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }

    return to;
  };

  function escapeSelector(s) {
    if (!s) {
      throw new Error('No selector to escape');
    }

    return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
  }

  function stringToDimension(value) {
    var percent = false;
    var unit = 'px';

    if (typeof value === 'string') {
      percent = value.indexOf('%') === value.length - 1;
      value = parseInt(value, 10);

      if (percent) {
        unit = '%';
      }
    }

    if (!isNaN(value)) {
      return value + unit;
    }
  }

  function getIframeByExtensionId(id) {
    return $('iframe#' + escapeSelector(id));
  }

  function first(arr, numb) {
    if (numb) {
      return arr.slice(0, numb);
    }

    return arr[0];
  }

  function last(arr) {
    return arr[arr.length - 1];
  }

  function pick(obj, keys) {
    if (typeof obj !== 'object') {
      return {};
    }

    return Object.keys(obj).filter(function (key) {
      return keys.indexOf(key) >= 0;
    }).reduce(function (newObj, key) {
      var _extend;

      return objectAssign(newObj, (_extend = {}, _extend[key] = obj[key], _extend));
    }, {});
  }

  function debounce(fn, wait) {
    var timeout;
    return function () {
      var ctx = this;
      var args = [].slice.call(arguments);

      function later() {
        timeout = null;
        fn.apply(ctx, args);
      }

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(later, wait || 50);
    };
  }

  var Util = {
    escapeSelector: escapeSelector,
    stringToDimension: stringToDimension,
    getIframeByExtensionId: getIframeByExtensionId,
    first: first,
    last: last,
    pick: pick,
    debounce: debounce,
    extend: objectAssign
  };

  var events = {
    emit: function emit(name) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var callback = Util.last(args);
      args = Util.first(args, -1);
      EventActions.broadcast(name, {
        addon_key: callback._context.extension.addon_key
      }, args);
    },
    emitPublic: function emitPublic(name) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var callback = Util.last(args);
      var extension = callback._context.extension;
      args = Util.first(args, -1);
      EventActions.broadcastPublic(name, args, extension);
    }
  };

  var DialogExtensionActions = {
    open: function open(extension, options) {
      EventDispatcher$1.dispatch('dialog-extension-open', {
        extension: extension,
        options: options
      });
    },
    close: function close() {
      EventDispatcher$1.dispatch('dialog-close-active', {});
    },
    addUserButton: function addUserButton(options, extension) {
      EventDispatcher$1.dispatch('dialog-button-add', {
        button: {
          text: options.text,
          identifier: options.identifier,
          data: {
            userButton: true
          }
        },
        extension: extension
      });
    }
  };

  var DialogActions = {
    close: function close(data) {
      EventDispatcher$1.dispatch('dialog-close', {
        dialog: data.dialog,
        extension: data.extension,
        customData: data.customData
      });
    },
    closeActive: function closeActive(data) {
      EventDispatcher$1.dispatch('dialog-close-active', data);
    },
    clickButton: function clickButton(identifier, $el, extension) {
      EventDispatcher$1.dispatch('dialog-button-click', {
        identifier: identifier,
        $el: $el,
        extension: extension
      });
    },
    toggleButton: function toggleButton(data) {
      EventDispatcher$1.dispatch('dialog-button-toggle', data);
    },
    toggleButtonVisibility: function toggleButtonVisibility(data) {
      EventDispatcher$1.dispatch('dialog-button-toggle-visibility', data);
    }
  };

  var DomEventActions = {
    registerKeyEvent: function registerKeyEvent(data) {
      host.registerKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
      EventDispatcher$1.dispatch('dom-event-register', data);
    },
    unregisterKeyEvent: function unregisterKeyEvent(data) {
      host.unregisterKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
      EventDispatcher$1.dispatch('dom-event-unregister', data);
    },
    registerWindowKeyEvent: function registerWindowKeyEvent(data) {
      window.addEventListener('keydown', function (event) {
        if (event.keyCode === data.keyCode) {
          data.callback();
        }
      });
    },
    registerClickHandler: function registerClickHandler(handleIframeClick) {
      host.registerClickHandler(function (data) {
        var iframe = document.getElementById(data.extension_id);

        if (iframe) {
          handleIframeClick(iframe);
        }
      });
    },
    unregisterClickHandler: function unregisterClickHandler() {
      host.unregisterClickHandler();
    }
  };

  var ButtonUtils =
  /*#__PURE__*/
  function () {
    function ButtonUtils() {}

    var _proto = ButtonUtils.prototype;

    // button identifier for XDM. NOT an id attribute
    _proto.randomIdentifier = function randomIdentifier() {
      return Math.random().toString(16).substring(7);
    };

    return ButtonUtils;
  }();

  var buttonUtilsInstance = new ButtonUtils();

  var DialogUtils =
  /*#__PURE__*/
  function () {
    function DialogUtils() {}

    var _proto = DialogUtils.prototype;

    _proto._maxDimension = function _maxDimension(val, maxPxVal) {
      var parsed = Util.stringToDimension(val);
      var parsedInt = parseInt(parsed, 10);
      var parsedMaxPxVal = parseInt(maxPxVal, 10);

      if (parsed.indexOf('%') > -1 && parsedInt >= 100 || // %
      parsedInt > parsedMaxPxVal) {
        // px
        return '100%';
      }

      return parsed;
    };

    _proto._closeOnEscape = function _closeOnEscape(options) {
      if (options.closeOnEscape === false) {
        return false;
      } else {
        return true;
      }
    };

    _proto._size = function _size(options) {
      var size = options.size;

      if (options.size === 'x-large') {
        size = 'xlarge';
      }

      if (options.size !== 'maximum' && options.width === '100%' && options.height === '100%') {
        size = 'fullscreen';
      }

      return size;
    };

    _proto._header = function _header(text) {
      var headerText = '';

      switch (typeof text) {
        case 'string':
          headerText = text;
          break;

        case 'object':
          headerText = text.value;
          break;
      }

      return headerText;
    };

    _proto._hint = function _hint(text) {
      if (typeof text === 'string') {
        return text;
      }

      return '';
    };

    _proto._chrome = function _chrome(options) {
      var returnval = false;

      if (typeof options.chrome === 'boolean') {
        returnval = options.chrome;
      }

      if (options.size === 'fullscreen') {
        returnval = true;
      }

      if (options.size === 'maximum') {
        returnval = false;
      }

      return returnval;
    };

    _proto._width = function _width(options) {
      if (options.size) {
        return undefined;
      }

      if (options.width) {
        return this._maxDimension(options.width, $(window).width());
      }

      return '50%';
    };

    _proto._height = function _height(options) {
      if (options.size) {
        return undefined;
      }

      if (options.height) {
        return this._maxDimension(options.height, $(window).height());
      }

      return '50%';
    };

    _proto._actions = function _actions(options) {
      var sanitizedActions = [];
      options = options || {};

      if (!options.actions) {
        sanitizedActions = [{
          name: 'submit',
          identifier: 'submit',
          text: options.submitText || 'Submit',
          type: 'primary',
          disabled: true // disable submit button by default (until the dialog has loaded).

        }, {
          name: 'cancel',
          identifier: 'cancel',
          text: options.cancelText || 'Cancel',
          type: 'link',
          immutable: true
        }];
      }

      if (options.buttons) {
        sanitizedActions = sanitizedActions.concat(this._buttons(options));
      }

      return sanitizedActions;
    };

    _proto._id = function _id(str) {
      if (typeof str !== 'string') {
        str = Math.random().toString(36).substring(2, 8);
      }

      return str;
    } // user defined action buttons
    ;

    _proto._buttons = function _buttons(options) {
      var buttons = [];

      if (options.buttons && Array.isArray(options.buttons)) {
        options.buttons.forEach(function (button) {
          var text;
          var identifier;
          var disabled = false;

          if (button.text && typeof button.text === 'string') {
            text = button.text;
          }

          if (button.identifier && typeof button.identifier === 'string') {
            identifier = button.identifier;
          } else {
            identifier = buttonUtilsInstance.randomIdentifier();
          }

          if (button.disabled && button.disabled === true) {
            disabled = true;
          }

          buttons.push({
            text: text,
            identifier: identifier,
            type: 'secondary',
            custom: true,
            disabled: disabled
          });
        });
      }

      return buttons;
    };

    _proto._onHide = function _onHide(options) {
      var noop = function noop() {};

      if (typeof options.onHide === 'function') {
        return options.onHide;
      } else {
        return noop;
      }
    };

    _proto.sanitizeOptions = function sanitizeOptions(options) {
      options = options || {};
      var sanitized = {
        chrome: this._chrome(options),
        header: this._header(options.header),
        hint: this._hint(options.hint),
        width: this._width(options),
        height: this._height(options),
        $content: options.$content,
        extension: options.extension,
        actions: this._actions(options),
        id: this._id(options.id),
        size: options.size,
        closeOnEscape: this._closeOnEscape(options),
        onHide: this._onHide(options)
      };
      sanitized.size = this._size(sanitized);
      return sanitized;
    } // such a bad idea! this entire concept needs rewriting in the p2 plugin.
    ;

    _proto.moduleOptionsFromGlobal = function moduleOptionsFromGlobal(addon_key, key) {
      var defaultOptions = {
        chrome: true
      };

      if (window._AP && window._AP.dialogModules && window._AP.dialogModules[addon_key] && window._AP.dialogModules[addon_key][key]) {
        return Util.extend({}, defaultOptions, window._AP.dialogModules[addon_key][key].options);
      }

      return false;
    } // determines information about dialogs that are about to open and are already open
    ;

    _proto.trackMultipleDialogOpening = function trackMultipleDialogOpening(dialogExtension, options) {
      // check for dialogs that are already open
      var trackingDescription;

      var size = this._size(options);

      if ($('.ap-aui-dialog2:visible').length) {
        // am i in the confluence editor? first check for macro dialogs opened through macro browser, second is editing an existing macro
        if ($('#macro-browser-dialog').length || AJS.Confluence && AJS.Confluence.Editor && AJS.Confluence.Editor.currentEditMode) {
          if (size === 'fullscreen') {
            trackingDescription = 'connect-macro-multiple-fullscreen';
          } else {
            trackingDescription = 'connect-macro-multiple';
          }
        } else {
          trackingDescription = 'connect-multiple';
        }

        analytics.trackMultipleDialogOpening(trackingDescription, dialogExtension);
      }
    } // abstracts and handles a failure to find active dialog
    ;

    _proto.assertActiveDialogOrThrow = function assertActiveDialogOrThrow(dialogProvider, addon_key) {
      if (!dialogProvider.isActiveDialog(addon_key)) {
        throw new Error('Failed to find an active dialog for: ' + addon_key);
      }
    };

    return DialogUtils;
  }();

  var dialogUtilsInstance = new DialogUtils();

  var IframeActions = {
    notifyIframeCreated: function notifyIframeCreated($el, extension) {
      EventDispatcher$1.dispatch('iframe-create', {
        $el: $el,
        extension: extension
      });
    },
    notifyBridgeEstablished: function notifyBridgeEstablished($el, extension) {
      EventDispatcher$1.dispatch('iframe-bridge-established', {
        $el: $el,
        extension: extension
      });
    },
    notifyIframeDestroyed: function notifyIframeDestroyed(filter) {
      if (typeof filter === 'string') {
        filter = {
          id: filter
        };
      }

      var extensions = host.getExtensions(filter);
      extensions.forEach(function (extension) {
        EventDispatcher$1.dispatch('iframe-destroyed', {
          extension: extension
        });
        host.unregisterExtension({
          id: extension.extension_id
        });
      }, this);
    },
    notifyUnloaded: function notifyUnloaded($el, extension) {
      EventDispatcher$1.dispatch('iframe-unload', {
        $el: $el,
        extension: extension
      });
    }
  };

  var strictUriEncode = function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  };

  function encoderForArrayFormat(opts) {
  	switch (opts.arrayFormat) {
  		case 'index':
  			return function (key, value, index) {
  				return value === null ? [
  					encode(key, opts),
  					'[',
  					index,
  					']'
  				].join('') : [
  					encode(key, opts),
  					'[',
  					encode(index, opts),
  					']=',
  					encode(value, opts)
  				].join('');
  			};

  		case 'bracket':
  			return function (key, value) {
  				return value === null ? encode(key, opts) : [
  					encode(key, opts),
  					'[]=',
  					encode(value, opts)
  				].join('');
  			};

  		default:
  			return function (key, value) {
  				return value === null ? encode(key, opts) : [
  					encode(key, opts),
  					'=',
  					encode(value, opts)
  				].join('');
  			};
  	}
  }

  function parserForArrayFormat(opts) {
  	var result;

  	switch (opts.arrayFormat) {
  		case 'index':
  			return function (key, value, accumulator) {
  				result = /\[(\d*)\]$/.exec(key);

  				key = key.replace(/\[\d*\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}

  				if (accumulator[key] === undefined) {
  					accumulator[key] = {};
  				}

  				accumulator[key][result[1]] = value;
  			};

  		case 'bracket':
  			return function (key, value, accumulator) {
  				result = /(\[\])$/.exec(key);
  				key = key.replace(/\[\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				} else if (accumulator[key] === undefined) {
  					accumulator[key] = [value];
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};

  		default:
  			return function (key, value, accumulator) {
  				if (accumulator[key] === undefined) {
  					accumulator[key] = value;
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};
  	}
  }

  function encode(value, opts) {
  	if (opts.encode) {
  		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
  	}

  	return value;
  }

  function keysSorter(input) {
  	if (Array.isArray(input)) {
  		return input.sort();
  	} else if (typeof input === 'object') {
  		return keysSorter(Object.keys(input)).sort(function (a, b) {
  			return Number(a) - Number(b);
  		}).map(function (key) {
  			return input[key];
  		});
  	}

  	return input;
  }

  var extract = function (str) {
  	return str.split('?')[1] || '';
  };

  var parse = function (str, opts) {
  	opts = objectAssign({arrayFormat: 'none'}, opts);

  	var formatter = parserForArrayFormat(opts);

  	// Create an object with no prototype
  	// https://github.com/sindresorhus/query-string/issues/47
  	var ret = Object.create(null);

  	if (typeof str !== 'string') {
  		return ret;
  	}

  	str = str.trim().replace(/^(\?|#|&)/, '');

  	if (!str) {
  		return ret;
  	}

  	str.split('&').forEach(function (param) {
  		var parts = param.replace(/\+/g, ' ').split('=');
  		// Firefox (pre 40) decodes `%3D` to `=`
  		// https://github.com/sindresorhus/query-string/pull/37
  		var key = parts.shift();
  		var val = parts.length > 0 ? parts.join('=') : undefined;

  		// missing `=` should be `null`:
  		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
  		val = val === undefined ? null : decodeURIComponent(val);

  		formatter(decodeURIComponent(key), val, ret);
  	});

  	return Object.keys(ret).sort().reduce(function (result, key) {
  		var val = ret[key];
  		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
  			// Sort object keys, not values
  			result[key] = keysSorter(val);
  		} else {
  			result[key] = val;
  		}

  		return result;
  	}, Object.create(null));
  };

  var stringify = function (obj, opts) {
  	var defaults = {
  		encode: true,
  		strict: true,
  		arrayFormat: 'none'
  	};

  	opts = objectAssign(defaults, opts);

  	var formatter = encoderForArrayFormat(opts);

  	return obj ? Object.keys(obj).sort().map(function (key) {
  		var val = obj[key];

  		if (val === undefined) {
  			return '';
  		}

  		if (val === null) {
  			return encode(key, opts);
  		}

  		if (Array.isArray(val)) {
  			var result = [];

  			val.slice().forEach(function (val2) {
  				if (val2 === undefined) {
  					return;
  				}

  				result.push(formatter(key, val2, result.length));
  			});

  			return result.join('&');
  		}

  		return encode(key, opts) + '=' + encode(val, opts);
  	}).filter(function (x) {
  		return x.length > 0;
  	}).join('&') : '';
  };

  var queryString = {
  	extract: extract,
  	parse: parse,
  	stringify: stringify
  };

  var toByteArray_1 = toByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  } // Support decoding URL-safe base64 strings, as Node.js does.
  // See: https://en.wikipedia.org/wiki/Base64#URL_applications


  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;

  function getLens(b64) {
    var len = b64.length;

    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4');
    } // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42


    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  } // base64 is 4/3 + up to two characters of the original data

  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }

  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

    for (var i = 0; i < len; i += 4) {
      tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
      arr[curByte++] = tmp >> 16 & 0xFF;
      arr[curByte++] = tmp >> 8 & 0xFF;
      arr[curByte++] = tmp & 0xFF;
    }

    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
      arr[curByte++] = tmp & 0xFF;
    }

    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 0xFF;
      arr[curByte++] = tmp & 0xFF;
    }

    return arr;
  }

  var textEncoderLite = createCommonjsModule(function (module) {
  function TextEncoderLite() {}

  function TextDecoderLite() {}

  (function () {
    // Thanks Feross et al! :-)

    function utf8ToBytes(string, units) {
      units = units || Infinity;
      var codePoint;
      var length = string.length;
      var leadSurrogate = null;
      var bytes = [];
      var i = 0;

      for (; i < length; i++) {
        codePoint = string.charCodeAt(i); // is surrogate component

        if (codePoint > 0xD7FF && codePoint < 0xE000) {
          // last char was a lead
          if (leadSurrogate) {
            // 2 leads in a row
            if (codePoint < 0xDC00) {
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              leadSurrogate = codePoint;
              continue;
            } else {
              // valid surrogate pair
              codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000;
              leadSurrogate = null;
            }
          } else {
            // no lead yet
            if (codePoint > 0xDBFF) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue;
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue;
            } else {
              // valid lead
              leadSurrogate = codePoint;
              continue;
            }
          }
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          leadSurrogate = null;
        } // encode utf8


        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break;
          bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break;
          bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x200000) {
          if ((units -= 4) < 0) break;
          bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else {
          throw new Error('Invalid code point');
        }
      }

      return bytes;
    }

    function utf8Slice(buf, start, end) {
      var res = '';
      var tmp = '';
      end = Math.min(buf.length, end || Infinity);
      start = start || 0;

      for (var i = start; i < end; i++) {
        if (buf[i] <= 0x7F) {
          res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
          tmp = '';
        } else {
          tmp += '%' + buf[i].toString(16);
        }
      }

      return res + decodeUtf8Char(tmp);
    }

    function decodeUtf8Char(str) {
      try {
        return decodeURIComponent(str);
      } catch (err) {
        return String.fromCharCode(0xFFFD); // UTF 8 invalid char
      }
    }

    TextEncoderLite.prototype.encode = function (str) {
      var result;

      if ('undefined' === typeof Uint8Array) {
        result = utf8ToBytes(str);
      } else {
        result = new Uint8Array(utf8ToBytes(str));
      }

      return result;
    };

    TextDecoderLite.prototype.decode = function (bytes) {
      return utf8Slice(bytes, 0, bytes.length);
    };
  })();

  if (module) {
    module.exports.TextDecoderLite = TextDecoderLite;
    module.exports.TextEncoderLite = TextEncoderLite;
  }
  });
  var textEncoderLite_1 = textEncoderLite.TextDecoderLite;
  var textEncoderLite_2 = textEncoderLite.TextEncoderLite;

  function decode(string) {
    var padding = 4 - string.length % 4;

    if (padding === 1) {
      string += '=';
    } else if (padding === 2) {
      string += '==';
    }

    return textEncoderLite_1.prototype.decode(toByteArray_1(string));
  }

  var JWT_SKEW = 60; // in seconds.

  function parseJwtIssuer(jwt) {
    return parseJwtClaims(jwt)['iss'];
  }

  function parseJwtClaims(jwt) {
    if (null === jwt || '' === jwt) {
      throw 'Invalid JWT: must be neither null nor empty-string.';
    }

    var firstPeriodIndex = jwt.indexOf('.');
    var secondPeriodIndex = jwt.indexOf('.', firstPeriodIndex + 1);

    if (firstPeriodIndex < 0 || secondPeriodIndex <= firstPeriodIndex) {
      throw 'Invalid JWT: must contain 2 period (".") characters.';
    }

    var encodedClaims = jwt.substring(firstPeriodIndex + 1, secondPeriodIndex);

    if (null === encodedClaims || '' === encodedClaims) {
      throw 'Invalid JWT: encoded claims must be neither null nor empty-string.';
    }

    var claimsString = decode.call(window, encodedClaims);
    return JSON.parse(claimsString);
  }

  function isJwtExpired(jwtString, skew) {
    if (skew === undefined) {
      skew = JWT_SKEW;
    }

    var claims = parseJwtClaims(jwtString);
    var expires = 0;
    var now = Math.floor(Date.now() / 1000); // UTC timestamp now

    if (claims && claims.exp) {
      expires = claims.exp;
    }

    if (expires - skew < now) {
      return true;
    }

    return false;
  }

  EventDispatcher$1.register('jwt-skew-set', function (data) {
    JWT_SKEW = data.skew;
  });
  var jwtUtil = {
    parseJwtIssuer: parseJwtIssuer,
    parseJwtClaims: parseJwtClaims,
    isJwtExpired: isJwtExpired
  };

  function isJwtExpired$1(urlStr) {
    var jwtStr = _getJwt(urlStr);

    return jwtUtil.isJwtExpired(jwtStr);
  }

  function _getJwt(urlStr) {
    var query = queryString.parse(queryString.extract(urlStr));
    return query['jwt'];
  }

  function hasJwt(url) {
    var jwt = _getJwt(url);

    return jwt && _getJwt(url).length !== 0;
  }

  var urlUtils = {
    hasJwt: hasJwt,
    isJwtExpired: isJwtExpired$1
  };

  var jwtActions = {
    registerContentResolver: function registerContentResolver(data) {
      EventDispatcher$1.dispatch('content-resolver-register-by-extension', data);
    },
    requestRefreshUrl: function requestRefreshUrl(data) {
      if (!data.resolver) {
        throw Error('ACJS: No content resolver supplied');
      }

      var promise = data.resolver.call(null, Util.extend({
        classifier: 'json'
      }, data.extension));
      promise.fail(function (promiseData, error) {
        EventDispatcher$1.dispatch('jwt-url-refreshed-failed', {
          extension: data.extension,
          $container: data.$container,
          errorText: error.text
        });
      });
      promise.done(function (promiseData) {
        var newExtensionConfiguration = {};

        if (typeof promiseData === 'object') {
          newExtensionConfiguration = promiseData;
        } else if (typeof promiseData === 'string') {
          try {
            newExtensionConfiguration = JSON.parse(promiseData);
          } catch (e) {
            console.error('ACJS: invalid response from content resolver');
          }
        }

        data.extension.url = newExtensionConfiguration.url;
        Util.extend(data.extension.options, newExtensionConfiguration.options);
        EventDispatcher$1.dispatch('jwt-url-refreshed', {
          extension: data.extension,
          $container: data.$container,
          url: data.extension.url
        });
      });
      EventDispatcher$1.dispatch('jwt-url-refresh-request', {
        data: data
      });
    },
    setClockSkew: function setClockSkew(skew) {
      if (typeof skew === 'number') {
        EventDispatcher$1.dispatch('jwt-skew-set', {
          skew: skew
        });
      } else {
        console.error('ACJS: invalid JWT clock skew set');
      }
    }
  };

  var iframeUtils = {
    optionsToAttributes: function optionsToAttributes(options) {
      var sanitized = {};

      if (options && typeof options === 'object') {
        if (options.width) {
          sanitized.width = Util.stringToDimension(options.width);
        }

        if (options.height) {
          sanitized.height = Util.stringToDimension(options.height);
        }

        if (typeof options.sandbox === 'string') {
          sanitized.sandbox = options.sandbox; // No Firefox support: allow-top-navigation-by-user-activation
          // https://bugzilla.mozilla.org/show_bug.cgi?id=1359867

          if (window.navigator.userAgent.indexOf('Firefox') !== -1) {
            sanitized.sandbox = sanitized.sandbox.replace('allow-top-navigation-by-user-activation', 'allow-top-navigation');
          }
        }
      }

      return sanitized;
    }
  };

  var ExtensionConfigurationOptionsStore =
  /*#__PURE__*/
  function () {
    function ExtensionConfigurationOptionsStore() {
      this.store = {};
    }

    var _proto = ExtensionConfigurationOptionsStore.prototype;

    _proto.set = function set(obj, val) {
      if (val) {
        var toSet = {};
        toSet[obj] = val;
      } else {
        toSet = obj;
      }

      Util.extend(this.store, toSet);
    };

    _proto.get = function get(key) {
      if (key) {
        return this.store[key];
      }

      return Util.extend({}, this.store); //clone
    };

    return ExtensionConfigurationOptionsStore;
  }();

  var ExtensionConfigurationOptionsStore$1 = new ExtensionConfigurationOptionsStore();

  function createSimpleXdmExtension(extension) {
    var extensionConfig = extensionConfigSanitizer(extension);
    var systemExtensionConfigOptions = ExtensionConfigurationOptionsStore$1.get();
    extension.options = extensionConfig.options = Util.extend({}, extensionConfig.options);
    extension.options.globalOptions = systemExtensionConfigOptions;
    var iframeAttributes = host.create(extensionConfig, function () {
      if (!extension.options.noDOM) {
        extension.$el = $(document.getElementById(extension.id));
      }

      IframeActions.notifyBridgeEstablished(extension.$el, extension);
    }, function () {
      IframeActions.notifyUnloaded(extension.$el, extension);
    }); // HostApi destroy is relying on previous behaviour of the
    // iframe component wherein it would call simpleXDM.create(extension)
    // and then mutate the extension object with the id returned from the
    // iframeAttributes see changes made in ACJS-760 and ACJS-807

    extensionConfig.id = iframeAttributes.id;
    extension.id = iframeAttributes.id;
    Util.extend(iframeAttributes, iframeUtils.optionsToAttributes(extension.options));
    return {
      iframeAttributes: iframeAttributes,
      extension: extension
    };
  }

  function extensionConfigSanitizer(extension) {
    return {
      addon_key: extension.addon_key,
      key: extension.key,
      url: extension.url,
      options: extension.options
    };
  }

  var simpleXdmUtils = {
    createSimpleXdmExtension: createSimpleXdmExtension,
    extensionConfigSanitizer: extensionConfigSanitizer
  };

  var Iframe =
  /*#__PURE__*/
  function () {
    function Iframe() {
      this._contentResolver = false;
    }

    var _proto = Iframe.prototype;

    _proto.setContentResolver = function setContentResolver(callback) {
      this._contentResolver = callback;
    };

    _proto.resize = function resize(width, height, $el) {
      width = Util.stringToDimension(width);
      height = Util.stringToDimension(height);
      $el.css({
        width: width,
        height: height
      });
      $el.trigger('resized', {
        width: width,
        height: height
      });
    };

    _proto.simpleXdmExtension = function simpleXdmExtension(extension, $container) {
      if (!extension.url || urlUtils.hasJwt(extension.url) && urlUtils.isJwtExpired(extension.url)) {
        if (this._contentResolver) {
          jwtActions.requestRefreshUrl({
            extension: extension,
            resolver: this._contentResolver,
            $container: $container
          });
        } else {
          console.error('JWT is expired and no content resolver was specified');
        }
      } else {
        this._appendExtension($container, this._simpleXdmCreate(extension));
      }
    };

    _proto._simpleXdmCreate = function _simpleXdmCreate(extension) {
      var simpleXdmAttributes = simpleXdmUtils.createSimpleXdmExtension(extension);
      extension.id = simpleXdmAttributes.iframeAttributes.id;
      extension.$el = this.render(simpleXdmAttributes.iframeAttributes);
      return extension;
    };

    _proto._appendExtension = function _appendExtension($container, extension) {
      var existingFrame = $container.find('iframe');

      if (existingFrame.length > 0) {
        existingFrame.destroy();
      }

      if (extension.options.hideIframeUntilLoad) {
        extension.$el.css({
          visibility: 'hidden'
        }).load(function () {
          extension.$el.css({
            visibility: ''
          });
        });
      }

      $container.prepend(extension.$el);
      IframeActions.notifyIframeCreated(extension.$el, extension);
    };

    _proto._appendExtensionError = function _appendExtensionError($container, text) {
      var $error = $('<div class="connect-resolve-error"></div>');
      var $additionalText = $('<p />').text(text);
      $error.append('<p class="error">Error: The content resolver threw the following error:</p>');
      $error.append($additionalText);
      $container.prepend($error);
    };

    _proto.resolverResponse = function resolverResponse(data) {
      var simpleExtension = this._simpleXdmCreate(data.extension);

      this._appendExtension(data.$container, simpleExtension);
    };

    _proto.resolverFailResponse = function resolverFailResponse(data) {
      this._appendExtensionError(data.$container, data.errorText);
    };

    _proto.render = function render(attributes) {
      attributes = attributes || {};
      attributes.referrerpolicy = 'no-referrer';
      return $('<iframe />').attr(attributes).addClass('ap-iframe');
    };

    return Iframe;
  }();

  var IframeComponent = new Iframe();
  EventDispatcher$1.register('iframe-resize', function (data) {
    IframeComponent.resize(data.width, data.height, data.$el);
  });
  EventDispatcher$1.register('content-resolver-register-by-extension', function (data) {
    IframeComponent.setContentResolver(data.callback);
  });
  EventDispatcher$1.register('jwt-url-refreshed', function (data) {
    IframeComponent.resolverResponse(data);
  });
  EventDispatcher$1.register('jwt-url-refreshed-failed', function (data) {
    IframeComponent.resolverFailResponse(data);
  });
  EventDispatcher$1.register('after:iframe-bridge-established', function (data) {
    if (!data.extension.options.noDom) {
      data.$el[0].bridgeEstablished = true;
    } else {
      data.extension.options.bridgeEstablished = true;
    }
  });

  var ButtonActions = {
    clicked: function clicked($el) {
      EventDispatcher$1.dispatch('button-clicked', {
        $el: $el
      });
    },
    toggle: function toggle($el, disabled) {
      EventDispatcher$1.dispatch('button-toggle', {
        $el: $el,
        disabled: disabled
      });
    },
    toggleVisibility: function toggleVisibility($el, hidden) {
      EventDispatcher$1.dispatch('button-toggle-visibility', {
        $el: $el,
        hidden: hidden
      });
    }
  };

  var BUTTON_TYPES = ['primary', 'link', 'secondary'];
  var buttonId = 0;

  var Button =
  /*#__PURE__*/
  function () {
    function Button() {
      this.AP_BUTTON_CLASS = 'ap-aui-button';
    }

    var _proto = Button.prototype;

    _proto.setType = function setType($button, type) {
      if (type && BUTTON_TYPES.indexOf(type) >= 0) {
        $button.addClass('aui-button-' + type);
      }

      return $button;
    };

    _proto.setDisabled = function setDisabled($button, disabled) {
      if (typeof disabled !== 'undefined' && !$button.data('immutable')) {
        $button.attr('aria-disabled', disabled);
      }

      return $button;
    };

    _proto.setHidden = function setHidden($button, hidden) {
      if (typeof hidden !== 'undefined' && !$button.data('immutable')) {
        $button.toggle(!hidden);
      }

      return $button;
    };

    _proto._setId = function _setId($button, id) {
      if (!id) {
        id = 'ap-button-' + buttonId;
        buttonId++;
      }

      $button.attr('id', id);
      return $button;
    };

    _proto._additionalClasses = function _additionalClasses($button, classes) {
      if (classes) {
        if (typeof classes !== 'string') {
          classes = classes.join(' ');
        }

        $button.addClass(classes);
      }

      return $button;
    };

    _proto.getName = function getName($button) {
      return $($button).data('name');
    };

    _proto.getText = function getText($button) {
      return $($button).text();
    };

    _proto.getIdentifier = function getIdentifier($button) {
      return $($button).data('identifier');
    };

    _proto.isVisible = function isVisible($button) {
      return $($button).is(':visible');
    };

    _proto.isEnabled = function isEnabled($button) {
      return !($($button).attr('aria-disabled') === 'true');
    };

    _proto.render = function render(options) {
      var $button = $('<button />');
      options = options || {};
      $button.addClass('aui-button ' + this.AP_BUTTON_CLASS);
      $button.text(options.text);
      $button.data(options.data);
      $button.data({
        name: options.name || options.identifier,
        identifier: options.identifier || buttonUtilsInstance.randomIdentifier(),
        immutable: options.immutable || false
      });

      this._additionalClasses($button, options.additionalClasses);

      this.setType($button, options.type);
      this.setDisabled($button, options.disabled || false);

      this._setId($button, options.id);

      return $button;
    };

    return Button;
  }();

  var ButtonComponent = new Button(); // register 1 button listener globally on dom load

  $(function () {
    $('body').on('click', '.' + ButtonComponent.AP_BUTTON_CLASS, function (e) {
      var $button = $(e.target).closest('.' + ButtonComponent.AP_BUTTON_CLASS);

      if ($button.attr('aria-disabled') !== 'true') {
        ButtonActions.clicked($button);
      }
    });
  });
  EventDispatcher$1.register('button-toggle', function (data) {
    ButtonComponent.setDisabled(data.$el, data.disabled);
  });
  EventDispatcher$1.register('button-toggle-visibility', function (data) {
    ButtonComponent.setHidden(data.$el, data.hidden);
  });

  var CONTAINER_CLASSES = ['ap-iframe-container'];

  var IframeContainer =
  /*#__PURE__*/
  function () {
    function IframeContainer() {}

    var _proto = IframeContainer.prototype;

    _proto.createExtension = function createExtension(extension, options) {
      var $container = this._renderContainer();

      if (!options || options.loadingIndicator !== false) {
        $container.append(this._renderLoadingIndicator());
      }

      IframeComponent.simpleXdmExtension(extension, $container);
      return $container;
    };

    _proto._renderContainer = function _renderContainer(attributes) {
      var container = $('<div />').attr(attributes || {});
      container.addClass(CONTAINER_CLASSES.join(' '));
      return container;
    };

    _proto._renderLoadingIndicator = function _renderLoadingIndicator() {
      return LoadingComponent.render();
    };

    return IframeContainer;
  }();

  var IframeContainerComponent = new IframeContainer();
  EventDispatcher$1.register('iframe-create', function (data) {
    var id = 'embedded-' + data.extension.id;
    data.extension.$el.parents('.ap-iframe-container').attr('id', id);
  });

  function create(extension) {
    return IframeContainerComponent.createExtension(extension);
  }

  var ModuleActions = {
    defineCustomModule: function defineCustomModule(name, methods) {
      var data = {};

      if (!methods) {
        data.methods = name;
      } else {
        data.methods = methods;
        data.name = name;
      }

      EventDispatcher$1.dispatch('module-define-custom', data);
    }
  };

  var AnalyticsAction = {
    trackDeprecatedMethodUsed: function trackDeprecatedMethodUsed(methodUsed, extension) {
      EventDispatcher$1.dispatch('analytics-deprecated-method-used', {
        methodUsed: methodUsed,
        extension: extension
      });
    },
    trackIframeBridgeStart: function trackIframeBridgeStart(extension) {
      EventDispatcher$1.dispatch('iframe-bridge-start', {
        extension: extension
      });
    },
    trackExternalEvent: function trackExternalEvent(name, values) {
      EventDispatcher$1.dispatch('analytics-external-event-track', {
        eventName: name,
        values: values
      });
    }
  };

  function sanitizeTriggers(triggers) {
    var onTriggers;

    if (Array.isArray(triggers)) {
      onTriggers = triggers.join(' ');
    } else if (typeof triggers === 'string') {
      onTriggers = triggers.trim();
    }

    return onTriggers;
  }

  function uniqueId() {
    return 'webitem-' + Math.floor(Math.random() * 1000000000).toString(16);
  } // LEGACY: get addon key by webitem for p2


  function getExtensionKey($target) {
    var cssClass = $target.attr('class');
    var m = cssClass ? cssClass.match(/ap-plugin-key-([^\s]*)/) : null;
    return Array.isArray(m) ? m[1] : false;
  } // LEGACY: get module key by webitem for p2


  function getKey($target) {
    var cssClass = $target.attr('class');
    var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
    return Array.isArray(m) ? m[1] : false;
  }

  function getTargetKey($target) {
    var cssClass = $target.attr('class');
    var m = cssClass ? cssClass.match(/ap-target-key-([^\s]*)/) : null;
    return Array.isArray(m) ? m[1] : false;
  }

  function getFullKey($target) {
    return getExtensionKey($target) + '__' + getKey($target);
  }

  function getModuleOptionsByAddonAndModuleKey(type, addonKey, moduleKey) {
    var moduleType = type + 'Modules';

    if (window._AP && window._AP[moduleType] && window._AP[moduleType][addonKey] && window._AP[moduleType][addonKey][moduleKey]) {
      return Util.extend({}, window._AP[moduleType][addonKey][moduleKey].options);
    }
  }

  function getModuleOptionsForWebitem(type, $target) {
    var addon_key = getExtensionKey($target);
    var targetKey = getTargetKey($target);
    return getModuleOptionsByAddonAndModuleKey(type, addon_key, targetKey);
  } //gets the connect config from the encoded webitem target (via the url)


  function getConfigFromTarget($target) {
    var url = $target.attr('href');
    var convertedOptions = {};
    var iframeData; // adg3 has classes outside of a tag so look for href inside the a

    if (!url) {
      url = $target.find('a').attr('href');
    }

    if (url) {
      var hashIndex = url.indexOf('#');

      if (hashIndex >= 0) {
        var hash = url.substring(hashIndex + 1);

        try {
          iframeData = JSON.parse(decodeURI(hash));
        } catch (e) {
          console.error('ACJS: cannot decode webitem anchor');
        }

        if (iframeData && window._AP && window._AP._convertConnectOptions) {
          convertedOptions = window._AP._convertConnectOptions(iframeData);
        } else {
          console.error('ACJS: cannot convert webitem url to connect iframe options');
        }
      } else {
        // The URL has no hash component so fall back to the old behaviour of providing:
        // add-on key, module key, dialog module options and product context (from the webitem url).
        // This may be the case for web items that were persisted prior to the new storage format whereby a hash
        // fragment is added into the URL detailing the target module info. If this info is
        // not present, the content resolver will be used to resolve the module after the web
        // item is clicked.
        // Old URL format detected. Falling back to old functionality
        var fullKey = getFullKey($target);
        var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
        var options = getModuleOptionsForWebitem(type, $target);

        if (!options && window._AP && window._AP[type + 'Options']) {
          options = Util.extend({}, window._AP[type + 'Options'][fullKey]) || {};
        }

        if (!options) {
          options = {};
          console.warn('no webitem ' + type + 'Options for ' + fullKey);
        }

        options.productContext = options.productContext || {};
        var query = queryString.parse(queryString.extract(url));
        Util.extend(options.productContext, query);
        convertedOptions = {
          addon_key: getExtensionKey($target),
          key: getKey($target),
          options: options
        };
      }
    }

    return convertedOptions;
  } // LEGACY - method for handling webitem options for p2


  function getOptionsForWebItem($target) {
    var fullKey = getFullKey($target);
    var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
    var options = getModuleOptionsForWebitem(type, $target);

    if (!options && window._AP && window._AP[type + 'Options']) {
      options = Util.extend({}, window._AP[type + 'Options'][fullKey]) || {};
    }

    if (!options) {
      options = {};
      console.warn('no webitem ' + type + 'Options for ' + fullKey);
    }

    options.productContext = options.productContext || {};
    options.structuredContext = options.structuredContext || {}; // create product context from url params

    var convertedConfig = getConfigFromTarget($target);

    if (convertedConfig && convertedConfig.options) {
      Util.extend(options.productContext, convertedConfig.options.productContext);
      Util.extend(options.structuredContext, convertedConfig.options.structuredContext);
      options.contextJwt = convertedConfig.options.contextJwt;
    }

    return options;
  }

  var WebItemUtils = {
    sanitizeTriggers: sanitizeTriggers,
    uniqueId: uniqueId,
    getExtensionKey: getExtensionKey,
    getKey: getKey,
    getOptionsForWebItem: getOptionsForWebItem,
    getModuleOptionsByAddonAndModuleKey: getModuleOptionsByAddonAndModuleKey,
    getConfigFromTarget: getConfigFromTarget
  };

  var ModuleProviders = function ModuleProviders() {
    var _this = this;

    this._providers = {};

    this.registerProvider = function (name, provider) {
      _this._providers[name] = provider;
    };

    this.getProvider = function (name) {
      return _this._providers[name];
    };
  };

  var ModuleProviders$1 = new ModuleProviders();

  // This is essentially a copy of the ACJSFrameworkAdaptor/BaseFrameworkAdaptor implementation generated
  // by compiling the connect-module-core typescript implementations of the equivalent classes.

  /**
   * This class provides common behaviour relating to the adaption of functionality to a
   * particular Connect client framework. This is necessary for an interim period during which
   * we have multiple Connect client frameworks that we need to support: ACJS and CaaS Client.
   */
  var ACJSFrameworkAdaptor = function () {
    function ACJSFrameworkAdaptor() {
      this.moduleNamesToModules = new Map();
    }
    /**
     * This method registers a module with the Connect client framework relating to this adaptor instance.
     * @param moduleDefinition the definition of the module.
     */


    ACJSFrameworkAdaptor.prototype.registerModule = function (module, props) {
      var moduleRegistrationName = module.getModuleRegistrationName();
      this.moduleNamesToModules.set(moduleRegistrationName, module); // This adaptor implementation doesn't need to register the SimpleXDM definition so the following is
      // commented out.
      //
      // var simpleXdmDefinition = module.getSimpleXdmDefinition(props);
      // this.registerModuleWithHost(moduleRegistrationName, simpleXdmDefinition);
    };

    ACJSFrameworkAdaptor.prototype.getModuleByName = function (moduleName) {
      return this.moduleNamesToModules.get(moduleName);
    };

    ACJSFrameworkAdaptor.prototype.getProviderByModuleName = function (moduleName) {
      var module = this.moduleNamesToModules.get(moduleName);

      if (module && module.isEnabled()) {
        return module.getProvider();
      } else {
        return undefined;
      }
    };

    return ACJSFrameworkAdaptor;
  }();

  var acjsFrameworkAdaptor = new ACJSFrameworkAdaptor();

  var HostApi =
  /*#__PURE__*/
  function () {
    function HostApi() {
      var _this = this;

      this.create = function (extension) {
        return create(simpleXdmUtils.extensionConfigSanitizer(extension));
      };

      this.dialog = {
        create: function create(extension, dialogOptions) {
          var dialogBeanOptions = WebItemUtils.getModuleOptionsByAddonAndModuleKey('dialog', extension.addon_key, extension.key);
          var completeOptions = Util.extend({}, dialogBeanOptions || {}, dialogOptions);
          DialogExtensionActions.open(extension, completeOptions);
        },
        close: function close(addon_key, closeData) {
          var frameworkAdaptor = _this.getFrameworkAdaptor();

          var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

          if (dialogProvider) {
            dialogUtilsInstance.assertActiveDialogOrThrow(dialogProvider, addon_key);
            EventActions.broadcast('dialog.close', {
              addon_key: addon_key
            }, closeData);
            dialogProvider.close();
          } else {
            DialogExtensionActions.close();
          }
        }
      };
      this.registerContentResolver = {
        resolveByExtension: function resolveByExtension(callback) {
          _this._contentResolver = callback;
          jwtActions.registerContentResolver({
            callback: callback
          });
        }
      };

      this.getContentResolver = function () {
        return _this._contentResolver;
      };

      this.registerProvider = function (componentName, component) {
        ModuleProviders$1.registerProvider(componentName, component);
      };

      this.getProvider = function (componentName) {
        return ModuleProviders$1.getProvider(componentName);
      }; // We are attaching an instance of ACJSAdaptor to the host so that products are able
      // to retrieve the identical instance of ACJSAdaptor that ACJS is using.
      // The product can override the framework adaptor by calling setFrameworkAdaptor().


      this.frameworkAdaptor = acjsFrameworkAdaptor;
    }
    /**
    * creates an extension
    * returns an object with extension and iframe attributes
    * designed for use with non DOM implementations such as react.
    */


    var _proto = HostApi.prototype;

    _proto.createExtension = function createExtension(extension) {
      extension.options = extension.options || {};
      extension.options.noDom = true;
      var createdExtension = simpleXdmUtils.createSimpleXdmExtension(extension);
      AnalyticsAction.trackIframeBridgeStart(createdExtension.extension);
      return createdExtension;
    }
    /**
     * The product is responsible for setting the framework adaptor.
     * @param frameworkAdaptor the framework adaptor to use.
     */
    ;

    _proto.setFrameworkAdaptor = function setFrameworkAdaptor(frameworkAdaptor) {
      this.frameworkAdaptor = frameworkAdaptor;
    };

    _proto.getFrameworkAdaptor = function getFrameworkAdaptor() {
      return this.frameworkAdaptor;
    };

    _proto._cleanExtension = function _cleanExtension(extension) {
      return Util.pick(extension, ['id', 'addon_key', 'key', 'options', 'url']);
    };

    _proto.onIframeEstablished = function onIframeEstablished(callback) {
      var wrapper = function wrapper(data) {
        callback.call({}, {
          $el: data.$el,
          extension: this._cleanExtension(data.extension)
        });
      };

      callback._wrapper = wrapper.bind(this);
      EventDispatcher$1.register('after:iframe-bridge-established', callback._wrapper);
    };

    _proto.offIframeEstablished = function offIframeEstablished(callback) {
      if (callback._wrapper) {
        EventDispatcher$1.unregister('after:iframe-bridge-established', callback._wrapper);
      } else {
        throw new Error('cannot unregister event dispatch listener without _wrapper reference');
      }
    };

    _proto.onIframeUnload = function onIframeUnload(callback) {
      var _this2 = this;

      EventDispatcher$1.register('after:iframe-unload', function (data) {
        callback.call({}, {
          $el: data.$el,
          extension: _this2._cleanExtension(data.extension)
        });
      });
    };

    _proto.onPublicEventDispatched = function onPublicEventDispatched(callback) {
      var wrapper = function wrapper(data) {
        callback.call({}, {
          type: data.type,
          event: data.event,
          extension: this._cleanExtension(data.sender)
        });
      };

      callback._wrapper = wrapper.bind(this);
      EventDispatcher$1.register('after:event-public-dispatch', callback._wrapper);
    };

    _proto.offPublicEventDispatched = function offPublicEventDispatched(callback) {
      if (callback._wrapper) {
        EventDispatcher$1.unregister('after:event-public-dispatch', callback._wrapper);
      } else {
        throw new Error('cannot unregister event dispatch listener without _wrapper reference');
      }
    };

    _proto.onKeyEvent = function onKeyEvent(extension_id, key, modifiers, callback) {
      DomEventActions.registerKeyEvent({
        extension_id: extension_id,
        key: key,
        modifiers: modifiers,
        callback: callback
      });
    };

    _proto.offKeyEvent = function offKeyEvent(extension_id, key, modifiers, callback) {
      DomEventActions.unregisterKeyEvent({
        extension_id: extension_id,
        key: key,
        modifiers: modifiers,
        callback: callback
      });
    };

    _proto.onFrameClick = function onFrameClick(handleIframeClick) {
      if (typeof handleIframeClick !== 'function') {
        throw new Error('handleIframeClick must be a function');
      }

      DomEventActions.registerClickHandler(handleIframeClick);
    };

    _proto.offFrameClick = function offFrameClick() {
      DomEventActions.unregisterClickHandler();
    };

    _proto.destroy = function destroy(extension_id) {
      IframeActions.notifyIframeDestroyed({
        id: extension_id
      });
    };

    _proto.defineModule = function defineModule(name, methods) {
      ModuleActions.defineCustomModule(name, methods);
    };

    _proto.broadcastEvent = function broadcastEvent(type, targetSpec, event) {
      EventActions.broadcast(type, targetSpec, event);
    };

    _proto.getExtensions = function getExtensions(filter) {
      return host.getExtensions(filter);
    };

    _proto.trackDeprecatedMethodUsed = function trackDeprecatedMethodUsed(methodUsed, extension) {
      AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, extension);
    };

    _proto.trackAnalyticsEvent = function trackAnalyticsEvent(name, values) {
      AnalyticsAction.trackExternalEvent(name, values);
    };

    _proto.setJwtClockSkew = function setJwtClockSkew(skew) {
      jwtActions.setClockSkew(skew);
    };

    _proto.isJwtExpired = function isJwtExpired(jwtString, tokenOnly) {
      if (tokenOnly) {
        return jwtUtil.isJwtExpired(jwtString);
      }

      return urlUtils.isJwtExpired(jwtString);
    };

    _proto.hasJwt = function hasJwt(url) {
      return urlUtils.hasJwt(url);
    } // set configuration option system wide for all extensions
    // can be either key,value or an object
    ;

    _proto.setExtensionConfigurationOptions = function setExtensionConfigurationOptions(obj, value) {
      ExtensionConfigurationOptionsStore$1.set(obj, value);
    };

    _proto.getExtensionConfigurationOption = function getExtensionConfigurationOption(val) {
      return ExtensionConfigurationOptionsStore$1.get(val);
    };

    return HostApi;
  }();

  var HostApi$1 = new HostApi();

  var DLGID_PREFIX = 'ap-dialog-';
  var DIALOG_CLASS = 'ap-aui-dialog2';
  var DLGID_REGEXP = new RegExp("^" + DLGID_PREFIX + "[0-9A-Za-z]+$");
  var DIALOG_SIZES = ['small', 'medium', 'large', 'xlarge', 'fullscreen', 'maximum'];
  var DIALOG_BUTTON_CLASS = 'ap-aui-dialog-button';
  var DIALOG_BUTTON_CUSTOM_CLASS = 'ap-dialog-custom-button';
  var DIALOG_FOOTER_CLASS = 'aui-dialog2-footer';
  var DIALOG_FOOTER_ACTIONS_CLASS = 'aui-dialog2-footer-actions';
  var DIALOG_HEADER_ACTIONS_CLASS = 'header-control-panel';

  function getActiveDialog() {
    var $el = AJS.LayerManager.global.getTopLayer();

    if ($el && DLGID_REGEXP.test($el.attr('id'))) {
      var dialog = AJS.dialog2($el);
      dialog._id = dialog.$el.attr('id').replace(DLGID_PREFIX, '');
      return dialog;
    }
  }

  function getActionBar($dialog) {
    var $actionBar = $dialog.find('.' + DIALOG_HEADER_ACTIONS_CLASS);

    if (!$actionBar.length) {
      $actionBar = $dialog.find('.' + DIALOG_FOOTER_ACTIONS_CLASS);
    }

    return $actionBar;
  }

  function getButtonByIdentifier(id, $dialog) {
    var $actionBar = getActionBar($dialog);
    return $actionBar.find('.aui-button').filter(function () {
      return ButtonComponent.getIdentifier(this) === id;
    });
  }

  var Dialog =
  /*#__PURE__*/
  function () {
    function Dialog() {}

    var _proto = Dialog.prototype;

    _proto._renderHeaderCloseBtn = function _renderHeaderCloseBtn() {
      var $close = $('<a />').addClass('aui-dialog2-header-close');
      var $closeBtn = $('<span />').addClass('aui-icon aui-icon-small aui-iconfont-close-dialog').text('Close');
      $close.append($closeBtn);
      return $close;
    } //v3 ask DT about this DOM.
    ;

    _proto._renderFullScreenHeader = function _renderFullScreenHeader($header, options) {
      var $titleContainer = $('<div />').addClass('header-title-container aui-item expanded');
      var $title = $('<div />').append($('<span />').addClass('header-title').text(options.header || ''));
      $titleContainer.append($title);
      $header.append($titleContainer).append(this._renderHeaderActions(options.actions, options.extension));
      return $header;
    };

    _proto._renderHeader = function _renderHeader(options) {
      var $header = $('<header />').addClass('aui-dialog2-header');

      if (options.size === 'fullscreen') {
        return this._renderFullScreenHeader($header, options);
      }

      if (options.header) {
        var $title = $('<h2 />').addClass('aui-dialog2-header-main').text(options.header);
        $header.append($title);
      }

      $header.append(this._renderHeaderCloseBtn());
      return $header;
    };

    _proto._renderHeaderActions = function _renderHeaderActions(actions, extension) {
      var $headerControls = $('<div />').addClass('aui-item ' + DIALOG_HEADER_ACTIONS_CLASS);
      actions[0].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-success'];
      actions[1].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-close-dialog'];

      var $actions = this._renderActionButtons(actions, extension);

      $actions.forEach(function ($action) {
        $headerControls.append($action);
      });
      return $headerControls;
    };

    _proto._renderContent = function _renderContent($content) {
      var $el = $('<div />').addClass('aui-dialog2-content');

      if ($content) {
        $el.append($content);
      }

      return $el;
    };

    _proto._renderFooter = function _renderFooter(options) {
      var $footer = $('<footer />').addClass(DIALOG_FOOTER_CLASS);

      if (options.size !== 'fullscreen') {
        var $actions = this._renderFooterActions(options.actions, options.extension);

        $footer.append($actions);
      }

      if (options.hint) {
        var $hint = $('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
        $footer.append($hint);
      }

      return $footer;
    };

    _proto._renderActionButtons = function _renderActionButtons(actions, extension) {
      var _this = this;

      var actionButtons = [];
      [].concat(actions).forEach(function (action) {
        actionButtons.push(_this._renderDialogButton({
          text: action.text,
          name: action.name,
          type: action.type,
          additionalClasses: action.additionalClasses,
          custom: action.custom || false,
          identifier: action.identifier,
          immutable: action.immutable,
          disabled: action.disabled || false
        }, extension));
      });
      return actionButtons;
    };

    _proto._renderFooterActions = function _renderFooterActions(actions, extension) {
      var $actions = $('<div />').addClass(DIALOG_FOOTER_ACTIONS_CLASS);

      var $buttons = this._renderActionButtons(actions, extension);

      $buttons.forEach(function ($button) {
        $actions.append($button);
      });
      return $actions;
    };

    _proto._renderDialogButton = function _renderDialogButton(options, extension) {
      options.additionalClasses = options.additionalClasses || [];
      options.additionalClasses.push(DIALOG_BUTTON_CLASS);

      if (options.custom) {
        options.additionalClasses.push(DIALOG_BUTTON_CUSTOM_CLASS);
      }

      var $button = ButtonComponent.render(options);
      $button.extension = extension;
      return $button;
    }
    /**
    {
      id: 'some-dialog-id',
      title: 'some header',
      hint: 'some footer hint',
      $content: $(<div />).text('my content'),
      actions: []
    }
    **/
    ;

    _proto.render = function render(options) {
      var originalOptions = Util.extend({}, options);
      var sanitizedOptions = dialogUtilsInstance.sanitizeOptions(options);
      var $dialog = $('<section />').attr({
        role: 'dialog',
        id: DLGID_PREFIX + sanitizedOptions.id
      });
      $dialog.attr('data-aui-modal', 'true');
      $dialog.data({
        'aui-remove-on-hide': true,
        'extension': sanitizedOptions.extension
      });
      $dialog.addClass('aui-layer aui-dialog2 ' + DIALOG_CLASS);

      if (DIALOG_SIZES.indexOf(sanitizedOptions.size) >= 0) {
        $dialog.addClass('aui-dialog2-' + sanitizedOptions.size);
      }

      if (sanitizedOptions.size === 'fullscreen' || sanitizedOptions.size === 'maximum') {
        if (sanitizedOptions.chrome) {
          $dialog.addClass('ap-header-controls');
        }

        $dialog.addClass('aui-dialog2-maximum');
      }

      $dialog.append(this._renderContent(sanitizedOptions.$content));

      if (sanitizedOptions.chrome) {
        $dialog.prepend(this._renderHeader({
          header: sanitizedOptions.header,
          actions: sanitizedOptions.actions,
          size: sanitizedOptions.size
        }));
        $dialog.append(this._renderFooter({
          extension: sanitizedOptions.extension,
          actions: sanitizedOptions.actions,
          hint: sanitizedOptions.hint,
          size: sanitizedOptions.size
        }));
      } else {
        $dialog.addClass('aui-dialog2-chromeless');
      }

      var dialog = AJS.dialog2($dialog);
      dialog._id = sanitizedOptions.id;

      if (sanitizedOptions.size === 'fullscreen') {
        sanitizedOptions.height = sanitizedOptions.width = '100%';
      }

      if (!sanitizedOptions.size || sanitizedOptions.size === 'fullscreen') {
        AJS.layer($dialog).changeSize(sanitizedOptions.width, sanitizedOptions.height);
      }

      if (sanitizedOptions.onHide) {
        dialog.on('hide', sanitizedOptions.onHide);
      }

      dialog.show();
      dialog.$el.data('extension', sanitizedOptions.extension);
      dialog.$el.data('originalOptions', originalOptions);
      return $dialog;
    };

    _proto.setIframeDimensions = function setIframeDimensions($iframe) {
      IframeComponent.resize('100%', '100%', $iframe);
    };

    _proto.getActive = function getActive() {
      return getActiveDialog();
    };

    _proto.buttonIsEnabled = function buttonIsEnabled(identifier) {
      var dialog = getActiveDialog();

      if (dialog) {
        var $button = getButtonByIdentifier(identifier, dialog.$el);
        return ButtonComponent.isEnabled($button);
      }
    };

    _proto.buttonIsVisible = function buttonIsVisible(identifier) {
      var dialog = getActiveDialog();

      if (dialog) {
        var $button = getButtonByIdentifier(identifier, dialog.$el);
        return ButtonComponent.isVisible($button);
      }
    }
    /**
    * takes either a target spec or a filter function
    * returns all matching dialogs
    */
    ;

    _proto.getByExtension = function getByExtension(extension) {
      var filterFunction;

      if (typeof extension === 'function') {
        filterFunction = extension;
      } else {
        var keys = Object.getOwnPropertyNames(extension);

        filterFunction = function filterFunction(dialog) {
          var dialogData = $(dialog).data('extension');
          return keys.every(function (key) {
            return dialogData[key] === extension[key];
          });
        };
      }

      return $('.' + DIALOG_CLASS).toArray().filter(filterFunction).map(function ($el) {
        return AJS.dialog2($el);
      });
    } // add user defined button to an existing dialog
    ;

    _proto.addButton = function addButton(extension, options) {
      options.custom = true;

      var $button = this._renderDialogButton(options, extension);

      var $dialog = this.getByExtension({
        addon_key: extension.addon_key,
        key: extension.key
      })[0].$el;
      var $actionBar = getActionBar($dialog);
      $actionBar.append($button);
      return $dialog;
    };

    return Dialog;
  }();

  var DialogComponent = new Dialog();
  EventDispatcher$1.register('iframe-bridge-established', function (data) {
    if (data.extension.options.isDialog) {
      var callback;
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        callback = dialogProvider.close;
        dialogProvider.setButtonDisabled('submit', false);
      } else {
        DialogActions.toggleButton({
          identifier: 'submit',
          enabled: true
        });

        callback = function callback() {
          DialogActions.close({
            dialog: getActiveDialog(),
            extension: data.extension
          });
        };
      }

      if (!data.extension.options.preventDialogCloseOnEscape) {
        DomEventActions.registerKeyEvent({
          extension_id: data.extension.id,
          key: 27,
          callback: callback
        });
        EventDispatcher$1.registerOnce('dialog-close', function (d) {
          DomEventActions.unregisterKeyEvent({
            extension_id: data.extension.id,
            key: 27
          });
        });
      }
    }
  });
  EventDispatcher$1.register('dialog-close-active', function (data) {
    var activeDialog = getActiveDialog();

    if (activeDialog) {
      DialogActions.close({
        customData: data.customData,
        dialog: activeDialog,
        extension: data.extension
      });
    }
  });
  EventDispatcher$1.register('dialog-close', function (data) {
    if (data.dialog) {
      data.dialog.hide();
    }
  });
  EventDispatcher$1.register('dialog-button-toggle', function (data) {
    var dialog = getActiveDialog();

    if (dialog) {
      var $button = getButtonByIdentifier(data.identifier, dialog.$el);
      ButtonActions.toggle($button, !data.enabled);
    }
  });
  EventDispatcher$1.register('dialog-button-toggle-visibility', function (data) {
    var dialog = getActiveDialog();

    if (dialog) {
      var $button = getButtonByIdentifier(data.identifier, dialog.$el);
      ButtonActions.toggleVisibility($button, data.hidden);
    }
  });
  EventDispatcher$1.register('button-clicked', function (data) {
    var $button = data.$el;

    if ($button.hasClass(DIALOG_BUTTON_CLASS)) {
      var $dialog = $button.parents('.' + DIALOG_CLASS);
      var $iframe = $dialog.find('iframe');

      if ($iframe.length && $iframe[0].bridgeEstablished) {
        DialogActions.clickButton(ButtonComponent.getIdentifier($button), $button, $dialog.data('extension'));
      } else {
        DialogActions.close({
          dialog: getActiveDialog(),
          extension: $button.extension
        });
      }
    }
  });

  if ($.fn) {
    EventDispatcher$1.register('iframe-create', function (data) {
      if (data.extension.options && data.extension.options.isDialog) {
        DialogComponent.setIframeDimensions(data.extension.$el);
      }
    });
    EventDispatcher$1.register('dialog-button-add', function (data) {
      DialogComponent.addButton(data.extension, data.button);
    });
    EventDispatcher$1.register('host-window-resize', Util.debounce(function () {
      $('.' + DIALOG_CLASS).each(function (i, dialog) {
        var $dialog = $(dialog);
        var sanitizedOptions = dialogUtilsInstance.sanitizeOptions($dialog.data('originalOptions'));
        dialog.style.width = sanitizedOptions.width;
        dialog.style.height = sanitizedOptions.height;
      });
    }, 100));
  }

  DomEventActions.registerWindowKeyEvent({
    keyCode: 27,
    callback: function callback() {
      DialogActions.closeActive({
        customData: {},
        extension: null
      });
    }
  });

  var DialogExtension =
  /*#__PURE__*/
  function () {
    function DialogExtension() {}

    var _proto = DialogExtension.prototype;

    _proto.render = function render(extension, dialogOptions) {
      extension.options = extension.options || {};
      dialogOptions = dialogOptions || {};
      extension.options.isDialog = true;
      extension.options.dialogId = dialogOptions.id;
      extension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
      extension.options.hostFrameOffset = dialogOptions.hostFrameOffset;
      extension.options.hideIframeUntilLoad = true;
      var $iframeContainer = IframeContainerComponent.createExtension(extension);
      var $dialog = DialogComponent.render({
        extension: extension,
        $content: $iframeContainer,
        chrome: dialogOptions.chrome,
        width: dialogOptions.width,
        height: dialogOptions.height,
        size: dialogOptions.size,
        header: dialogOptions.header,
        hint: dialogOptions.hint,
        submitText: dialogOptions.submitText,
        cancelText: dialogOptions.cancelText,
        buttons: dialogOptions.buttons,
        onHide: dialogOptions.onHide
      });
      return $dialog;
    };

    _proto.getActiveDialog = function getActiveDialog() {
      return DialogComponent.getActive();
    };

    _proto.buttonIsEnabled = function buttonIsEnabled(identifier) {
      return DialogComponent.buttonIsEnabled(identifier);
    };

    _proto.buttonIsVisible = function buttonIsVisible(identifier) {
      return DialogComponent.buttonIsVisible(identifier);
    };

    _proto.getByExtension = function getByExtension(extension) {
      if (typeof extension === 'string') {
        extension = {
          id: extension
        };
      }

      return DialogComponent.getByExtension(extension);
    };

    return DialogExtension;
  }();

  var DialogExtensionComponent = new DialogExtension();
  EventDispatcher$1.register('dialog-extension-open', function (data) {
    var dialogExtension = data.extension;
    var dialogOptions = dialogUtilsInstance.sanitizeOptions(data.options);
    var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
    var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

    if (dialogProvider) {
      // this function should move.
      var getOnClickFunction = function getOnClickFunction(action) {
        var key = dialogExtension.key;
        var addon_key = dialogExtension.addon_key;
        var eventData = {
          button: {
            identifier: action.identifier,
            name: action.identifier,
            text: action.text
          }
        };

        if (['submit', 'cancel'].indexOf(action.identifier) >= 0) {
          EventActions.broadcast("dialog." + action.identifier, {
            addon_key: addon_key,
            key: key
          }, eventData);
        }

        EventActions.broadcast('dialog.button.click', {
          addon_key: addon_key,
          key: key
        }, eventData);
      };

      dialogExtension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
      dialogOptions.actions.map(function (action) {
        return action.onClick = getOnClickFunction.bind(null, action);
      });
      dialogProvider.create(dialogOptions, dialogExtension);
    } else {
      DialogExtensionComponent.render(data.extension, data.options);
    }
  });

  var _dialogs = {};
  EventDispatcher$1.register('dialog-close', function (data) {
    var dialog = data.dialog;

    if (dialog && data.extension) {
      EventActions.broadcast('dialog.close', {
        addon_key: data.extension.addon_key
      }, data.customData);
    }
  });
  EventDispatcher$1.register('dialog-button-click', function (data) {
    var eventData = {
      button: {
        name: ButtonComponent.getName(data.$el),
        identifier: ButtonComponent.getIdentifier(data.$el),
        text: ButtonComponent.getText(data.$el)
      }
    };
    var eventName = 'dialog.button.click';
    var buttonEventFilter = {
      addon_key: data.extension.addon_key,
      key: data.extension.key
    };

    if (window.AJS && window.AJS.DarkFeatures && window.AJS.DarkFeatures.isEnabled && window.AJS.DarkFeatures.isEnabled('connect.js.dialog.idfilter')) {
      buttonEventFilter.id = data.extension.id;
    } // Old buttons, (submit and cancel) use old events


    if (!data.$el.hasClass('ap-dialog-custom-button')) {
      EventActions.broadcast("dialog." + eventData.button.name, buttonEventFilter, eventData);
    }

    EventActions.broadcast(eventName, buttonEventFilter, eventData);
  });
  /**
   * @class Dialog~Dialog
   * @description A dialog object that is returned when a dialog is created using the [dialog module](module-Dialog.html).
   */

  var Dialog$1 = function Dialog(options, callback) {
    callback = Util.last(arguments);
    var _id = callback._id;
    var extension = callback._context.extension;
    var dialogExtension = {
      addon_key: extension.addon_key,
      key: options.key,
      options: Util.pick(extension.options, ['customData', 'productContext'])
    }; // ACJS-185: the following is a really bad idea but we need it
    // for compat until AP.dialog.customData has been deprecated

    dialogExtension.options.customData = options.customData; // terrible idea! - we need to remove this from p2 ASAP!

    var dialogModuleOptions = dialogUtilsInstance.moduleOptionsFromGlobal(dialogExtension.addon_key, dialogExtension.key); // There is a hostFrameOffset configuration available
    // for modals (window._AP.dialogOptions) and inline modals (window._AP.inlineDialogOptions)
    // which is taken into account during the iframe insertion (inside the dialog).
    // The change below injects hostFrameOffset value from the global module options (window._AP.dialogModules)
    // which is required for establishing a contact with a correct host (solves spa iframe problem).

    if (typeof (dialogModuleOptions || {}).hostFrameOffset === 'number') {
      dialogExtension.options.hostFrameOffset = dialogModuleOptions.hostFrameOffset;
    }

    options = Util.extend({}, dialogModuleOptions || {}, options);
    options.id = _id;
    dialogUtilsInstance.trackMultipleDialogOpening(dialogExtension, options);
    DialogExtensionActions.open(dialogExtension, options);
    this.customData = options.customData;
    _dialogs[_id] = this;
  };
  /**
   * @class Dialog~DialogButton
   * @description A dialog button that can be controlled with JavaScript
   */


  var Button$1 =
  /*#__PURE__*/
  function () {
    function Button(identifier, callback) {
      callback = Util.last(arguments);
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogUtilsInstance.assertActiveDialogOrThrow(dialogProvider, callback._context.extension.addon_key);
        this.name = identifier;
        this.identifier = identifier;
      } else {
        if (!DialogExtensionComponent.getActiveDialog()) {
          throw new Error('Failed to find an active dialog.');
        }

        this.name = identifier;
        this.identifier = identifier;
        this.enabled = DialogExtensionComponent.buttonIsEnabled(identifier);
        this.hidden = !DialogExtensionComponent.buttonIsVisible(identifier);
      }
    }
    /**
     * Sets the button state to enabled
     * @method enable
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').enable();
     */


    var _proto = Button.prototype;

    _proto.enable = function enable() {
      this.setState({
        enabled: true
      });
    }
    /**
     * Sets the button state to disabled. A disabled button cannot be clicked and emits no events.
     * @method disable
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').disable();
     */
    ;

    _proto.disable = function disable() {
      this.setState({
        enabled: false
      });
    }
    /**
     * Query a button for its current state.
     * @method isEnabled
     * @memberOf Dialog~DialogButton
     * @param {Function} callback function to receive the button state.
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').isEnabled(function(enabled){
     *   if(enabled){
     *     //button is enabled
     *   }
     * });
     */
    ;

    _proto.isEnabled = function isEnabled(callback) {
      callback = Util.last(arguments);
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        callback(!dialogProvider.isButtonDisabled(this.identifier));
      } else {
        callback(this.enabled);
      }
    }
    /**
     * Toggle the button state between enabled and disabled.
     * @method toggle
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').toggle();
     */
    ;

    _proto.toggle = function toggle() {
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogProvider.toggleButton(this.identifier);
      } else {
        this.setState({
          enabled: !this.enabled
        });
      }
    };

    _proto.setState = function setState(state) {
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogProvider.setButtonDisabled(this.identifier, !state.enabled);
      } else {
        this.enabled = state.enabled;
        DialogActions.toggleButton({
          identifier: this.identifier,
          enabled: this.enabled
        });
      }
    }
    /**
     * Trigger a callback bound to a button.
     * @method trigger
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').bind(function(){
     *   alert('clicked!');
     * });
     * AP.dialog.getButton('submit').trigger();
     */
    ;

    _proto.trigger = function trigger(callback) {
      callback = Util.last(arguments);

      if (this.enabled) {
        DialogActions.dialogMessage({
          name: this.name,
          extension: callback._context.extension
        });
      }
    }
    /**
     * Query a button for its current hidden/visible state.
     * @method isHidden
     * @memberOf Dialog~DialogButton
     * @param {Function} callback function to receive the button state.
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').isHidden(function(hidden){
     *   if(hidden){
     *     //button is hidden
     *   }
     * });
     */
    ;

    _proto.isHidden = function isHidden(callback) {
      callback = Util.last(arguments);
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        callback(dialogProvider.isButtonHidden(this.identifier));
      } else {
        callback(this.hidden);
      }
    }
    /**
     * Sets the button state to hidden
     * @method hide
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').hide();
     */
    ;

    _proto.hide = function hide() {
      this.setHidden(true);
    }
    /**
     * Sets the button state to visible
     * @method show
     * @memberOf Dialog~DialogButton
     * @noDemo
     * @example
     * AP.dialog.getButton('submit').show();
     */
    ;

    _proto.show = function show() {
      this.setHidden(false);
    };

    _proto.setHidden = function setHidden(hidden) {
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogProvider.setButtonHidden(this.identifier, hidden);
      } else {
        this.hidden = hidden;
        DialogActions.toggleButtonVisibility({
          identifier: this.identifier,
          hidden: this.hidden
        });
      }
    };

    return Button;
  }();

  function getDialogFromContext(context) {
    return _dialogs[context.extension.options.dialogId];
  }

  var CreateButton = function CreateButton(options, callback) {
    callback = Util.last(arguments);
    var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
    var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

    if (dialogProvider) {
      dialogUtilsInstance.assertActiveDialogOrThrow(dialogProvider, callback._context.extension.addon_key);
      dialogProvider.createButton({
        identifier: options.identifier,
        text: options.text,
        hidden: false,
        disabled: options.disabled || false,
        onClick: function onClick() {
          EventActions.broadcast('dialog.button.click', {
            addon_key: callback._context.extension.addon_key,
            key: callback._context.extension.key
          }, {
            button: {
              identifier: options.identifier,
              text: options.text
            }
          });
        }
      });
    } else {
      DialogExtensionActions.addUserButton({
        identifier: options.identifier,
        text: options.text
      }, callback._context.extension);
    }
  };
  /**
   * The Dialog module provides a mechanism for launching an add-on's modules as modal dialogs from within an add-on's iframe.
   *
   * A modal dialog displays information without requiring the user to leave the current page.
   *
   * The dialog is opened over the entire window, rather than within the iframe itself.
   *
   * <h3>Styling your dialog to look like a standard Atlassian dialog</h3>
   *
   * By default the dialog iframe is undecorated. It's up to you to style the dialog.
   * <img src="/cloud/connect/images/connectdialogchromelessexample.jpeg" width="100%" />
   *
   * In order to maintain a consistent look and feel between the host application and the add-on, we encourage you to style your dialogs to match Atlassian's Design Guidelines for modal dialogs.
   *
   * To do that, you'll need to add the AUI styles to your dialog.
   *
   * For more information, read about the Atlassian User Interface [dialog component](https://docs.atlassian.com/aui/latest/docs/dialog.html).
   * @exports Dialog
   */


  var dialog = {
    /**
     * @class Dialog~DialogOptions
     * @description The options supplied to a [dialog.create()](module-Dialog.html) call.
     *
     * @property {String}        key         The module key of a dialog, or the key of a page or web-item that you want to open as a dialog.
     * @property {String}        size        Opens the dialog at a preset size: small, medium, large, x-large or fullscreen (with chrome).
     * @property {Number|String} width       if size is not set, define the width as a percentage (append a % to the number) or pixels.
     * @property {Number|String} height      if size is not set, define the height as a percentage (append a % to the number) or pixels.
     * @property {Boolean}       chrome      (optional) opens the dialog with heading and buttons.
     * @property {String}        header      (optional) text to display in the header if opening a dialog with chrome.
     * @property {String}        submitText  (optional) text for the submit button if opening a dialog with chrome.
     * @property {String}        cancelText  (optional) text for the cancel button if opening a dialog with chrome.
     * @property {Object}        customData  (optional) custom data object that can be accessed from the actual dialog iFrame.
     * @property {Boolean}       closeOnEscape (optional) if true, pressing ESC will close the dialog (default is true).
     * @property {Array}         buttons     (optional) an array of custom buttons to be added to the dialog if opening a dialog with chrome.
     * @property {String}        hint        (optional) Suggested actions or helpful info that will be added to the dialog if opening with chrome.
     */

    /**
     * Creates a dialog for a common dialog, page or web-item module key.
     * @param {Dialog~DialogOptions} options configuration object of dialog options.
     * @method create
     * @noDemo
     * @example
     * AP.dialog.create({
     *   key: 'my-module-key',
     *   width: '500px',
     *   height: '200px',
     *   chrome: true,
     *   buttons: [
     *     {
     *       text: 'my button',
     *       identifier: 'my_unique_identifier'
     *     }
     *   ]
     * }).on("close", callbackFunc);
     *
     * @return {Dialog~Dialog} Dialog object allowing for callback registrations
     */
    create: {
      constructor: Dialog$1
    },

    /**
     * Closes the currently open dialog. Optionally pass data to listeners of the `dialog.close` event.
     * This will only close a dialog that has been opened by your add-on.
     * You can register for close events using the `dialog.close` event and the [events module](../events/).
     * @param {Object} data An object to be emitted on dialog close.
     * @noDemo
     * @example
     * AP.dialog.close({foo: 'bar'});
     */
    close: function close(data, callback) {
      callback = Util.last(arguments);
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');

      if (dialogProvider) {
        dialogUtilsInstance.assertActiveDialogOrThrow(dialogProvider, callback._context.extension.addon_key);
        EventActions.broadcast('dialog.close', {
          addon_key: callback._context.extension.addon_key
        }, data);
        dialogProvider.close();
      } else {
        var dialogToClose;

        if (callback._context.extension.options.isDialog) {
          dialogToClose = DialogExtensionComponent.getByExtension(callback._context.extension.id)[0];
        } else {
          dialogToClose = DialogExtensionComponent.getActiveDialog();
        }

        DialogActions.close({
          customData: data,
          dialog: dialogToClose,
          extension: callback._context.extension
        });
      }
    },

    /**
     * Passes the custom data Object to the specified callback function.
     * @noDemo
     * @name getCustomData
     * @method
     * @param {Function} callback - Callback method to be executed with the custom data.
     * @example
     * AP.dialog.getCustomData(function (customData) {
     *   console.log(customData);
     * });
     *
     */
    getCustomData: function getCustomData(callback) {
      callback = Util.last(arguments);
      var dialog = getDialogFromContext(callback._context);

      if (dialog) {
        callback(dialog.customData);
      } else {
        callback(undefined);
      }
    },

    /**
    * Stop the dialog from closing when the submit button is clicked
    * @method disableCloseOnSubmit
    * @noDemo
    * @example
    * AP.dialog.disableCloseOnSubmit();
    * AP.events.on('dialog.button.click', function(data){
    *   if(data.button.name === 'submit') {
    *     console.log('submit button pressed');
    *   }
    * }
    */

    /**
     * Returns the button that was requested (either cancel or submit). If the requested button does not exist, an empty Object will be returned instead.
     * @method getButton
     * @returns {Dialog~DialogButton}
     * @noDemo
     * @example
     * AP.dialog.getButton('submit');
     */
    getButton: {
      constructor: Button$1,
      enable: Button$1.prototype.enable,
      disable: Button$1.prototype.disable,
      toggle: Button$1.prototype.toggle,
      isEnabled: Button$1.prototype.isEnabled,
      trigger: Button$1.prototype.trigger,
      hide: Button$1.prototype.hide,
      show: Button$1.prototype.show,
      isHidden: Button$1.prototype.isHidden
    },

    /**
     * Creates a dialog button that can be controlled with javascript
     * @method createButton
     * @returns {Dialog~DialogButton}
     * @noDemo
     * @example
     * AP.dialog.createButton({
     *   text: 'button text',
     *   identifier: 'button.1'
     * }).bind(function mycallback(){});
     */
    createButton: {
      constructor: CreateButton
    }
  };

  function getBooleanFeatureFlag(flagName) {
    if (AJS && AJS.DarkFeatures && AJS.DarkFeatures.isEnabled && AJS.DarkFeatures.isEnabled(flagName)) {
      return true;
    }

    var flagMeta = document.querySelector('meta[name="ajs-fe-feature-flags"]');

    if (!flagMeta) {
      return false;
    }

    var flagContent = flagMeta.getAttribute('content');

    if (!flagContent) {
      return false;
    }

    var flagJson = {};

    try {
      flagJson = JSON.parse(flagContent);
    } catch (err) {
      return false;
    }

    if (!flagJson[flagName] || typeof flagJson[flagName].value !== 'boolean') {
      return false;
    }

    return flagJson[flagName].value;
  }

  EventDispatcher$1.register('iframe-resize', function (data) {
    IframeComponent.resize(data.width, data.height, data.$el);
  });
  EventDispatcher$1.register('iframe-size-to-parent', function (data) {
    var height;
    var $el = Util.getIframeByExtensionId(data.extensionId);

    if (getBooleanFeatureFlag('com.atlassian.connect.acjs-nav3')) {
      height = $(window).height() - $el.offset().top - 1; //1px comes from margin given by full-size-general-page
    } else {
      if (data.hideFooter) {
        $el.addClass('full-size-general-page-no-footer');
        $('#footer').css({
          display: 'none'
        });
        height = $(window).height() - $('#header > nav').outerHeight();
      } else {
        height = $(window).height() - $('#header > nav').outerHeight() - $('#footer').outerHeight() - 1; //1px comes from margin given by full-size-general-page

        $el.removeClass('full-size-general-page-no-footer');
        $('#footer').css({
          display: 'block'
        });
      }
    }

    EventDispatcher$1.dispatch('iframe-resize', {
      width: '100%',
      height: height + 'px',
      $el: $el
    });
  });
  EventDispatcher$1.register('hide-footer', function (hideFooter) {
    if (hideFooter) {
      $('#footer').css({
        display: 'none'
      });
    }
  });
  window.addEventListener('resize', function (e) {
    EventDispatcher$1.dispatch('host-window-resize', e);
  }, true);
  var EnvActions = {
    iframeResize: function iframeResize(width, height, context) {
      var $el;

      if (context.extension_id) {
        $el = Util.getIframeByExtensionId(context.extension_id);
      } else {
        $el = context;
      }

      EventDispatcher$1.dispatch('iframe-resize', {
        width: width,
        height: height,
        $el: $el,
        extension: context.extension
      });
    },
    sizeToParent: function sizeToParent(extensionId, hideFooter) {
      EventDispatcher$1.dispatch('iframe-size-to-parent', {
        hideFooter: hideFooter,
        extensionId: extensionId
      });
    },
    hideFooter: function hideFooter(_hideFooter) {
      EventDispatcher$1.dispatch('hide-footer', _hideFooter);
    }
  };

  var debounce$1 = Util.debounce;
  var resizeFuncHolder = {}; // ignore resize events for iframes that use sizeToParent

  var ignoreResizeForExtension = [];
  var sizeToParentExtension = {};
  /**
   * Utility methods that are available without requiring additional modules.
   * @exports AP
   */

  var env = {
    /**
     * Get the location of the current page of the host product.
     *
     * @param {Function} callback function (location) {...}
     * @example
     * AP.getLocation(function(location){
     *   alert(location);
     * });
     */
    getLocation: function getLocation(callback) {
      callback = Util.last(arguments);
      var pageLocationProvider = ModuleProviders$1.getProvider('get-location');

      if (typeof pageLocationProvider === 'function') {
        callback(pageLocationProvider());
      } else {
        callback(window.location.href);
      }
    },

    /**
     * Resize the iframe to a specified width and height.
     *
     * Only content within an element with the class `ac-content` will be resized automatically.
     * Content without this identifier is sized according to the `body` element, and will dynamically grow, but not shrink.
     * ```
     * <div class="ac-content">
       * <p>Hello World</p>
     * </div>
     * ```
     * Note that this method cannot be used in dialogs.
     *
     * @method
     * @param {String} width   the desired width
     * @param {String} height  the desired height
     */
    resize: function resize(width, height, callback) {
      callback = Util.last(arguments);
      var addon = ModuleProviders$1.getProvider('addon');

      if (addon) {
        addon.resize(width, height, callback._context);
      } else {
        var iframeId = callback._context.extension.id;
        var options = callback._context.extension.options;

        if (ignoreResizeForExtension.indexOf(iframeId) !== -1 || options && options.isDialog) {
          return false;
        }

        if (!resizeFuncHolder[iframeId]) {
          resizeFuncHolder[iframeId] = debounce$1(function (dwidth, dheight, dcallback) {
            EnvActions.iframeResize(dwidth, dheight, dcallback._context);
          }, 50);
        }

        resizeFuncHolder[iframeId](width, height, callback);
      }

      return true;
    },

    /**
     * Resize the iframe, so that it takes the entire page. Add-on may define to hide the footer using data-options.
     *
     * Note that this method is only available for general page modules.
     *
     * @method
     * @param {boolean} hideFooter true if the footer is supposed to be hidden
     */
    sizeToParent: debounce$1(function (hideFooter, callback) {
      callback = Util.last(arguments);
      var addon = ModuleProviders$1.getProvider('addon');

      if (addon) {
        addon.sizeToParent(hideFooter, callback._context);
      } else {
        // sizeToParent is only available for general-pages
        if (callback._context.extension.options.isFullPage) {
          // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
          Util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
          EnvActions.sizeToParent(callback._context.extension_id, hideFooter);
          sizeToParentExtension[callback._context.extension_id] = {
            hideFooter: hideFooter
          };
        } else {
          // This is only here to support integration testing
          // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
          Util.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page-fail');
        }
      }
    }),

    /**
    * Hide footer..
    *
    * @method
    * @param {boolean} hideFooter true if the footer is supposed to be hidden
    */
    hideFooter: function hideFooter(_hideFooter) {
      if (_hideFooter) {
        EnvActions.hideFooter(_hideFooter);
      }
    }
  };
  EventDispatcher$1.register('host-window-resize', function (data) {
    Object.getOwnPropertyNames(sizeToParentExtension).forEach(function (extensionId) {
      EnvActions.sizeToParent(extensionId, sizeToParentExtension[extensionId].hideFooter);
    });
  });
  EventDispatcher$1.register('after:iframe-unload', function (data) {
    delete resizeFuncHolder[data.extension.id];
    delete sizeToParentExtension[data.extension.id];

    if (ignoreResizeForExtension.indexOf(data.extension.id) !== -1) {
      ignoreResizeForExtension.splice(ignoreResizeForExtension.indexOf(data.extension.id), 1);
    }
  });
  EventDispatcher$1.register('before:iframe-size-to-parent', function (data) {
    if (ignoreResizeForExtension.indexOf(data.extensionId) === -1) {
      ignoreResizeForExtension.push(data.extensionId);
    }
  });

  var InlineDialogActions = {
    hide: function hide($el) {
      EventDispatcher$1.dispatch('inline-dialog-hide', {
        $el: $el
      });
    },
    refresh: function refresh($el) {
      EventDispatcher$1.dispatch('inline-dialog-refresh', {
        $el: $el
      });
    },
    hideTriggered: function hideTriggered(extension_id, $el) {
      EventDispatcher$1.dispatch('inline-dialog-hidden', {
        extension_id: extension_id,
        $el: $el
      });
    },
    close: function close() {
      EventDispatcher$1.dispatch('inline-dialog-close', {});
    },
    created: function created(data) {
      EventDispatcher$1.dispatch('inline-dialog-opened', {
        $el: data.$el,
        trigger: data.trigger,
        extension: data.extension
      });
    }
  };

  /**
   * The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
   * An inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
   *
   * Inline dialogs can be shown via a [web item target](../../modules/web-item/#target).
   *
   * For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inline-dialog.html).
   * @module Inline-dialog
   */
  var inlineDialog = {
    /**
     * Hide the inline dialog that contains the iframe where this method is called from.
     * @memberOf module:Inline-dialog
     * @method hide
     * @noDemo
     * @example
     * AP.inlineDialog.hide();
     */
    hide: function hide(callback) {
      callback = Util.last(arguments);
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var inlineDialogProvider = frameworkAdaptor.getProviderByModuleName('inlineDialog');

      if (inlineDialogProvider) {
        inlineDialogProvider.hide(callback._context);
      } else {
        InlineDialogActions.close();
      }
    }
  };

  /**
  * Messages are the primary method for providing system feedback in the product user interface.
  * Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
  * For visual examples of each kind please see the [Design guide](https://docs.atlassian.com/aui/latest/docs/messages.html).
  * ### Example ###
  * ```
  * //create a message
  * var message = AP.messages.info('plain text title', 'plain text body');
  * ```
  * @deprecated after August 2017 | Please use the Flag module instead.
  * @name Messages
  * @module
  * @ignore
  */
  var MESSAGE_BAR_ID = 'ac-message-container';
  var MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
  var MSGID_PREFIX = 'ap-message-';
  var MSGID_REGEXP = new RegExp("^" + MSGID_PREFIX + "[0-9A-fa-f]+$");
  var _messages = {};

  function validateMessageId(msgId) {
    return MSGID_REGEXP.test(msgId);
  }

  function getMessageBar() {
    var $msgBar = $('#' + MESSAGE_BAR_ID);

    if ($msgBar.length < 1) {
      $msgBar = $('<div id="' + MESSAGE_BAR_ID + '" />').appendTo('body');
    }

    return $msgBar;
  }

  function filterMessageOptions(options) {
    var copy = {};
    var allowed = ['closeable', 'fadeout', 'delay', 'duration', 'id'];

    if (typeof options === 'object') {
      allowed.forEach(function (key) {
        if (key in options) {
          copy[key] = options[key];
        }
      });
    }

    return copy;
  }

  var messageCloseListenerCreated = false;

  function showMessage(name, title, body, options) {
    if (!messageCloseListenerCreated) {
      createMessageCloseListener();
      messageCloseListenerCreated = true;
    }

    var $msgBar = getMessageBar();
    options = filterMessageOptions(options);
    $.extend(options, {
      title: title,
      body: AJS.escapeHtml(body)
    });

    if (MESSAGE_TYPES.indexOf(name) < 0) {
      throw 'Invalid message type. Must be: ' + MESSAGE_TYPES.join(', ');
    }

    if (validateMessageId(options.id)) {
      AJS.messages[name]($msgBar, options); // Calculate the left offset based on the content width.
      // This ensures the message always stays in the centre of the window.

      $msgBar.css('margin-left', '-' + $msgBar.innerWidth() / 2 + 'px');
    }
  }

  function deprecatedShowMessage(name, title, body, options, callback) {
    var methodUsed = "AP.messages." + name;
    console.warn("DEPRECATED API - AP.messages." + name + " has been deprecated since ACJS 5.0 and will be removed in a future release. Use AP.flag.create instead.");
    AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
    var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
    var messageProvider = frameworkAdaptor.getProviderByModuleName('messages');

    if (messageProvider) {
      var messageType = name;
      var createMessage = messageProvider[messageType];

      if (!createMessage) {
        messageProvider[messageType] = messageProvider.generic;
      }

      createMessage(title, body, options);
    } else {
      showMessage(name, title, body, options);
    }
  }

  function createMessageCloseListener() {
    $(document).on('aui-message-close', function (e, $msg) {
      var _id = $msg.attr('id').replace(MSGID_PREFIX, '');

      if (_messages[_id]) {
        if ($.isFunction(_messages[_id].onCloseTrigger)) {
          _messages[_id].onCloseTrigger();
        }

        _messages[_id]._destroy();
      }
    });
  }

  function messageModule(messageType) {
    return {
      constructor: function constructor(title, body, options, callback) {
        callback = Util.last(arguments);
        var _id = callback._id;

        if (typeof title !== 'string') {
          title = '';
        }

        if (typeof body !== 'string') {
          body = '';
        }

        if (typeof options !== 'object') {
          options = {};
        }

        options.id = MSGID_PREFIX + _id;
        deprecatedShowMessage(messageType, title, body, options, callback);
        _messages[_id] = this;
      }
    };
  }

  var messages = {
    /**
    * Close a message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name clear
    * @method
    * @memberof module:Messages#
    * @param    {String}    id  The id that was returned when the message was created.
    * @example
    * //create a message
    * var message = AP.messages.info('title', 'body');
    * setTimeout(function(){
    *   AP.messages.clear(message);
    * }, 2000);
    */
    clear: function clear(msg) {
      var id = MSGID_PREFIX + msg._id;

      if (validateMessageId(id)) {
        var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
        var messageProvider = frameworkAdaptor.getProviderByModuleName('messages');

        if (messageProvider) {
          messageProvider.clear(id);
        } else {
          $('#' + id).closeMessage();
        }
      }
    },

    /**
    * Trigger an event when a message is closed
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name onClose
    * @method
    * @memberof module:Messages#
    * @param    {String}    id  The id that was returned when the message was created.
    * @param    {Function}  callback  The function that is run when the event is triggered
    * @example
    * //create a message
    * var message = AP.messages.info('title', 'body');
    * AP.messages.onClose(message, function() {
    *   console.log(message, ' has been closed!');
    * });
    */
    onClose: function onClose(msg, callback) {
      callback = Util.last(arguments);
      var id = msg._id;
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var messageProvider = frameworkAdaptor.getProviderByModuleName('messages');

      if (messageProvider) {
        var fullId = MSGID_PREFIX + msg._id;
        messageProvider.onClose(fullId, callback);
      } else {
        if (_messages[id]) {
          _messages[id].onCloseTrigger = callback;
        }
      }
    },

    /**
    * Show a generic message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name generic
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.generic('title', 'generic message example');
    */
    generic: messageModule('generic'),

    /**
    * Show an error message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name error
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.error('title', 'error message example');
    */
    error: messageModule('error'),

    /**
    * Show a warning message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name warning
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.warning('title', 'warning message example');
    */
    warning: messageModule('warning'),

    /**
    * Show a success message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name success
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.success('title', 'success message example');
    */
    success: messageModule('success'),

    /**
    * Show an info message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name info
    * @method
    * @memberof module:Messages#
    * @param    {String}            title       Sets the title text of the message.
    * @param    {String}            body        The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.info('title', 'info message example');
    */
    info: messageModule('info'),

    /**
    * Show a hint message
    * @deprecated after August 2017 | Please use the Flag module instead.
    * @name hint
    * @method
    * @memberof module:Messages#
    * @param    {String}            title               Sets the title text of the message.
    * @param    {String}            body                The main content of the message.
    * @param    {Object}            options             Message Options
    * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
    * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
    * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
    * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
    * @returns  {String}    The id to be used when clearing the message
    * @example
    * //create a message
    * var message = AP.messages.hint('title', 'hint message example');
    */
    hint: messageModule('hint')
  };

  var FlagActions = {
    // called on action click
    actionInvoked: function actionInvoked(actionId, flagId) {
      EventDispatcher$1.dispatch('flag-action-invoked', {
        id: flagId,
        actionId: actionId
      });
    },
    open: function open(flagId) {
      EventDispatcher$1.dispatch('flag-open', {
        id: flagId
      });
    },
    //called to close a flag
    close: function close(flagId) {
      EventDispatcher$1.dispatch('flag-close', {
        id: flagId
      });
    },
    //called by AUI when closed
    closed: function closed(flagId) {
      EventDispatcher$1.dispatch('flag-closed', {
        id: flagId
      });
    }
  };

  var FLAGID_PREFIX = 'ap-flag-';
  var FLAG_CLASS = 'ac-aui-flag';
  var FLAG_ACTION_CLASS = 'ac-flag-actions';

  var Flag =
  /*#__PURE__*/
  function () {
    function Flag() {}

    var _proto = Flag.prototype;

    _proto.cleanKey = function cleanKey(dirtyKey) {
      var cleanFlagKeyRegExp = new RegExp('^' + FLAGID_PREFIX + '(.+)$');
      var matches = dirtyKey.match(cleanFlagKeyRegExp);

      if (matches && matches[1]) {
        return matches[1];
      }

      return null;
    };

    _proto._toHtmlString = function _toHtmlString(str) {
      if ($.type(str) === 'string') {
        return str;
      } else if ($.type(str) === 'object' && str instanceof $) {
        return str.html();
      }
    };

    _proto._renderBody = function _renderBody(body) {
      var body = this._toHtmlString(body);

      var $body = $('<div />').html(body);
      $('<p />').addClass(FLAG_ACTION_CLASS).appendTo($body);
      return $body.html();
    };

    _proto._renderActions = function _renderActions($flag, flagId, actions) {
      var $actionContainer = $flag.find('.' + FLAG_ACTION_CLASS);
      actions = actions || {};
      var $action;
      Object.getOwnPropertyNames(actions).forEach(function (key) {
        $action = $('<a />').attr('href', '#').data({
          'key': key,
          'flag_id': flagId
        }).text(actions[key]);
        $actionContainer.append($action);
      }, this);
      return $flag;
    };

    _proto.render = function render(options) {
      bindFlagDomEvents();

      var _id = FLAGID_PREFIX + options.id;

      var auiFlag = AJS.flag({
        type: options.type,
        title: options.title,
        body: this._renderBody(options.body),
        close: options.close
      });
      auiFlag.setAttribute('id', _id);
      var $auiFlag = $(auiFlag);

      this._renderActions($auiFlag, options.id, options.actions);

      $auiFlag.addClass(FLAG_CLASS);
      $auiFlag.close = auiFlag.close;
      return $auiFlag;
    };

    _proto.close = function close(id) {
      var f = document.getElementById(id);
      f.close();
    };

    return Flag;
  }();

  var FlagComponent = new Flag();
  var flagDomEventsBound = false;

  function bindFlagDomEvents() {
    if (flagDomEventsBound) {
      return;
    }

    $(document).on('aui-flag-close', function (e) {
      var _id = e.target.id;
      var cleanFlagId = FlagComponent.cleanKey(_id);
      FlagActions.closed(cleanFlagId);
    });
    $(document).on('click', '.' + FLAG_ACTION_CLASS, function (e) {
      var $target = $(e.target);
      var actionKey = $target.data('key');
      var flagId = $target.data('flag_id');
      FlagActions.actionInvoked(actionKey, flagId);
    });
    flagDomEventsBound = true;
  }

  EventDispatcher$1.register('flag-close', function (data) {
    FlagComponent.close(data.id);
  });

  /**
  * Flags are the primary method for providing system feedback in the product user interface. Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
  * @module Flag
  */
  var _flags = {};
  /**
  * @class Flag~Flag
  * @description A flag object created by the [AP.flag]{@link module:Flag} module.
  * @example
  * // complete flag API example:
  * var outFlagId;
  * var flag = AP.flag.create({
  *   title: 'Successfully created a flag.',
  *   body: 'This is a flag.',
  *   type: 'info',
  *   actions: {
  *     'actionOne': 'action name'
  *   }
  * }, function(identifier) {
  * // Each flag will have a unique id. Save it for later.
  *   ourFlagId = identifier;
  * });
  *
  * // listen to flag events
  * AP.events.on('flag.close', function(data) {
  * // a flag was closed. data.flagIdentifier should match ourFlagId
  *   console.log('flag id: ', data.flagIdentifier);
  * });
  * AP.events.on('flag.action', function(data) {
  * // a flag action was clicked. data.actionIdentifier will be 'actionOne'
  * // data.flagIdentifier will equal ourFlagId
  *   console.log('flag id: ', data.flagIdentifier, 'flag action id', data.actionIdentifier);
  * });
  */

  var Flag$1 =
  /*#__PURE__*/
  function () {
    function Flag(options, callback) {
      callback = Util.last(arguments);

      if (typeof options !== 'object') {
        return;
      }

      var flagId = callback._id;
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var flagProvider = frameworkAdaptor.getProviderByModuleName('flag');

      if (flagProvider) {
        var actions = [];

        if (typeof options.actions === 'object') {
          actions = Object.getOwnPropertyNames(options.actions).map(function (key) {
            return {
              actionKey: key,
              actionText: options.actions[key],
              executeAction: FlagActions.actionInvoked.bind(null, key, flagId)
            };
          });
        }

        var type = options.type || 'info';
        var flagOptions = {
          id: flagId,
          title: options.title,
          body: options.body,
          actions: actions,
          onClose: FlagActions.closed,
          close: options.close,
          type: type.toLowerCase()
        };
        this.flag = flagProvider.create(flagOptions);
        var addonProvider = ModuleProviders$1.getProvider('addon');

        if (addonProvider && addonProvider.registerUnmountCallback) {
          addonProvider.registerUnmountCallback(this.close.bind(this), callback._context);
        }
      } else {
        this.flag = FlagComponent.render({
          type: options.type,
          title: options.title,
          body: AJS.escapeHtml(options.body),
          actions: options.actions,
          close: options.close,
          id: flagId
        });
        FlagActions.open(this.flag.attr('id'));
      }

      this.onTriggers = {};
      this.extension = callback._context.extension;
      _flags[callback._id] = this;
      callback.call(null, callback._id);
    }
    /**
    * @name close
    * @memberof Flag~Flag
    * @method
    * @description Closes the Flag.
    * @example
    * // Display a nice green flag using the Flags JavaScript API.
    * var flag = AP.flag.create({
    *   title: 'Successfully created a flag.',
    *   body: 'This is a flag.',
    *   type: 'info'
    * });
    *
    * // Close the flag.
    * flag.close()
    *
    */


    var _proto = Flag.prototype;

    _proto.close = function close() {
      this.flag.close();
    };

    return Flag;
  }();

  function invokeTrigger(id, eventName, data) {
    if (_flags[id]) {
      var extension = _flags[id].extension;
      data = data || {};
      data.flagIdentifier = id;
      EventActions.broadcast(eventName, {
        extension_id: extension.extension_id
      }, data);
    }
  }

  EventDispatcher$1.register('flag-closed', function (data) {
    invokeTrigger(data.id, 'flag.close');

    if (_flags[data.id]) {
      delete _flags[data.id];
    }
  });
  EventDispatcher$1.register('flag-action-invoked', function (data) {
    invokeTrigger(data.id, 'flag.action', {
      actionIdentifier: data.actionId
    });
  });
  var flag = {
    /**
    * @name create
    * @method
    * @description Creates a new flag.
    * @param {Object} options           Options of the flag.
    * @param {String} options.title     The title text of the flag.
    * @param {String} options.body      The body text of the flag.
    * @param {String} options.type=info Sets the type of the message. Valid options are "info", "success", "warning" and "error".
    * @param {String} options.close     The closing behaviour that this flag has. Valid options are "manual", and "auto".
    * @param {Object} options.actions   Map of {actionIdentifier: 'Action link text'} to add to the flag. The actionIdentifier will be passed to a 'flag.action' event if the link is clicked.
    * @returns {Flag~Flag}
    * @example
    * // Display a nice green flag using the Flags JavaScript API.
    * var flag = AP.flag.create({
    *   title: 'Successfully created a flag.',
    *   body: 'This is a flag.',
    *   type: 'success',
    *   actions: {
    *     'actionkey': 'Click me'
    *   }
    * });
    */
    create: {
      constructor: Flag$1,
      close: Flag$1.prototype.close
    }
  };

  var analytics$1 = {
    trackDeprecatedMethodUsed: function trackDeprecatedMethodUsed(methodUsed, callback) {
      callback = Util.last(arguments);
      AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
    }
  };

  var TRIGGER_PERCENTAGE = 10; //% before scroll events are fired

  var activeGeneralPageAddon;
  var lastScrollEventTriggered; //top or bottom

  EventDispatcher$1.register('iframe-bridge-established', function (data) {
    if (data.extension.options.isFullPage) {
      window.addEventListener('scroll', scrollEventHandler);
      activeGeneralPageAddon = data.extension.id;
    }
  });
  EventDispatcher$1.register('iframe-destroyed', function (extension) {
    removeScrollEvent();
  });
  EventDispatcher$1.register('iframe-unload', function (extension) {
    removeScrollEvent();
  });

  function removeScrollEvent() {
    window.removeEventListener('scroll', scrollEventHandler);
    activeGeneralPageAddon = undefined;
    lastScrollEventTriggered = undefined;
  }

  function scrollEventHandler() {
    var documentHeight = document.documentElement.scrollHeight;
    var windowHeight = window.innerHeight;
    var boundary = documentHeight * (TRIGGER_PERCENTAGE / 100);

    if (window.pageYOffset <= boundary) {
      triggerEvent('nearTop');
    } else if (windowHeight + window.pageYOffset + boundary >= documentHeight) {
      triggerEvent('nearBottom');
    } else {
      lastScrollEventTriggered = undefined;
    }
  }

  function triggerEvent(type) {
    if (lastScrollEventTriggered === type) {
      return; // only once per scroll.
    }

    EventActions.broadcast('scroll.' + type, {
      id: activeGeneralPageAddon
    }, {});
    lastScrollEventTriggered = type;
  }

  var scrollPosition = {
    /**
     * Get's the scroll position relative to the browser viewport
     *
     * @param callback {Function} callback to pass the scroll position
     * @noDemo
     * @example
     * AP.scrollPosition.getPosition(function(obj) { console.log(obj); });
     */
    getPosition: function getPosition(callback) {
      callback = Util.last(arguments); // scrollPosition.getPosition is only available for general-pages

      if (callback._context.extension.options.isFullPage) {
        var $el = Util.getIframeByExtensionId(callback._context.extension_id);
        var offset = $el.offset();
        var $window = $(window);
        callback({
          scrollY: $window.scrollTop() - offset.top,
          scrollX: $window.scrollLeft() - offset.left,
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    },
    setVerticalPosition: function setVerticalPosition(y, callback) {
      callback = Util.last(arguments);

      if (callback._context.extension.options && callback._context.extension.options.isFullPage) {
        var $el = Util.getIframeByExtensionId(callback._context.extension_id);
        var offset = $el.offset();

        if (typeof y === 'number') {
          document.documentElement.scrollTop = offset.top + y;
        }
      }
    }
  };

  var DropdownActions = {
    // called on action click
    itemSelected: function itemSelected(dropdown_id, item, extension) {
      EventDispatcher$1.dispatch('dropdown-item-selected', {
        id: dropdown_id,
        item: item,
        extension: extension
      });
    }
  };

  /**
  * DO NOT INCLUDE ME IN THE PUBLIC DOCUMENTATION
  * there is no AUI implementation of this
  */

  function buildListItem(listItem) {
    var finishedListItem = {};

    if (typeof listItem === 'string') {
      finishedListItem.content = listItem;
    } else if (listItem.text && typeof listItem.text === 'string') {
      finishedListItem.content = listItem.text;

      if (typeof listItem.disabled === 'boolean') {
        finishedListItem.disabled = listItem.disabled;
      }

      if (typeof listItem.itemId !== 'undefined') {
        finishedListItem.itemId = listItem.itemId;
      }
    } else {
      throw new Error('Unknown dropdown list item format.');
    }

    return finishedListItem;
  }

  function moduleListToApiList(list) {
    return list.map(function (item) {
      if (item.list && Array.isArray(item.list)) {
        var returnval = {
          heading: item.heading
        };
        returnval.items = item.list.map(function (listitem) {
          return buildListItem(listitem);
        });
        return returnval;
      }
    });
  }
  /**
  * @class DropdownItem
  * A single item in a dropdown menu can be a string or an object
  * @param {String} itemId The id of a single dropdown item
  * @param {String} text    The text to display in the dropdown item
  */

  /**
  * @module Dropdown
  * @description Dropdown menu that can go outside the iframe bounds.
  * @example
  * // create a dropdown menu with 1 section and 2 items
  * var mydropdown = {
  *   dropdownId: 'my-dropdown',
  *   list: [{
  *     heading: 'section heading',
  *     list: [
  *       {text: 'one'},
  *       {text: 'two'}
  *     ]
  *   }]
  * };
  *
  * AP.events.on('dropdown-item-selected', (data) =>{
  *   console.log('dropdown item selected', data.dropdownId, data.item);
  * });
  *
  * AP.dropdown.create(mydropdown);
  * // button is an element in our document that triggered the dropdown
  * let rect = document.querySelector('button').getBoundingClientRect();
  * AP.dropdown.showAt('my-dropdown', rect.left, rect.top, rect.width);
  *
  */


  var dropdown = {
    /**
    * @name create
    * @method
    * @description Creates a new dropdown.
    * @param {Object} options             Options of the dropdown.
    * @param {String} options.dropdownId A unique identifier for the dropdown that will be referenced in events.
    * @param {String} options.list        An array containing dropdown items {Dropdown~DropdownItem}
    * @example
    * // create a dropdown menu with 1 section and 2 items
    * var mydropdown = {
    *   dropdownId: 'my-dropdown',
    *   list: [{
    *     heading: 'section heading',
    *     list: [
    *       {text: 'one'},
    *       {text: 'two'}
    *     ]
    *   }]
    * };
    *
    * AP.dropdown.create(mydropdown);
    */
    create: function create(options, callback) {
      callback = Util.last(arguments);

      if (typeof options !== 'object') {
        return;
      }

      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        var dropdownGroups = moduleListToApiList(options.list);
        var dropdownProviderOptions = {
          dropdownId: options.dropdownId,
          dropdownGroups: dropdownGroups,
          dropdownItemNotifier: function dropdownItemNotifier(data) {
            DropdownActions.itemSelected(data.dropdownId, data.item, callback._context.extension);
          }
        };
        dropdownProvider.create(dropdownProviderOptions, callback._context);
        return dropdownProviderOptions;
      }
    },

    /**
    * @name showAt
    * @method
    * @description Displays a created dropdown menu.
    * @param {String} dropdownId   Id used when creating the dropdown
    * @param {String} x             x position from the edge of your iframe to display
    * @param {String} y             y position from the edge of your iframe to display
    * @param {String} width         Optionally enforce a width for the dropdown menu
    * @example
    * // create a dropdown menu with 1 section and 2 items
    * var mydropdown = {
    *   dropdownId: 'my-dropdown',
    *   list: [{
    *     list:['one', 'two']
    *   }]
    * };
    *
    * AP.dropdown.create(mydropdown);
    * // Get the button that activated the dropdown
    * let rect = document.querySelector('button').getBoundingClientRect();
    * AP.dropdown.showAt('my-dropdown', rect.left, rect.top, rect.width);
    */
    showAt: function showAt(dropdownId, x, y, width) {
      var callback = Util.last(arguments);
      var rect = {
        left: 0,
        top: 0
      };
      var iframe = document.getElementById(callback._context.extension_id);

      if (iframe) {
        rect = iframe.getBoundingClientRect();
      } else {
        console.error('ACJS: no iframe found for dropdown');
      }

      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        var dropdownProviderArgs = {
          dropdownId: dropdownId,
          x: x,
          y: y,
          width: width
        };
        dropdownProvider.showAt(dropdownProviderArgs, {
          iframeDimensions: rect,
          onItemSelection: function onItemSelection(dropdownId, item) {
            DropdownActions.itemSelected(dropdownId, item, callback._context.extension);
          }
        });
      }
    },

    /**
    * @name hide
    * @method
    * @description Hide a dropdown menu
    * @param {String} dropdownId The id of the dropdown to hide
    * @example
    * AP.dropdown.create('my-dropdown');
    * AP.dropdown.hide('my-dropdown');
    */
    hide: function hide(id) {
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        dropdownProvider.hide(id);
      }
    },

    /**
    * @name itemDisable
    * @method
    * @description Disable an item in the dropdown menu
    * @param {String} dropdownId The id of the dropdown
    * @param {String} itemId     The dropdown item to disable
    * @example
    * AP.dropdown.create('my-dropdown');
    * AP.dropdown.itemDisable('my-dropdown', 'item-id');
    */
    itemDisable: function itemDisable(dropdownId, itemId) {
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        dropdownProvider.itemDisable(dropdownId, itemId);
      }
    },

    /**
    * @name itemEnable
    * @method
    * @description Hide a dropdown menu
    * @param {String} dropdownId The id of the dropdown
    * @param {String} itemId The id of the dropdown item to enable
    * @example
    * AP.dropdown.create('my-dropdown');
    * AP.dropdown.itemEnable('my-dropdown', 'item-id');
    */
    itemEnable: function itemEnable(dropdownId, itemId) {
      var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
      var dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

      if (dropdownProvider) {
        dropdownProvider.itemEnable(dropdownId, itemId);
      }
    }
  };
  EventDispatcher$1.register('dropdown-item-selected', function (data) {
    EventActions.broadcast('dropdown-item-selected', {
      addon_key: data.extension.addon_key,
      key: data.extension.key
    }, {
      dropdownId: data.id,
      item: data.item
    });
  }); // friendly unload with connectHost.destroy

  EventDispatcher$1.register('iframe-destroyed', function (data) {
    var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
    var dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

    if (dropdownProvider) {
      dropdownProvider.destroyByExtension(data.extension.extension_id);
    }
  }); // unfriendly unload by removing the iframe from the DOM

  EventDispatcher$1.register('after:iframe-unload', function (data) {
    var frameworkAdaptor = HostApi$1.getFrameworkAdaptor();
    var dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');

    if (dropdownProvider) {
      dropdownProvider.destroyByExtension(data.extension.extension_id);
    }
  });

  /**
  * Hosts are the primary method for Connect apps to interact with the page.
  * @module Host
  */
  var TEXT_NODE_TYPE = 3;
  var host$1 = {
    /*
     This function could be used in Connect app for moving focus to Host app.
     As Connect App - iframe app, it can get control. When it's happen - host app events such short-cuts
     stop working. This function could help in this case.
    */
    focus: function focus() {
      window.document.querySelector('a').focus({
        preventScroll: true
      });
      window.document.querySelector('a').blur();
    },

    /**
     * Gets the selected text on the page.
     * @noDemo
     * @name getSelectedText
     * @method
     * @param {Function} callback - Callback method to be executed with the selected text.
     * @example
     * AP.host.getSelectedText(function (selection) {
     *   console.log(selection);
     * });
     *
     */
    getSelectedText: function getSelectedText(callback) {
      var text = '';
      var selection = window.document.getSelection();

      if (selection && selection.anchorNode && selection.anchorNode.nodeType === TEXT_NODE_TYPE) {
        text = selection.toString();
      }

      callback(text);
    }
  };

  var WebItem =
  /*#__PURE__*/
  function () {
    function WebItem() {
      this._webitems = {};

      this._contentResolver = function noop() {};
    }

    var _proto = WebItem.prototype;

    _proto.setContentResolver = function setContentResolver(resolver) {
      this._contentResolver = resolver;
    };

    _proto.requestContent = function requestContent(extension) {
      if (extension.addon_key && extension.key) {
        return this._contentResolver.call(null, Util.extend({
          classifier: 'json'
        }, extension));
      }
    } // originally i had this written nicely with Object.values but
    // ie11 didn't like it and i couldn't find a nice pollyfill
    ;

    _proto.getWebItemsBySelector = function getWebItemsBySelector(selector) {
      var _this = this;

      var returnVal;
      var keys = Object.getOwnPropertyNames(this._webitems).some(function (key) {
        var obj = _this._webitems[key];

        if (obj.selector) {
          if (obj.selector.trim() === selector.trim()) {
            returnVal = obj;
            return true;
          }
        }
        return false;
      });
      return returnVal;
    };

    _proto.setWebItem = function setWebItem(potentialWebItem) {
      return this._webitems[potentialWebItem.name] = {
        name: potentialWebItem.name,
        selector: potentialWebItem.selector,
        triggers: potentialWebItem.triggers
      };
    };

    _proto._removeTriggers = function _removeTriggers(webitem) {
      var _this2 = this;

      var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);
      $(function () {
        $('body').off(onTriggers, webitem.selector, _this2._webitems[webitem.name]._on);
      });
      delete this._webitems[webitem.name]._on;
    };

    _proto._addTriggers = function _addTriggers(webitem) {
      var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);

      webitem._on = function (event) {
        event.preventDefault();
        var $target = $(event.target).closest(webitem.selector);
        var convertedOptions = WebItemUtils.getConfigFromTarget($target);
        var extensionUrl = convertedOptions && convertedOptions.url ? convertedOptions.url : undefined;
        var extension = {
          addon_key: WebItemUtils.getExtensionKey($target),
          key: WebItemUtils.getKey($target),
          options: WebItemUtils.getOptionsForWebItem($target),
          url: extensionUrl
        };
        WebItemActions.webitemInvoked(webitem, event, extension);
      };

      $(function () {
        $('body').on(onTriggers, webitem.selector, webitem._on);
      });
    };

    return WebItem;
  }();

  var webItemInstance = new WebItem();
  EventDispatcher$1.register('webitem-added', function (data) {
    webItemInstance._addTriggers(data.webitem);
  });
  EventDispatcher$1.register('content-resolver-register-by-extension', function (data) {
    webItemInstance.setContentResolver(data.callback);
  });
  document.addEventListener('aui-responsive-menu-item-created', function (e) {
    var oldWebItem = e.detail.originalItem.querySelector('a[class*="ap-"]');

    if (oldWebItem) {
      var newWebItem = e.detail.newItem.querySelector('a');
      var classList = [].slice.call(oldWebItem.classList);
      classList.forEach(function (cls) {
        if (/^ap-/.test(cls)) {
          newWebItem.classList.add(cls);
        }
      });
    }
  });

  var WebItemActions = {
    addWebItem: function addWebItem(potentialWebItem) {
      var webitem;
      var existing = webItemInstance.getWebItemsBySelector(potentialWebItem.selector);

      if (existing) {
        return false;
      } else {
        webitem = webItemInstance.setWebItem(potentialWebItem);
        EventDispatcher$1.dispatch('webitem-added', {
          webitem: webitem
        });
      }
    },
    webitemInvoked: function webitemInvoked(webitem, event, extension) {
      EventDispatcher$1.dispatch('webitem-invoked:' + webitem.name, {
        webitem: webitem,
        event: event,
        extension: extension
      });
    }
  };

  var InlineDialogWebItemActions = {
    addExtension: function addExtension(data) {
      EventDispatcher$1.dispatch('inline-dialog-extension', {
        $el: data.$el,
        extension: data.extension
      });
    }
  };

  var InlineDialog =
  /*#__PURE__*/
  function () {
    function InlineDialog() {}

    var _proto = InlineDialog.prototype;

    _proto.resize = function resize(data) {
      var width = Util.stringToDimension(data.width);
      var height = Util.stringToDimension(data.height);
      var $content = data.$el.find('.contents');

      if ($content.length === 1) {
        $content.css({
          width: width,
          height: height
        });
        InlineDialogActions.refresh(data.$el);
      }
    };

    _proto.refresh = function refresh($el) {
      $el[0].popup.reset();
    };

    _proto._getInlineDialog = function _getInlineDialog($el) {
      return AJS.InlineDialog($el);
    };

    _proto._renderContainer = function _renderContainer() {
      return $('<div />').addClass('aui-inline-dialog-contents');
    };

    _proto._displayInlineDialog = function _displayInlineDialog(data) {
      InlineDialogActions.created({
        $el: data.$el,
        trigger: data.trigger,
        extension: data.extension
      });
    };

    _proto.hideInlineDialog = function hideInlineDialog($el) {
      $el.hide();
    };

    _proto.closeInlineDialog = function closeInlineDialog() {
      $('.aui-inline-dialog').filter(function () {
        return $(this).find('.ap-iframe-container').length > 0;
      }).hide();
    };

    _proto.render = function render(data) {
      var _this = this;

      var $inlineDialog = $(document.getElementById('inline-dialog-' + data.id));

      if ($inlineDialog.length !== 0) {
        $inlineDialog.remove();
      }

      var $el = AJS.InlineDialog(data.bindTo, //assign unique id to inline Dialog
      data.id, function ($placeholder, trigger, showInlineDialog) {
        $placeholder.append(data.$content);

        _this._displayInlineDialog({
          extension: data.extension,
          $el: $placeholder,
          trigger: trigger
        });

        showInlineDialog();
      }, data.inlineDialogOptions);
      return $el;
    };

    return InlineDialog;
  }();

  var InlineDialogComponent = new InlineDialog();
  EventDispatcher$1.register('iframe-resize', function (data) {
    var container = data.$el.parents('.aui-inline-dialog');

    if (container.length === 1) {
      InlineDialogComponent.resize({
        width: data.width,
        height: data.height,
        $el: container
      });
    }
  });
  EventDispatcher$1.register('inline-dialog-refresh', function (data) {
    InlineDialogComponent.refresh(data.$el);
  });
  EventDispatcher$1.register('inline-dialog-hide', function (data) {
    InlineDialogComponent.hideInlineDialog(data.$el);
  });
  EventDispatcher$1.register('inline-dialog-close', function (data) {
    InlineDialogComponent.closeInlineDialog();
  });

  var ITEM_NAME = 'inline-dialog';
  var SELECTOR = '.ap-inline-dialog';
  var TRIGGERS = ['mouseover', 'click'];
  var WEBITEM_UID_KEY = 'inline-dialog-target-uid';

  var InlineDialogWebItem =
  /*#__PURE__*/
  function () {
    function InlineDialogWebItem() {
      this._inlineDialogWebItemSpec = {
        name: ITEM_NAME,
        selector: SELECTOR,
        triggers: TRIGGERS
      };
      this._inlineDialogWebItems = {};
    }

    var _proto = InlineDialogWebItem.prototype;

    _proto.getWebItem = function getWebItem() {
      return this._inlineDialogWebItemSpec;
    };

    _proto._createInlineDialog = function _createInlineDialog(data) {
      var $inlineDialog = InlineDialogComponent.render({
        extension: data.extension,
        id: data.id,
        bindTo: data.$target,
        $content: $('<div />'),
        inlineDialogOptions: data.extension.options
      });
      return $inlineDialog;
    };

    _proto.triggered = function triggered(data) {
      // don't trigger on hover, when hover is not specified.
      if (data.event.type !== 'click' && !data.extension.options.onHover) {
        return;
      }

      var $target = $(data.event.currentTarget);
      var webitemId = $target.data(WEBITEM_UID_KEY);

      var $inlineDialog = this._createInlineDialog({
        id: webitemId,
        extension: data.extension,
        $target: $target,
        options: data.extension.options || {}
      });

      $inlineDialog.show();
    };

    _proto.opened = function opened(data) {
      var $existingFrame = data.$el.find('iframe');
      var isExistingFrame = $existingFrame && $existingFrame.length === 1; // existing iframe is already present and src is still valid (either no jwt or jwt has not expired).

      if (isExistingFrame) {
        var src = $existingFrame.attr('src');
        var srcPresent = src.length > 0;

        if (srcPresent) {
          var srcHasJWT = urlUtils.hasJwt(src);
          var srcHasValidJWT = srcHasJWT && !urlUtils.isJwtExpired(src);

          if (srcHasValidJWT || !srcHasJWT) {
            return false;
          }
        }
      }

      var contentRequest = webItemInstance.requestContent(data.extension);

      if (!contentRequest) {
        console.warn('no content resolver found');
        return false;
      }

      contentRequest.then(function (content) {
        content.options = content.options || {};
        Util.extend(content.options, {
          autoresize: true,
          widthinpx: true
        });
        InlineDialogWebItemActions.addExtension({
          $el: data.$el,
          extension: content
        });
      });
      return true;
    };

    _proto.addExtension = function addExtension(data) {
      var addon = create(data.extension);
      data.$el.empty().append(addon);
    };

    _proto.createIfNotExists = function createIfNotExists(data) {
      var $target = $(data.event.currentTarget);
      var uid = $target.data(WEBITEM_UID_KEY);

      if (!uid) {
        uid = WebItemUtils.uniqueId();
        $target.data(WEBITEM_UID_KEY, uid);
      }
    };

    return InlineDialogWebItem;
  }();

  var inlineDialogInstance = new InlineDialogWebItem();
  var webitem = inlineDialogInstance.getWebItem();
  EventDispatcher$1.register('before:webitem-invoked:' + webitem.name, function (data) {
    inlineDialogInstance.createIfNotExists(data);
  });
  EventDispatcher$1.register('webitem-invoked:' + webitem.name, function (data) {
    inlineDialogInstance.triggered(data);
  });
  EventDispatcher$1.register('inline-dialog-opened', function (data) {
    inlineDialogInstance.opened(data);
  });
  EventDispatcher$1.register('inline-dialog-extension', function (data) {
    inlineDialogInstance.addExtension(data);
  });
  WebItemActions.addWebItem(webitem);

  var ITEM_NAME$1 = 'dialog';
  var SELECTOR$1 = '.ap-dialog';
  var TRIGGERS$1 = ['click'];
  var WEBITEM_UID_KEY$1 = 'dialog-target-uid';
  var DEFAULT_WEBITEM_OPTIONS = {
    chrome: true
  };

  var DialogWebItem =
  /*#__PURE__*/
  function () {
    function DialogWebItem() {
      this._dialogWebItem = {
        name: ITEM_NAME$1,
        selector: SELECTOR$1,
        triggers: TRIGGERS$1
      };
    }

    var _proto = DialogWebItem.prototype;

    _proto.getWebItem = function getWebItem() {
      return this._dialogWebItem;
    };

    _proto._dialogOptions = function _dialogOptions(options) {
      return Util.extend({}, DEFAULT_WEBITEM_OPTIONS, options || {});
    };

    _proto.triggered = function triggered(data) {
      var $target = $(data.event.currentTarget);
      var webitemId = $target.data(WEBITEM_UID_KEY$1);

      var dialogOptions = this._dialogOptions(data.extension.options);

      dialogOptions.id = webitemId;
      DialogExtensionActions.open(data.extension, dialogOptions);
    };

    _proto.createIfNotExists = function createIfNotExists(data) {
      var $target = $(data.event.currentTarget);
      var uid = $target.data(WEBITEM_UID_KEY$1);

      if (!uid) {
        uid = WebItemUtils.uniqueId();
        $target.data(WEBITEM_UID_KEY$1, uid);
      }
    };

    return DialogWebItem;
  }();

  var dialogInstance = new DialogWebItem();
  var webitem$1 = dialogInstance.getWebItem();
  EventDispatcher$1.register('webitem-invoked:' + webitem$1.name, function (data) {
    dialogInstance.triggered(data);
  });
  EventDispatcher$1.register('before:webitem-invoked:' + webitem$1.name, dialogInstance.createIfNotExists);
  WebItemActions.addWebItem(webitem$1);

  /**
   * Private namespace for host-side code.
   * @type {*|{}}
   * @private
   * @deprecated use AMD instead of global namespaces. The only thing that should be on _AP is _AP.define and _AP.require.
   */

  if (!window._AP) {
    window._AP = {};
  }
  /*
   * Add version
   */


  if (!window._AP.version) {
    window._AP.version = '5.2.29';
  }

  host.defineModule('messages', messages);
  host.defineModule('flag', flag);
  host.defineModule('dialog', dialog);
  host.defineModule('inlineDialog', inlineDialog);
  host.defineModule('env', env);
  host.defineModule('events', events);
  host.defineModule('_analytics', analytics$1);
  host.defineModule('scrollPosition', scrollPosition);
  host.defineModule('dropdown', dropdown);
  host.defineModule('host', host$1);
  EventDispatcher$1.register('module-define-custom', function (data) {
    host.defineModule(data.name, data.methods);
  });
  host.registerRequestNotifier(function (data) {
    analytics.dispatch('bridge.invokemethod', {
      module: data.module,
      fn: data.fn,
      addonKey: data.addon_key,
      moduleKey: data.key
    });
  });

  return HostApi$1;

}));

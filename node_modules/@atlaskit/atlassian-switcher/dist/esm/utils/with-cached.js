import { __read, __spread } from "tslib";
export var RELEASE_RESOLVED_PROMISE_DELAY = 5000;
var isPromise = function (p) {
    return typeof p.then === 'function' && typeof p.catch === 'function';
};
/**
 * withCached wraps a function and keeps track of in-flight promises:
 *
 * 1. First call will result to normal invocation. After promise is resolved
 * it will be removed from the promise-cache and store value into result-cache.
 *
 * 2. Second and subsequent calls will:
 *    a) return unresolved promise if any
 *    b) do a normal invocation otherwise
 *
 * 3. Provides methods to get `cached` value and `reset` caches
 */
export var withCached = function (fn) {
    var resultCache = new Map();
    var promiseCache = new Map();
    function getCacheKey() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return JSON.stringify(args);
    }
    var cached = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var cacheKey = getCacheKey.apply(void 0, __spread(args));
        return resultCache.get(cacheKey);
    };
    var reset = function () {
        resultCache.clear();
        promiseCache.clear();
    };
    var execute = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var cacheKey = getCacheKey.apply(void 0, __spread(args));
        var cachedPromise = promiseCache.get(cacheKey);
        if (cachedPromise !== undefined) {
            return cachedPromise;
        }
        var maybePromise = fn.apply(void 0, __spread(args));
        promiseCache.set(cacheKey, maybePromise);
        if (isPromise(maybePromise)) {
            maybePromise
                .then(function (result) {
                resultCache.set(cacheKey, result);
                setTimeout(function () { return promiseCache.delete(cacheKey); }, RELEASE_RESOLVED_PROMISE_DELAY);
            })
                .catch(function () {
                promiseCache.delete(cacheKey);
            });
        }
        return maybePromise;
    };
    return Object.assign(execute, fn, {
        cached: cached,
        reset: reset,
    });
};
//# sourceMappingURL=with-cached.js.map
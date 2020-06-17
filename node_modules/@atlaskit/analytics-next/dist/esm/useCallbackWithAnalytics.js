import { __read, __spread } from "tslib";
import { useCallback, useRef, useEffect } from 'react';
import { useAnalyticsEvents } from './useAnalyticsEvents';
export var useCallbackWithAnalytics = function (method, payload, channel) {
    var createAnalyticsEvent = useAnalyticsEvents().createAnalyticsEvent;
    // given input might be new function/object each render
    // we optimise and store in refs so we can memoize the callback
    // and at the same time avoid stale values
    var methodRef = useRef(method);
    var payloadRef = useRef(payload);
    useEffect(function () {
        methodRef.current = method;
        payloadRef.current = payload;
    }, [method, payload]);
    return useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var pload = typeof payloadRef.current === 'function'
            ? payloadRef.current.apply(payloadRef, __spread(args)) : payloadRef.current;
        createAnalyticsEvent(pload).fire(channel);
        methodRef.current.apply(methodRef, __spread(args));
    }, [createAnalyticsEvent, methodRef, payloadRef, channel]);
};
//# sourceMappingURL=useCallbackWithAnalytics.js.map
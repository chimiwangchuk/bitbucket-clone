import { __assign } from "tslib";
import React from 'react';
import AnalyticsContextConsumer from './AnalyticsContextConsumer';
var withAnalyticsEvents = function (createEventMap) { return function (WrappedComponent) {
    var WithAnalyticsEvents = React.forwardRef(function (props, ref) { return (React.createElement(AnalyticsContextConsumer, { createEventMap: createEventMap, wrappedComponentProps: props }, function (_a) {
        var createAnalyticsEvent = _a.createAnalyticsEvent, patchedEventProps = _a.patchedEventProps;
        return (React.createElement(WrappedComponent, __assign({}, props, patchedEventProps, { createAnalyticsEvent: createAnalyticsEvent, ref: ref })));
    })); });
    // @ts-ignore
    WithAnalyticsEvents.displayName = "WithAnalyticsEvents(" + (WrappedComponent.displayName ||
        WrappedComponent.name) + ")";
    return WithAnalyticsEvents;
}; };
export default withAnalyticsEvents;
//# sourceMappingURL=withAnalyticsEvents.js.map
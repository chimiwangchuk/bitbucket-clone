import { __assign, __rest } from "tslib";
import React from 'react';
import AnalyticsContext from './AnalyticsContext';
var withAnalyticsContext = function (defaultData) { return function (WrappedComponent) {
    var WithAnalyticsContext = React.forwardRef(function (props, ref) {
        var _a = props.analyticsContext, analyticsContext = _a === void 0 ? {} : _a, rest = __rest(props, ["analyticsContext"]);
        var analyticsData = __assign(__assign({}, defaultData), analyticsContext);
        return (React.createElement(AnalyticsContext, { data: analyticsData },
            React.createElement(WrappedComponent, __assign({}, rest, { ref: ref }))));
    });
    // @ts-ignore
    WithAnalyticsContext.displayName = "WithAnalyticsContext(" + (WrappedComponent.displayName ||
        WrappedComponent.name) + ")";
    return WithAnalyticsContext;
}; };
export default withAnalyticsContext;
//# sourceMappingURL=withAnalyticsContext.js.map
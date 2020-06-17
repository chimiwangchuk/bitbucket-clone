import { __extends } from "tslib";
import React, { Component } from 'react';
import { withAnalyticsEvents, withAnalyticsContext, createAndFireEvent, } from '@atlaskit/analytics-next';
import { name as packageName, version as packageVersion, } from '../version.json';
import Field from './Field';
var Time = /** @class */ (function (_super) {
    __extends(Time, _super);
    function Time() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Time.prototype.render = function () {
        var _a = this.props, children = _a.children, href = _a.href, onClick = _a.onClick, onFocus = _a.onFocus, onMouseOver = _a.onMouseOver;
        return (React.createElement(Field, { href: href, onClick: onClick, onFocus: onFocus, onMouseOver: onMouseOver }, children));
    };
    return Time;
}(Component));
export { Time as CommentTimeWithoutAnalytics };
var createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsContext({
    componentName: 'commentTime',
    packageName: packageName,
    packageVersion: packageVersion,
})(withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
        action: 'clicked',
        actionSubject: 'commentTime',
        attributes: {
            componentName: 'commentTime',
            packageName: packageName,
            packageVersion: packageVersion,
        },
    }),
})(Time));
//# sourceMappingURL=Time.js.map
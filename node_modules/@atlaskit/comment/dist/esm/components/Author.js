import { __extends } from "tslib";
import React, { Component } from 'react';
import { withAnalyticsEvents, withAnalyticsContext, createAndFireEvent, } from '@atlaskit/analytics-next';
import { name as packageName, version as packageVersion, } from '../version.json';
import Field from './Field';
var Author = /** @class */ (function (_super) {
    __extends(Author, _super);
    function Author() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Author.prototype.render = function () {
        var _a = this.props, children = _a.children, href = _a.href, onClick = _a.onClick, onFocus = _a.onFocus, onMouseOver = _a.onMouseOver;
        return (React.createElement(Field, { hasAuthor: true, href: href, onClick: onClick, onFocus: onFocus, onMouseOver: onMouseOver }, children));
    };
    return Author;
}(Component));
export { Author as CommentAuthorWithoutAnalytics };
var createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsContext({
    componentName: 'commentAuthor',
    packageName: packageName,
    packageVersion: packageVersion,
})(withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
        action: 'clicked',
        actionSubject: 'commentAuthor',
        attributes: {
            componentName: 'commentAuthor',
            packageName: packageName,
            packageVersion: packageVersion,
        },
    }),
})(Author));
//# sourceMappingURL=Author.js.map
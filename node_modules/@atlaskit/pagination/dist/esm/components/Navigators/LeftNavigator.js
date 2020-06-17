import { __assign, __extends } from "tslib";
import React, { Component } from 'react';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import Navigator from './Navigator';
var LeftNavigator = /** @class */ (function (_super) {
    __extends(LeftNavigator, _super);
    function LeftNavigator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LeftNavigator.prototype.render = function () {
        return React.createElement(Navigator, __assign({}, this.props));
    };
    LeftNavigator.defaultProps = {
        'aria-label': 'previous',
        iconBefore: React.createElement(ChevronLeftLargeIcon, { label: "" }),
        isDisabled: false,
    };
    return LeftNavigator;
}(Component));
export default LeftNavigator;
//# sourceMappingURL=LeftNavigator.js.map
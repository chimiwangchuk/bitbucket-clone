import { __assign, __extends } from "tslib";
import React, { Component } from 'react';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import Navigator from './Navigator';
var RightNavigator = /** @class */ (function (_super) {
    __extends(RightNavigator, _super);
    function RightNavigator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RightNavigator.prototype.render = function () {
        return React.createElement(Navigator, __assign({}, this.props));
    };
    RightNavigator.defaultProps = {
        'aria-label': 'next',
        iconBefore: React.createElement(ChevronRightLargeIcon, { label: "" }),
        isDisabled: false,
    };
    return RightNavigator;
}(Component));
export default RightNavigator;
//# sourceMappingURL=RightNavigator.js.map
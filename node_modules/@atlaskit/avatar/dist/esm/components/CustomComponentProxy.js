import { __assign, __extends, __rest } from "tslib";
import React, { Component } from 'react';
/**
 * Styling a avatar is complicated and there are a number of properties which
 * inform its appearance. We want to be able to style any arbitrary component
 * like a Link, but we don't want to pass all of these appearance-related props
 * through to the component or underlying DOM node. This component acts as a
 * layer which catches the appearance-related properties so that they can be
 * used by styled-components, then passes the rest of the props on to the custom
 * component.
 */
var CustomComponentProxy = /** @class */ (function (_super) {
    __extends(CustomComponentProxy, _super);
    function CustomComponentProxy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomComponentProxy.prototype.render = function () {
        var _a = this.props, appearance = _a.appearance, avatar = _a.avatar, borderColor = _a.borderColor, ProxiedComponent = _a.component, enableTooltip = _a.enableTooltip, groupAppearance = _a.groupAppearance, innerRef = _a.innerRef, isActive = _a.isActive, isDisabled = _a.isDisabled, isFocus = _a.isFocus, isHover = _a.isHover, isSelected = _a.isSelected, primaryText = _a.primaryText, secondaryText = _a.secondaryText, stackIndex = _a.stackIndex, rest = __rest(_a, ["appearance", "avatar", "borderColor", "component", "enableTooltip", "groupAppearance", "innerRef", "isActive", "isDisabled", "isFocus", "isHover", "isSelected", "primaryText", "secondaryText", "stackIndex"]);
        return ProxiedComponent ? React.createElement(ProxiedComponent, __assign({}, rest)) : null;
    };
    return CustomComponentProxy;
}(Component));
export default CustomComponentProxy;
//# sourceMappingURL=CustomComponentProxy.js.map
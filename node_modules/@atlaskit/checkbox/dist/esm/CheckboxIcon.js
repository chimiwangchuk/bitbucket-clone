import { __assign, __extends, __rest } from "tslib";
import React, { Component } from 'react';
import memoize from 'memoize-one';
import Icon from '@atlaskit/icon/glyph/checkbox';
import GlobalTheme from '@atlaskit/theme/components';
import IconIndeterminate from '@atlaskit/icon/glyph/checkbox-indeterminate';
import Theme, { componentTokens } from './theme';
import { createExtender } from './utils';
import { IconWrapperOverrides } from './elements';
var defaults = {
    IconWrapper: IconWrapperOverrides,
    IconIndeterminate: {
        component: IconIndeterminate,
    },
    Icon: {
        component: Icon,
    },
};
var CheckboxIcon = /** @class */ (function (_super) {
    __extends(CheckboxIcon, _super);
    function CheckboxIcon(props) {
        var _this = _super.call(this, props) || this;
        _this.createExtender = memoize(createExtender).bind(_this);
        return _this;
    }
    CheckboxIcon.prototype.render = function () {
        var _a = this.props, isChecked = _a.isChecked, isDisabled = _a.isDisabled, isInvalid = _a.isInvalid, isActive = _a.isActive, isFocused = _a.isFocused, isHovered = _a.isHovered, isIndeterminate = _a.isIndeterminate, overrides = _a.overrides, primaryColor = _a.primaryColor, secondaryColor = _a.secondaryColor, theme = _a.theme;
        // @ts-ignore
        var getOverrides = this.createExtender(defaults, overrides);
        var _b = getOverrides('IconWrapper'), IconWrapper = _b.component, iconWrapperOverrides = __rest(_b, ["component"]);
        var IconIndeterminate = getOverrides('IconIndeterminate').component;
        var Icon = getOverrides('Icon').component;
        return (React.createElement(Theme.Provider, { value: theme },
            React.createElement(GlobalTheme.Consumer, null, function (_a) {
                var mode = _a.mode;
                return (React.createElement(Theme.Consumer, { mode: mode, tokens: componentTokens }, function (tokens) { return (React.createElement(IconWrapper, __assign({}, iconWrapperOverrides, { tokens: tokens, isChecked: isChecked, isDisabled: isDisabled, isFocused: isFocused, isActive: isActive, isHovered: isHovered, isInvalid: isInvalid }), isIndeterminate ? (React.createElement(IconIndeterminate, { primaryColor: primaryColor, secondaryColor: secondaryColor, size: tokens.icon.size, label: "" })) : (React.createElement(Icon, { primaryColor: primaryColor, secondaryColor: secondaryColor, size: tokens.icon.size, label: "" })))); }));
            })));
    };
    CheckboxIcon.defaultProps = {
        primaryColor: 'inherit',
        secondaryColor: 'inherit',
        isIndeterminate: false,
        theme: function (current, props) { return current(props); },
    };
    return CheckboxIcon;
}(Component));
export default CheckboxIcon;
//# sourceMappingURL=CheckboxIcon.js.map
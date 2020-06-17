import { __assign, __extends, __rest } from "tslib";
import React, { Component } from 'react';
import memoize from 'memoize-one';
import { withAnalyticsEvents, withAnalyticsContext, createAndFireEvent, } from '@atlaskit/analytics-next';
import GlobalTheme from '@atlaskit/theme/components';
import Theme, { componentTokens } from './theme';
import { createExtender } from './utils';
import CheckboxIcon from './CheckboxIcon';
import { name as packageName, version as packageVersion } from './version.json';
import { LabelTextOverrides, LabelOverrides, CheckboxWrapper, RequiredIndicator, HiddenCheckbox, } from './elements';
var defaults = {
    Label: LabelOverrides,
    LabelText: LabelTextOverrides,
    HiddenCheckbox: {
        attributesFn: function () { return ({}); },
    },
};
var Checkbox = /** @class */ (function (_super) {
    __extends(Checkbox, _super);
    function Checkbox(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isActive: false,
            isFocused: false,
            isHovered: false,
            isMouseDown: false,
            isChecked: _this.props.isChecked !== undefined
                ? _this.props.isChecked
                : _this.props.defaultChecked,
        };
        _this.checkbox = undefined;
        _this.actionKeys = [' '];
        _this.onChange = function (event) {
            if (_this.props.isDisabled) {
                return null;
            }
            event.persist();
            if (event.target.checked !== undefined) {
                _this.setState({ isChecked: event.target.checked });
            }
            if (_this.props.onChange) {
                _this.props.onChange(event);
            }
            return true;
        };
        // expose blur/focus to consumers via ref
        _this.blur = function () {
            if (_this.checkbox && _this.checkbox.blur) {
                _this.checkbox.blur();
            }
        };
        _this.focus = function () {
            if (_this.checkbox && _this.checkbox.focus) {
                _this.checkbox.focus();
            }
        };
        _this.onBlur = function () {
            return _this.setState({
                // onBlur is called after onMouseDown if the checkbox was focused, however
                // in this case on blur is called immediately after, and we need to check
                // whether the mouse is down.
                isActive: _this.state.isMouseDown && _this.state.isActive,
                isFocused: false,
            });
        };
        _this.onFocus = function () { return _this.setState({ isFocused: true }); };
        _this.onMouseLeave = function () { return _this.setState({ isActive: false, isHovered: false }); };
        _this.onMouseEnter = function () { return _this.setState({ isHovered: true }); };
        _this.onMouseUp = function () { return _this.setState({ isActive: false, isMouseDown: false }); };
        _this.onMouseDown = function () { return _this.setState({ isActive: true, isMouseDown: true }); };
        _this.onKeyDown = function (event) {
            if (event.key in _this.actionKeys) {
                _this.setState({ isActive: true });
            }
        };
        _this.onKeyUp = function (event) {
            if (event.key in _this.actionKeys) {
                _this.setState({ isActive: false });
            }
        };
        _this.createExtender = memoize(createExtender);
        return _this;
    }
    Checkbox.prototype.componentDidMount = function () {
        var isIndeterminate = this.props.isIndeterminate;
        // there is no HTML attribute for indeterminate, and thus no prop equivalent.
        // it must be set via the ref.
        if (this.checkbox) {
            this.checkbox.indeterminate = !!isIndeterminate;
            if (this.props.inputRef) {
                this.props.inputRef(this.checkbox);
            }
        }
    };
    Checkbox.prototype.componentDidUpdate = function (prevProps) {
        var isIndeterminate = this.props.isIndeterminate;
        if (prevProps.isIndeterminate !== isIndeterminate && this.checkbox) {
            this.checkbox.indeterminate = !!isIndeterminate;
        }
    };
    Checkbox.prototype.render = function () {
        var _this = this;
        var _a = this.props, isDisabled = _a.isDisabled, isInvalid = _a.isInvalid, isIndeterminate = _a.isIndeterminate, label = _a.label, name = _a.name, overrides = _a.overrides, value = _a.value, isRequired = _a.isRequired, 
        //props not passed into HiddenCheckbox
        propsIsChecked = _a.isChecked, theme = _a.theme, testId = _a.testId;
        var isChecked = this.props.isChecked === undefined
            ? this.state.isChecked
            : propsIsChecked;
        var _b = this.state, isFocused = _b.isFocused, isActive = _b.isActive, isHovered = _b.isHovered;
        var getOverrides = createExtender(defaults, overrides);
        var _c = getOverrides('Label'), Label = _c.component, labelOverrides = __rest(_c, ["component"]);
        var _d = getOverrides('LabelText'), LabelText = _d.component, labelTextOverrides = __rest(_d, ["component"]);
        var hiddenCheckboxAttributesFn = getOverrides('HiddenCheckbox').attributesFn;
        return (React.createElement(Theme.Provider, { value: theme },
            React.createElement(GlobalTheme.Consumer, null, function (_a) {
                var mode = _a.mode;
                return (React.createElement(Theme.Consumer, { mode: mode, tokens: componentTokens }, function (tokens) { return (React.createElement(Label, __assign({}, labelOverrides, { isDisabled: isDisabled, onMouseDown: _this.onMouseDown, onMouseEnter: _this.onMouseEnter, onMouseLeave: _this.onMouseLeave, onMouseUp: _this.onMouseUp, tokens: tokens, testId: testId && testId + "--checkbox-label" }),
                    React.createElement(CheckboxWrapper, null,
                        React.createElement(HiddenCheckbox, { disabled: isDisabled, checked: isChecked, onChange: _this.onChange, onBlur: _this.onBlur, onFocus: _this.onFocus, onKeyUp: _this.onKeyUp, onKeyDown: _this.onKeyDown, value: value, name: name, ref: function (r) { return (_this.checkbox = r); }, required: isRequired, attributesFn: hiddenCheckboxAttributesFn, testId: testId && testId + "--hidden-checkbox" }),
                        React.createElement(CheckboxIcon, { theme: theme, overrides: {
                                IconWrapper: overrides && overrides.IconWrapper,
                                Icon: overrides && overrides.Icon,
                                IconIndeterminate: overrides && overrides.IconIndeterminate,
                            }, isChecked: isChecked, isDisabled: isDisabled, isFocused: isFocused, isActive: isActive, isHovered: isHovered, isInvalid: isInvalid, isIndeterminate: isIndeterminate, primaryColor: "inherit", secondaryColor: "inherit", label: "" })),
                    React.createElement(LabelText, __assign({}, labelTextOverrides, { tokens: tokens }),
                        label,
                        isRequired && (React.createElement(RequiredIndicator, { tokens: tokens, "aria-hidden": "true" }, "*"))))); }));
            })));
    };
    Checkbox.defaultProps = {
        isDisabled: false,
        isInvalid: false,
        defaultChecked: false,
        isIndeterminate: false,
        theme: function (current, props) { return current(props); },
    };
    return Checkbox;
}(Component));
export { Checkbox as CheckboxWithoutAnalytics };
var createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsContext({
    componentName: 'checkbox',
    packageName: packageName,
    packageVersion: packageVersion,
})(withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
        action: 'changed',
        actionSubject: 'checkbox',
        attributes: {
            componentName: 'checkbox',
            packageName: packageName,
            packageVersion: packageVersion,
        },
    }),
})(Checkbox));
//# sourceMappingURL=Checkbox.js.map
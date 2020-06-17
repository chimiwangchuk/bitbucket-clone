import { __assign, __extends, __rest } from "tslib";
import GlobalTheme from '@atlaskit/theme/components';
import React from 'react';
import { withAnalyticsEvents, withAnalyticsContext, createAndFireEvent, } from '@atlaskit/analytics-next';
import { name as packageName, version as packageVersion, } from '../version.json';
import Input from './Input';
import { Theme } from '../theme';
var Textfield = /** @class */ (function (_super) {
    __extends(Textfield, _super);
    function Textfield() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isFocused: false,
            isHovered: false,
        };
        _this.input = null;
        _this.handleOnFocus = function (event) {
            _this.setState({ isFocused: true });
            if (_this.props.onFocus) {
                _this.props.onFocus(event);
            }
        };
        _this.handleOnBlur = function (event) {
            _this.setState({ isFocused: false });
            if (_this.props.onBlur) {
                _this.props.onBlur(event);
            }
        };
        _this.handleOnMouseDown = function (event) {
            /** Running e.preventDefault() on the INPUT prevents double click behaviour */
            // Sadly we needed this cast as the target type is being correctly set
            var target = event.target;
            if (target.tagName !== 'INPUT') {
                event.preventDefault();
            }
            if (_this.input &&
                !_this.props.isDisabled &&
                document.activeElement !== _this.input) {
                _this.input.focus();
            }
            if (_this.props.onMouseDown) {
                _this.props.onMouseDown(event);
            }
        };
        _this.onMouseEnter = function () {
            if (!_this.props.isDisabled) {
                _this.setState({ isHovered: true });
            }
        };
        _this.onMouseLeave = function () {
            if (!_this.props.isDisabled) {
                _this.setState({ isHovered: false });
            }
        };
        // we want to keep a copy of the ref as well as pass it along
        _this.setInputRef = function (input) {
            _this.input = input;
            var forwardedRef = _this.props.forwardedRef;
            if (!forwardedRef) {
                return;
            }
            if (typeof forwardedRef === 'object') {
                // This is a blunder on the part of @types/react
                // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
                // .current should be assignable
                // @ts-ignore
                forwardedRef.current = input;
            }
            if (typeof forwardedRef === 'function') {
                forwardedRef(input);
            }
        };
        return _this;
    }
    Textfield.prototype.render = function () {
        var _this = this;
        var _a = this.state, isFocused = _a.isFocused, isHovered = _a.isHovered;
        var _b = this.props, 
        // Sadly need to pull these out.
        // It is injected by the HOC and we don't want to pass it onto the HTML input
        // @ts-ignore: not passed onto input
        createAnalyticsEvent = _b.createAnalyticsEvent, 
        // @ts-ignore: not passed onto input
        forwardedRef = _b.forwardedRef, appearance = _b.appearance, isCompact = _b.isCompact, isDisabled = _b.isDisabled, isInvalid = _b.isInvalid, isRequired = _b.isRequired, isReadOnly = _b.isReadOnly, isMonospaced = _b.isMonospaced, theme = _b.theme, width = _b.width, elemAfterInput = _b.elemAfterInput, elemBeforeInput = _b.elemBeforeInput, testId = _b.testId, otherProps = __rest(_b, ["createAnalyticsEvent", "forwardedRef", "appearance", "isCompact", "isDisabled", "isInvalid", "isRequired", "isReadOnly", "isMonospaced", "theme", "width", "elemAfterInput", "elemBeforeInput", "testId"]);
        return (React.createElement(Theme.Provider, { value: theme },
            React.createElement(GlobalTheme.Consumer, null, function (_a) {
                var mode = _a.mode;
                return (React.createElement(Theme.Consumer, { appearance: appearance, mode: mode, width: width, isDisabled: isDisabled, isCompact: isCompact, isMonospaced: isMonospaced, isFocused: isFocused, isHovered: isHovered, isInvalid: isInvalid }, function (tokens) { return (React.createElement(Input
                /* spreading before applying other props to prevent overwriting */
                , __assign({}, otherProps, { isDisabled: isDisabled, isReadOnly: isReadOnly, isRequired: isRequired, theme: tokens, onBlur: _this.handleOnBlur, onFocus: _this.handleOnFocus, onMouseEnter: _this.onMouseEnter, onMouseLeave: _this.onMouseLeave, onMouseDown: _this.handleOnMouseDown, elemAfterInput: elemAfterInput, elemBeforeInput: elemBeforeInput, innerRef: _this.setInputRef, testId: testId }))); }));
            })));
    };
    Textfield.defaultProps = {
        appearance: 'standard',
        isCompact: false,
        isMonospaced: false,
        isInvalid: false,
        isRequired: false,
        isReadOnly: false,
        isDisabled: false,
    };
    return Textfield;
}(React.Component));
var ForwardRefTextfield = React.forwardRef(function (props, ref) { return React.createElement(Textfield, __assign({}, props, { forwardedRef: ref })); });
export { ForwardRefTextfield as TextFieldWithoutAnalytics };
var createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsContext({
    componentName: 'textField',
    packageName: packageName,
    packageVersion: packageVersion,
})(withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
        action: 'blurred',
        actionSubject: 'textField',
        attributes: {
            componentName: 'textField',
            packageName: packageName,
            packageVersion: packageVersion,
        },
    }),
    onFocus: createAndFireEventOnAtlaskit({
        action: 'focused',
        actionSubject: 'textField',
        attributes: {
            componentName: 'textField',
            packageName: packageName,
            packageVersion: packageVersion,
        },
    }),
})(ForwardRefTextfield));
//# sourceMappingURL=Textfield.js.map
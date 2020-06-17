import { __assign } from "tslib";
var getAppearanceProps = function (props) { return ({
    appearance: props.appearance,
    backgroundColor: props.backgroundColor,
    borderColor: props.borderColor,
    groupAppearance: props.groupAppearance,
    isActive: props.isActive,
    isDisabled: props.isDisabled,
    isFocus: props.isFocus,
    isHover: props.isHover,
    isInteractive: props.isInteractive,
    isSelected: props.isSelected,
    size: props.size,
    stackIndex: props.stackIndex,
}); };
var getInteractionProps = function (props) { return ({
    onBlur: props.onBlur,
    onClick: props.onClick,
    onFocus: props.onFocus,
    onKeyDown: props.onKeyDown,
    onKeyUp: props.onKeyUp,
    onMouseDown: props.onMouseDown,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    onMouseUp: props.onMouseUp,
    tabIndex: props.tabIndex,
}); };
var getLinkElementProps = function (props) {
    var href = props.href, target = props.target;
    // handle security issue for consumer
    // https://mathiasbynens.github.io/rel-noopener
    var rel = target === '_blank' ? 'noopener noreferrer' : null;
    return { href: href, rel: rel, target: target };
};
var getButtonElementProps = function (props) {
    var id = props.id, isDisabled = props.isDisabled;
    return { id: id, interface: 'button', disabled: isDisabled };
};
export default function getProps(component) {
    var props = component.props;
    var defaultProps = __assign(__assign({}, getAppearanceProps(props)), getInteractionProps(props));
    if (props.component) {
        return __assign(__assign({}, defaultProps), props);
    }
    if (props.href) {
        if (props.isDisabled) {
            return defaultProps;
        }
        return __assign(__assign({}, defaultProps), getLinkElementProps(props));
    }
    if (props.onClick) {
        return __assign(__assign({}, defaultProps), getButtonElementProps(props));
    }
    return defaultProps;
}
//# sourceMappingURL=getProps.js.map
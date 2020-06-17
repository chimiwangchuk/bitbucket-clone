import { __extends } from "tslib";
import React from 'react';
var _a = React.createContext({
    isOpen: true,
    onExited: function () { },
}), Consumer = _a.Consumer, Provider = _a.Provider;
// checks if children exist and are truthy
var hasChildren = function (children) {
    return React.Children.count(children) > 0 &&
        React.Children.map(children, function (child) { return !!child; }).filter(Boolean).length > 0;
};
var Transition = /** @class */ (function (_super) {
    __extends(Transition, _super);
    function Transition() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            currentChildren: undefined,
        };
        _this.onExited = function () {
            _this.setState({
                currentChildren: _this.props.children,
            });
        };
        return _this;
    }
    Transition.getDerivedStateFromProps = function (props, state) {
        var previousChildren = state.currentChildren;
        var exiting = hasChildren(previousChildren) && !hasChildren(props.children);
        return {
            currentChildren: exiting ? previousChildren : props.children,
        };
    };
    Transition.prototype.render = function () {
        return (React.createElement(Provider, { value: {
                onExited: this.onExited,
                isOpen: hasChildren(this.props.children),
            } }, this.state.currentChildren));
    };
    return Transition;
}(React.Component));
export var ModalTransitionConsumer = Consumer;
export default Transition;
//# sourceMappingURL=ModalTransition.js.map
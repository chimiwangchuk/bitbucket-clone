import { __extends, __read, __spread } from "tslib";
import React from 'react';
// This is the source of truth for open modals
var stackConsumers = [];
// This component provides the position of a modal dialog in the list of all open dialogs.
// The key behaviours are:
// - When a modal renders for the first time it takes the first stack position
// - When a modal mounts, all other modals have to adjust their position
// - When a modal unmounts, all other modals have to adjust their position
var StackConsumer = /** @class */ (function (_super) {
    __extends(StackConsumer, _super);
    function StackConsumer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            stackIndex: 0,
        };
        _this.update = function () {
            var stackIndex = stackConsumers.indexOf(_this.update);
            if (_this.state.stackIndex !== stackIndex) {
                _this.setState({ stackIndex: stackIndex });
            }
        };
        return _this;
    }
    StackConsumer.prototype.componentDidMount = function () {
        stackConsumers.forEach(function (updateFn) { return updateFn(); });
    };
    StackConsumer.prototype.componentWillUnmount = function () {
        var _this = this;
        // This check will pass if the <Transition><Modal/></Transition> pattern has not been
        // implemented correctly. In this case, will still need to make sure we remove ourselves
        // from the stack list.
        if (stackConsumers.indexOf(this.update) !== -1) {
            stackConsumers = stackConsumers.filter(function (stack) { return stack !== _this.update; });
            stackConsumers.forEach(function (updateFn) { return updateFn(); });
        }
    };
    StackConsumer.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        if (prevProps.isOpen && !this.props.isOpen) {
            stackConsumers = stackConsumers.filter(function (stack) { return stack !== _this.update; });
            stackConsumers.forEach(function (updateFn) { return updateFn(); });
        }
    };
    StackConsumer.prototype.render = function () {
        if (stackConsumers.indexOf(this.update) === -1) {
            // add this instance to stack consumer list
            stackConsumers = __spread([this.update], stackConsumers);
        }
        return this.props.children(this.state.stackIndex);
    };
    return StackConsumer;
}(React.Component));
export default StackConsumer;
//# sourceMappingURL=StackConsumer.js.map
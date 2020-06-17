import { __extends } from "tslib";
import React from 'react';
// This component was born from the pain of using render props in lifecycle methods.
// On update, it checks whether the current value prop is equal to the previous value prop.
// If they are different, it calls the onChange function.
// We use this for updating Popper when the SpotlightDialog width changes.
var ValueChanged = /** @class */ (function (_super) {
    __extends(ValueChanged, _super);
    function ValueChanged() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValueChanged.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.value !== this.props.value) {
            this.props.onChange();
        }
    };
    ValueChanged.prototype.render = function () {
        return this.props.children;
    };
    return ValueChanged;
}(React.Component));
export default ValueChanged;
//# sourceMappingURL=ValueChanged.js.map
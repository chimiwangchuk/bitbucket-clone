import { __extends } from "tslib";
import React from 'react';
import invariant from 'tiny-invariant';
import ReactFocusLock from 'react-focus-lock';
// Thin wrapper over react-focus-lock. This wrapper only exists to ensure API compatibility.
// This component should be deleted during https://ecosystem.atlassian.net/browse/AK-5658
var FocusLock = /** @class */ (function (_super) {
    __extends(FocusLock, _super);
    function FocusLock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FocusLock.prototype.componentDidMount = function () {
        var _a = this.props, isEnabled = _a.isEnabled, autoFocus = _a.autoFocus;
        if (process.env.NODE_ENV !== 'production') {
            invariant(typeof autoFocus === 'boolean', '@atlaskit/modal-dialog: Passing a function as autoFocus is deprecated. Instead call focus on the element ref or use the autofocus property.');
        }
        if (typeof autoFocus === 'function' && isEnabled) {
            var elem = autoFocus();
            if (elem && elem.focus) {
                elem.focus();
            }
        }
    };
    FocusLock.prototype.render = function () {
        var _a = this.props, isEnabled = _a.isEnabled, autoFocus = _a.autoFocus, shouldReturnFocus = _a.shouldReturnFocus;
        return (React.createElement(ReactFocusLock, { disabled: !isEnabled, autoFocus: !!autoFocus, returnFocus: shouldReturnFocus }, this.props.children));
    };
    FocusLock.defaultProps = {
        autoFocus: true,
        isEnabled: true,
        shouldReturnFocus: true,
    };
    return FocusLock;
}(React.Component));
export default FocusLock;
//# sourceMappingURL=FocusLock.js.map
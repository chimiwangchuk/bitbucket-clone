import { __extends } from "tslib";
import React, { Component } from 'react';
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
        var _a = this.props, isFocusLockEnabled = _a.isFocusLockEnabled, autoFocusFirstElem = _a.autoFocusFirstElem;
        if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
            invariant(typeof autoFocusFirstElem === 'boolean', '@atlaskit/modal-dialog: Passing a function as autoFocus is deprecated. Instead call focus on the element ref or use the autofocus property.');
        }
        if (typeof autoFocusFirstElem === 'function' && isFocusLockEnabled) {
            var elem = autoFocusFirstElem();
            if (elem && elem.focus) {
                elem.focus();
            }
        }
    };
    FocusLock.prototype.render = function () {
        var _a = this.props, isFocusLockEnabled = _a.isFocusLockEnabled, autoFocusFirstElem = _a.autoFocusFirstElem, shouldReturnFocus = _a.shouldReturnFocus;
        return (React.createElement(ReactFocusLock, { disabled: !isFocusLockEnabled, autoFocus: !!autoFocusFirstElem, returnFocus: shouldReturnFocus }, this.props.children));
    };
    return FocusLock;
}(Component));
export default FocusLock;
//# sourceMappingURL=focus-lock.js.map
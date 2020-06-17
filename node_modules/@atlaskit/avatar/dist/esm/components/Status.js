import { __extends } from "tslib";
import React, { Component } from 'react';
import { Inner, Outer } from '../styled/Icon';
import getStatusSVG from '../helpers/getStatusSVG';
var Status = /** @class */ (function (_super) {
    __extends(Status, _super);
    function Status() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Status.prototype.render = function () {
        var _a = this.props, borderColor = _a.borderColor, children = _a.children, status = _a.status, size = _a.size;
        return (React.createElement(Outer, { size: size, bgColor: borderColor },
            React.createElement(Inner, null, children || (status && getStatusSVG(status)))));
    };
    return Status;
}(Component));
export default Status;
//# sourceMappingURL=Status.js.map
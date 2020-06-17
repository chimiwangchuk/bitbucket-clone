import { __extends } from "tslib";
import React, { Component } from 'react';
import { Inner, Outer } from '../styled/Icon';
import getPresenceSVG from '../helpers/getPresenceSVG';
var Presence = /** @class */ (function (_super) {
    __extends(Presence, _super);
    function Presence() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Presence.prototype.render = function () {
        var _a = this.props, borderColor = _a.borderColor, children = _a.children, presence = _a.presence, size = _a.size;
        return (React.createElement(Outer, { size: size, bgColor: borderColor },
            React.createElement(Inner, null, children || (presence && getPresenceSVG(presence)))));
    };
    return Presence;
}(Component));
export default Presence;
//# sourceMappingURL=Presence.js.map
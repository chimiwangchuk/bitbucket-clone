import { __assign, __rest } from "tslib";
import React from 'react';
import { PositionerAbsolute, PositionerRelative } from '../styled/Modal';
var Positioner = function Positioner(_a) {
    var scrollBehavior = _a.scrollBehavior, props = __rest(_a, ["scrollBehavior"]);
    var PositionComponent = scrollBehavior === 'inside' ? PositionerAbsolute : PositionerRelative;
    return React.createElement(PositionComponent, __assign({}, props));
};
export default Positioner;
//# sourceMappingURL=Positioner.js.map
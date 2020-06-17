import { __extends } from "tslib";
import React, { Component } from 'react';
import NodeResolver from 'react-node-resolver';
import { TargetConsumer } from './SpotlightManager';
var SpotlightTarget = /** @class */ (function (_super) {
    __extends(SpotlightTarget, _super);
    function SpotlightTarget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpotlightTarget.prototype.render = function () {
        var _this = this;
        return (React.createElement(TargetConsumer, null, function (targetRef) {
            return targetRef ? (React.createElement(NodeResolver, { innerRef: targetRef(_this.props.name) }, _this.props.children)) : (_this.props.children);
        }));
    };
    return SpotlightTarget;
}(Component));
export default SpotlightTarget;
//# sourceMappingURL=SpotlightTarget.js.map
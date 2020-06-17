import { __assign } from "tslib";
import React from 'react';
import { Theme } from '../theme';
var Avatar = function (props) { return (React.createElement(Theme.Consumer, __assign({}, props, { includeBorderWidth: true }), function (_a) {
    var dimensions = _a.dimensions;
    return (React.createElement("div", { "data-testid": props.testId, style: __assign({ display: 'inline-block', position: 'relative', outline: 0, zIndex: props.stackIndex }, dimensions) }, props.children));
})); };
export default Avatar;
export var PresenceWrapper = function (props) { return (React.createElement(Theme.Consumer, __assign({}, props, { includeBorderWidth: true }), function (_a) {
    var presence = _a.presence;
    return (React.createElement("span", { style: __assign({ pointerEvents: 'none', position: 'absolute' }, presence) }, props.children));
})); };
export var StatusWrapper = function (props) { return (React.createElement(Theme.Consumer, __assign({}, props, { includeBorderWidth: true }), function (_a) {
    var status = _a.status;
    return (React.createElement("span", { style: __assign({ position: 'absolute' }, status) }, props.children));
})); };
//# sourceMappingURL=Avatar.js.map
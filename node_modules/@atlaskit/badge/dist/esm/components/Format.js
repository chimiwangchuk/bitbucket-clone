import React from 'react';
var Fragment = React.Fragment;
var Format = function (props) {
    var formatted = '';
    var _a = props.children, children = _a === void 0 ? 0 : _a, _b = props.max, max = _b === void 0 ? 0 : _b;
    if (children < 0) {
        children = 0;
    }
    if (max < 0) {
        max = 0;
    }
    if (max && max < children) {
        formatted = max + "+";
    }
    else if (children === Infinity) {
        formatted = '∞';
    }
    else {
        formatted = children;
    }
    return React.createElement(Fragment, null, formatted);
};
export default Format;
//# sourceMappingURL=Format.js.map
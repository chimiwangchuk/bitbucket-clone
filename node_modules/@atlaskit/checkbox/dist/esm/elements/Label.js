import { __assign } from "tslib";
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { defaultAttributesFn } from '../utils';
export var labelCSS = function (_a) {
    var isDisabled = _a.isDisabled, tokens = _a.tokens;
    return (__assign({ alignItems: 'flex-start', display: 'flex', color: isDisabled
            ? tokens.label.textColor.disabled
            : tokens.label.textColor.rest }, (isDisabled && { cursor: 'not-allowed' })));
};
export function Label(_a) {
    var attributesFn = _a.attributesFn, children = _a.children, isDisabled = _a.isDisabled, onMouseUp = _a.onMouseUp, onMouseDown = _a.onMouseDown, onMouseLeave = _a.onMouseLeave, onMouseEnter = _a.onMouseEnter, tokens = _a.tokens, cssFn = _a.cssFn, testId = _a.testId;
    return (jsx("label", __assign({}, attributesFn({ isDisabled: isDisabled }), { onMouseUp: onMouseUp, onMouseDown: onMouseDown, onMouseLeave: onMouseLeave, onMouseEnter: onMouseEnter, css: cssFn({ isDisabled: isDisabled, tokens: tokens }), "data-testid": testId }), children));
}
export default {
    component: Label,
    cssFn: labelCSS,
    attributesFn: defaultAttributesFn,
};
//# sourceMappingURL=Label.js.map
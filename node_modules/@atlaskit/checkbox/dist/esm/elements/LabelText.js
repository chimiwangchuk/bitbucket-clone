import { __assign } from "tslib";
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { defaultAttributesFn } from '../utils';
export var labelTextCSS = function (_a) {
    var tokens = _a.tokens;
    return ({
        paddingTop: tokens.label.spacing.top,
        paddingRight: tokens.label.spacing.right,
        paddingBottom: tokens.label.spacing.bottom,
        paddingLeft: tokens.label.spacing.left,
    });
};
export function LabelText(_a) {
    var attributesFn = _a.attributesFn, tokens = _a.tokens, children = _a.children, cssFn = _a.cssFn;
    return (jsx("span", __assign({}, attributesFn(), { css: cssFn({ tokens: tokens }) }), children));
}
export default {
    component: LabelText,
    cssFn: labelTextCSS,
    attributesFn: defaultAttributesFn,
};
//# sourceMappingURL=LabelText.js.map
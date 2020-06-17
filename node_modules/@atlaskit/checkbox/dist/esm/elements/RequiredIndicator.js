import { __assign, __rest } from "tslib";
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { math, gridSize } from '@atlaskit/theme';
export default (function (_a) {
    var tokens = _a.tokens, props = __rest(_a, ["tokens"]);
    return (jsx("span", __assign({ css: {
            color: tokens.requiredIndicator.textColor.rest,
            paddingLeft: math.multiply(gridSize, 0.25) + "px;",
        } }, props)));
});
//# sourceMappingURL=RequiredIndicator.js.map
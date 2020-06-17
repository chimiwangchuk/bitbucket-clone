import { jsx } from '@emotion/core';
import { gridSize } from '@atlaskit/theme/constants';
var HORIZONTAL_SPACING = gridSize() / 2 + "px";
export default (function (_a) {
    var maxWidth = _a.maxWidth, children = _a.children;
    return (jsx("span", { css: {
            display: 'inline-block',
            verticalAlign: 'top',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            padding: "0 " + HORIZONTAL_SPACING,
            maxWidth: typeof maxWidth === 'number' ? maxWidth + "px" : maxWidth,
            width: '100%',
        } }, children));
});
//# sourceMappingURL=Content.js.map
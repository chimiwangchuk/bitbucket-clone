import { jsx } from '@emotion/core';
import { borderRadius } from '@atlaskit/theme/constants';
var BORDER_RADIUS = borderRadius() + "px";
export default (function (_a) {
    var backgroundColor = _a.backgroundColor, textColor = _a.textColor, children = _a.children, testId = _a.testId;
    return (jsx("span", { css: {
            backgroundColor: backgroundColor,
            borderRadius: BORDER_RADIUS,
            boxSizing: 'border-box',
            color: textColor,
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            lineHeight: 1,
            maxWidth: '100%',
            padding: '2px 0 3px 0',
            textTransform: 'uppercase',
            verticalAlign: 'baseline',
        }, "data-testid": testId }, children));
});
//# sourceMappingURL=Container.js.map
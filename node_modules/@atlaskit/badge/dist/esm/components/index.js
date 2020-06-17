import { __assign } from "tslib";
import React from 'react';
import GlobalTheme from '@atlaskit/theme/components';
import Container from './Container';
import Format from './Format';
import { Theme } from '../theme';
var Badge = function (_a) {
    var theme = _a.theme, _b = _a.appearance, appearance = _b === void 0 ? 'default' : _b, _c = _a.children, children = _c === void 0 ? 0 : _c, _d = _a.max, max = _d === void 0 ? 99 : _d, testId = _a.testId;
    return (React.createElement(Theme.Provider, { value: theme },
        React.createElement(GlobalTheme.Consumer, null, function (_a) {
            var mode = _a.mode;
            return (React.createElement(Theme.Consumer, { appearance: appearance, mode: mode }, function (tokens) { return (React.createElement(Container, __assign({}, tokens, { "data-testid": testId }), typeof children === 'string' ? (children) : (React.createElement(Format, { max: max }, children)))); }));
        })));
};
export default Badge;
//# sourceMappingURL=index.js.map
import { __assign, __extends } from "tslib";
import React, { PureComponent } from 'react';
import Container from './Container';
import Content from './Content';
import { Theme } from '../theme';
var Lozenge = /** @class */ (function (_super) {
    __extends(Lozenge, _super);
    function Lozenge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lozenge.prototype.render = function () {
        var _a = this.props, theme = _a.theme, children = _a.children, testId = _a.testId;
        return (React.createElement(Theme.Provider, { value: theme },
            React.createElement(Theme.Consumer, __assign({}, this.props), function (themeTokens) { return (React.createElement(Container, __assign({ testId: testId }, themeTokens),
                React.createElement(Content, __assign({}, themeTokens), children))); })));
    };
    Lozenge.defaultProps = {
        isBold: false,
        appearance: 'default',
        maxWidth: 200,
    };
    return Lozenge;
}(PureComponent));
export default Lozenge;
//# sourceMappingURL=index.js.map
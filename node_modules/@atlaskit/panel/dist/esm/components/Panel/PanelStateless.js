import { __extends } from "tslib";
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import React, { PureComponent } from 'react';
import AnimateHeight from 'react-animate-height';
import * as styles from './styledPanel';
var PanelStateless = /** @class */ (function (_super) {
    __extends(PanelStateless, _super);
    function PanelStateless() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PanelStateless.prototype.render = function () {
        var _a = this.props, children = _a.children, header = _a.header, isExpanded = _a.isExpanded, onChange = _a.onChange;
        return (React.createElement(styles.PanelWrapper, null,
            React.createElement(styles.PanelHeader, { onClick: function () { return onChange(!isExpanded); } },
                React.createElement(styles.ButtonWrapper, { isHidden: isExpanded },
                    React.createElement(Button, { appearance: "subtle", "aria-expanded": isExpanded, spacing: "none", iconBefore: isExpanded ? (React.createElement(ChevronDownIcon, { label: "collapse" })) : (React.createElement(ChevronRightIcon, { label: "expand" })) })),
                React.createElement("span", null, header)),
            React.createElement(AnimateHeight, { duration: 200, easing: "linear", height: isExpanded ? 'auto' : 0 }, children)));
    };
    PanelStateless.defaultProps = {
        isExpanded: false,
    };
    return PanelStateless;
}(PureComponent));
export default PanelStateless;
//# sourceMappingURL=PanelStateless.js.map
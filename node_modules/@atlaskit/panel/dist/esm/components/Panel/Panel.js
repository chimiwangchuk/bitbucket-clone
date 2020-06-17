import { __extends } from "tslib";
import React, { PureComponent } from 'react';
import PanelStateless from './PanelStateless';
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isExpanded: !!_this.props.isDefaultExpanded,
        };
        _this.handleChange = function () {
            _this.setState(function (prevState) { return ({
                isExpanded: !prevState.isExpanded,
            }); });
        };
        return _this;
    }
    Panel.prototype.render = function () {
        var _a = this.props, children = _a.children, header = _a.header;
        var isExpanded = this.state.isExpanded;
        return (React.createElement(PanelStateless, { header: header, isExpanded: isExpanded, onChange: this.handleChange }, children));
    };
    Panel.defaultProps = {
        isDefaultExpanded: false,
    };
    return Panel;
}(PureComponent));
export default Panel;
//# sourceMappingURL=Panel.js.map
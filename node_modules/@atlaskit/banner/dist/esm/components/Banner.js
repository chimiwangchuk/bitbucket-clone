import { __extends } from "tslib";
import React from 'react';
import { Container, Content, Icon, Text, Visibility } from '../styled';
var Banner = /** @class */ (function (_super) {
    __extends(Banner, _super);
    function Banner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            height: 0,
        };
        _this.getHeight = function () {
            if (_this.containerRef) {
                _this.setState({ height: _this.containerRef.clientHeight });
            }
        };
        _this.innerRef = function (ref) {
            _this.containerRef = ref;
            if (_this.props.innerRef) {
                _this.props.innerRef(ref);
            }
            _this.getHeight();
        };
        return _this;
    }
    Banner.prototype.render = function () {
        var _a = this.props, appearance = _a.appearance, children = _a.children, icon = _a.icon, isOpen = _a.isOpen, testId = _a.testId;
        return (React.createElement(Visibility, { bannerHeight: this.state.height, isOpen: isOpen },
            React.createElement(Container, { innerRef: this.innerRef, appearance: appearance, "aria-hidden": !isOpen, role: "alert", "data-testid": testId },
                React.createElement(Content, { appearance: appearance },
                    React.createElement(Icon, null, icon),
                    React.createElement(Text, { appearance: appearance }, children)))));
    };
    Banner.defaultProps = {
        appearance: 'warning',
        isOpen: false,
    };
    return Banner;
}(React.Component));
export default Banner;
//# sourceMappingURL=Banner.js.map
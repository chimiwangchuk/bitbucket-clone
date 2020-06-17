import { __extends } from "tslib";
import React from 'react';
import Button from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import IconForType from '../IconForType';
import { Root, ButtonContents, Text, Title } from './styledInlineMessage';
var InlineMessage = /** @class */ (function (_super) {
    __extends(InlineMessage, _super);
    function InlineMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isOpen: false,
            isHovered: false,
        };
        _this.onMouseEnter = function () {
            _this.setState({ isHovered: true });
        };
        _this.onMouseLeave = function () {
            _this.setState({ isHovered: false });
        };
        _this.toggleDialog = function () {
            _this.setState({ isOpen: !_this.state.isOpen });
        };
        return _this;
    }
    InlineMessage.prototype.render = function () {
        var _this = this;
        var _a = this.props, children = _a.children, placement = _a.placement, secondaryText = _a.secondaryText, title = _a.title, type = _a.type, testId = _a.testId;
        var _b = this.state, isHovered = _b.isHovered, isOpen = _b.isOpen;
        return (React.createElement(Root, { onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, appearance: type, "data-testid": testId },
            React.createElement(InlineDialog, { onClose: function () {
                    _this.setState({ isOpen: false });
                }, content: children, isOpen: isOpen, placement: placement, testId: testId && testId + "--inline-dialog" },
                React.createElement(Button, { appearance: "subtle-link", onClick: this.toggleDialog, spacing: "none", testId: testId && testId + "--button" },
                    React.createElement(ButtonContents, { isHovered: isHovered },
                        React.createElement(IconForType, { type: type, isHovered: isHovered, isOpen: isOpen }),
                        title ? (React.createElement(Title, { "data-testid": testId && testId + "--title", isHovered: isHovered }, title)) : null,
                        secondaryText ? (React.createElement(Text, { "data-testid": testId && testId + "--text", isHovered: isHovered }, secondaryText)) : null)))));
    };
    InlineMessage.defaultProps = {
        children: null,
        placement: 'bottom-start',
        secondaryText: '',
        title: '',
        type: 'connectivity',
    };
    return InlineMessage;
}(React.Component));
export default InlineMessage;
//# sourceMappingURL=index.js.map
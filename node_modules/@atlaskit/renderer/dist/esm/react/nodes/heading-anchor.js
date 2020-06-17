import { __awaiter, __extends, __generator, __makeTemplateObject } from "tslib";
import React from 'react';
import styled from 'styled-components';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import { injectIntl } from 'react-intl';
import { headingAnchorLinkMessages } from '../../messages';
export var HeadingAnchorWrapperClassName = 'heading-anchor-wrapper';
var CopyAnchorWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  position: absolute;\n  align-items: center;\n  overflow: hidden;\n  right: 0;\n  width: 32px;\n  height: 100%;\n"], ["\n  display: flex;\n  position: absolute;\n  align-items: center;\n  overflow: hidden;\n  right: 0;\n  width: 32px;\n  height: 100%;\n"])));
var CopyAnchor = styled.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  outline: none;\n  background-color: transparent;\n  border: none;\n  color: ", ";\n  cursor: pointer;\n  right: 0;\n  height: 100%;\n"], ["\n  outline: none;\n  background-color: transparent;\n  border: none;\n  color: ", ";\n  cursor: pointer;\n  right: 0;\n  height: 100%;\n"])), colors.N500);
var HeadingAnchor = /** @class */ (function (_super) {
    __extends(HeadingAnchor, _super);
    function HeadingAnchor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.initialTooltipMessage = _this.props.intl.formatMessage(headingAnchorLinkMessages.copyHeadingLinkToClipboard);
        _this.state = {
            tooltipMessage: _this.initialTooltipMessage,
        };
        _this.copyToClipboard = function () { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // This is needed to reset tooltip to reposition it.
                        // Might be better to fix tooltip reposition bug.
                        // https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6548
                        this.setState({ tooltipMessage: '' });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.props.onCopyText()];
                    case 2:
                        _a.sent();
                        this.setState({
                            tooltipMessage: this.props.intl.formatMessage(headingAnchorLinkMessages.copiedHeadingLinkToClipboard),
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.setState({
                            tooltipMessage: this.props.intl.formatMessage(headingAnchorLinkMessages.failedToCopyHeadingLink),
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.resetMessage = function () {
            _this.setState({ tooltipMessage: '' });
            _this.resetMsgTimeoutId = window.setTimeout(function () {
                _this.setState({ tooltipMessage: _this.initialTooltipMessage });
            }, 0);
        };
        return _this;
    }
    HeadingAnchor.prototype.componentWillUnmount = function () {
        window.clearTimeout(this.resetMsgTimeoutId);
    };
    HeadingAnchor.prototype.renderAnchor = function () {
        return (React.createElement(CopyAnchor, { onMouseLeave: this.resetMessage, onClick: this.copyToClipboard },
            React.createElement(LinkIcon, { label: "copy", size: "small" })));
    };
    HeadingAnchor.prototype.render = function () {
        return (React.createElement("div", { className: HeadingAnchorWrapperClassName },
            React.createElement(CopyAnchorWrapper, null, this.state.tooltipMessage ? (React.createElement(Tooltip, { content: this.state.tooltipMessage, position: "top", delay: 0 }, this.renderAnchor())) : (React.createElement("div", null, this.renderAnchor())))));
    };
    return HeadingAnchor;
}(React.PureComponent));
export default injectIntl(HeadingAnchor);
var templateObject_1, templateObject_2;
//# sourceMappingURL=heading-anchor.js.map
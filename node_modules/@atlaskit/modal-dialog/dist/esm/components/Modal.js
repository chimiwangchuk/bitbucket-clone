import { __extends } from "tslib";
import React from 'react';
import { canUseDOM } from 'exenv';
import { withAnalyticsEvents, withAnalyticsContext, createAndFireEvent, } from '@atlaskit/analytics-next';
import Blanket from '@atlaskit/blanket';
import { name as packageName, version as packageVersion, } from '../version.json';
import { WIDTH_ENUM } from '../shared-variables';
import { Dialog, FillScreen as StyledFillScreen } from '../styled/Modal';
import { Animation } from './Animation';
import Content from './Content';
import FocusLock from './FocusLock';
import Positioner from './Positioner';
function getScrollDistance() {
    return (window.pageYOffset ||
        (document.documentElement && document.documentElement.scrollTop) ||
        (document.body && document.body.scrollTop) ||
        0);
}
var Modal = /** @class */ (function (_super) {
    __extends(Modal, _super);
    function Modal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            dialogNode: null,
            scrollDistance: canUseDOM ? getScrollDistance() : 0,
            isExiting: false,
        };
        /* Prevent window from being scrolled programatically so that the modal is positioned correctly
         * and to prevent scrollIntoView from scrolling the window.
         */
        _this.handleWindowScroll = function () {
            if (getScrollDistance() !== _this.state.scrollDistance) {
                window.scrollTo(window.pageXOffset, _this.state.scrollDistance);
            }
        };
        _this.handleOverlayClick = function (e) {
            if (_this.props.shouldCloseOnOverlayClick) {
                _this.props.onClose(e);
            }
        };
        return _this;
    }
    Modal.prototype.componentDidMount = function () {
        var scrollDistance = getScrollDistance();
        if (getScrollDistance() !== this.state.scrollDistance) {
            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({ scrollDistance: scrollDistance });
        }
        window.addEventListener('scroll', this.handleWindowScroll);
    };
    Modal.prototype.componentWillUnmount = function () {
        window.removeEventListener('scroll', this.handleWindowScroll);
    };
    Modal.prototype.render = function () {
        var _this = this;
        var _a = this.props, actions = _a.actions, appearance = _a.appearance, autoFocus = _a.autoFocus, body = _a.body, children = _a.children, components = _a.components, footer = _a.footer, header = _a.header, height = _a.height, isChromeless = _a.isChromeless, isHeadingMultiline = _a.isHeadingMultiline, isOpen = _a.isOpen, onClose = _a.onClose, onCloseComplete = _a.onCloseComplete, onOpenComplete = _a.onOpenComplete, onStackChange = _a.onStackChange, shouldCloseOnEscapePress = _a.shouldCloseOnEscapePress, stackIndex = _a.stackIndex, heading = _a.heading, width = _a.width, scrollBehavior = _a.scrollBehavior, testId = _a.testId;
        var scrollDistance = this.state.scrollDistance;
        var isBackground = stackIndex != null && stackIndex > 0;
        // If a custom width (number or percentage) is supplied, set inline style
        // otherwise allow styled component to consume as named prop
        var widthName = width
            ? WIDTH_ENUM.values.indexOf(width.toString()) !== -1
                ? width
                : undefined
            : undefined;
        var widthValue = widthName ? undefined : width;
        return (React.createElement(Animation, { in: isOpen, onExited: onCloseComplete, onEntered: onOpenComplete, stackIndex: stackIndex }, function (_a) {
            var fade = _a.fade, slide = _a.slide;
            return (React.createElement(StyledFillScreen, { style: fade, "aria-hidden": isBackground, scrollDistance: scrollDistance },
                React.createElement(FocusLock, { isEnabled: stackIndex === 0 && isOpen, autoFocus: autoFocus },
                    React.createElement(Blanket, { isTinted: true, onBlanketClicked: _this.handleOverlayClick }),
                    React.createElement(Positioner, { style: slide, scrollBehavior: scrollBehavior, widthName: widthName, widthValue: widthValue },
                        React.createElement(Dialog, { heightValue: height, isChromeless: isChromeless, role: "dialog", "data-testid": testId, tabIndex: -1 },
                            React.createElement(Content, { actions: actions, appearance: appearance, components: components, footer: footer, heading: heading, isHeadingMultiline: isHeadingMultiline, header: header, onClose: onClose, shouldScroll: scrollBehavior === 'inside', shouldCloseOnEscapePress: shouldCloseOnEscapePress, onStackChange: onStackChange, isChromeless: isChromeless, stackIndex: stackIndex, body: body }, children))))));
        }));
    };
    Modal.defaultProps = {
        autoFocus: true,
        scrollBehavior: 'inside',
        shouldCloseOnEscapePress: true,
        shouldCloseOnOverlayClick: true,
        isChromeless: false,
        isOpen: true,
        stackIndex: 0,
        width: 'medium',
        isHeadingMultiline: true,
        onClose: function () { },
    };
    return Modal;
}(React.Component));
var createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export var ModalDialogWithoutAnalytics = Modal;
export default withAnalyticsContext({
    componentName: 'modalDialog',
    packageName: packageName,
    packageVersion: packageVersion,
})(withAnalyticsEvents({
    onClose: createAndFireEventOnAtlaskit({
        action: 'closed',
        actionSubject: 'modalDialog',
        attributes: {
            componentName: 'modalDialog',
            packageName: packageName,
            packageVersion: packageVersion,
        },
    }),
})(Modal));
//# sourceMappingURL=Modal.js.map
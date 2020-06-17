import { __assign, __extends, __read, __spread } from "tslib";
import React, { Component } from 'react';
import { withAnalyticsEvents, withAnalyticsContext, createAndFireEvent, } from '@atlaskit/analytics-next';
import Tooltip from '@atlaskit/tooltip';
import { name as packageName, version as packageVersion, } from '../version.json';
import { propsOmittedFromClickData } from './constants';
import Presence from './Presence';
import AvatarImage from './AvatarImage';
import Status from './Status';
import Outer, { PresenceWrapper, StatusWrapper } from '../styled/Avatar';
import { omit } from '../utils';
import { getProps, getStyledAvatar } from '../helpers';
import { mapProps, withPseudoState } from '../hoc';
import { Theme } from '../theme';
import { ICON_SIZES } from '../styled/constants';
var validIconSizes = Object.keys(ICON_SIZES);
var warn = function (message) {
    if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
        console.warn(message); // eslint-disable-line no-console
    }
};
var Avatar = /** @class */ (function (_super) {
    __extends(Avatar, _super);
    function Avatar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
        _this.clickAnalyticsCaller = function () {
            var createAnalyticsEvent = _this.props.createAnalyticsEvent;
            return createAnalyticsEvent
                ? _this.createAndFireEventOnAtlaskit({
                    action: 'clicked',
                    actionSubject: 'avatar',
                    attributes: {
                        componentName: 'avatar',
                        packageName: packageName,
                        packageVersion: packageVersion,
                    },
                })(createAnalyticsEvent)
                : undefined;
        };
        // expose blur/focus to consumers via ref
        _this.blur = function () {
            if (_this.ref)
                _this.ref.blur();
        };
        _this.focus = function () {
            if (_this.ref)
                _this.ref.focus();
        };
        // disallow click on disabled avatars
        // only return avatar data properties
        _this.guardedClick = function (event) {
            var _a = _this.props, isDisabled = _a.isDisabled, onClick = _a.onClick;
            if (isDisabled || typeof onClick !== 'function')
                return;
            var item = omit.apply(void 0, __spread([_this.props], propsOmittedFromClickData));
            var analyticsEvent = _this.clickAnalyticsCaller();
            onClick({ item: item, event: event }, analyticsEvent);
        };
        // enforce status / presence rules
        /* eslint-disable no-console */
        _this.renderIcon = function () {
            var _a = _this.props, appearance = _a.appearance, borderColor = _a.borderColor, presence = _a.presence, status = _a.status;
            var showPresence = Boolean(presence);
            var showStatus = Boolean(status);
            // no icon needed
            if (!showStatus && !showPresence) {
                return null;
            }
            if (showStatus && showPresence) {
                warn('Avatar supports `presence` OR `status` properties, not both.');
                return null;
            }
            // only support particular sizes
            if (validIconSizes.indexOf(_this.props.size) === -1) {
                warn("Avatar size \"" + String(_this.props.size) + "\" does NOT support " + (showPresence ? 'presence' : 'status'));
                return null;
            }
            // we can cast here because we already know that it is a valid icon size
            var size = _this.props.size;
            var indicator = (function () {
                if (showPresence) {
                    var customPresenceNode = typeof presence === 'object' ? presence : null;
                    return (React.createElement(PresenceWrapper, { appearance: appearance, size: size },
                        React.createElement(Presence, { borderColor: borderColor, presence: !customPresenceNode && presence, size: size }, customPresenceNode)));
                }
                // showStatus
                var customStatusNode = typeof status === 'object' ? status : null;
                return (React.createElement(StatusWrapper, { appearance: appearance, size: size },
                    React.createElement(Status, { borderColor: borderColor, status: !customStatusNode && status, size: size }, customStatusNode)));
            })();
            return indicator;
        };
        _this.setRef = function (ref) {
            _this.ref = ref;
        };
        return _this;
    }
    Avatar.prototype.render = function () {
        var _a = this.props, appearance = _a.appearance, enableTooltip = _a.enableTooltip, name = _a.name, size = _a.size, src = _a.src, stackIndex = _a.stackIndex, onClick = _a.onClick, theme = _a.theme, testId = _a.testId;
        // distill props from context, props, and state
        var enhancedProps = getProps(this);
        // provide element interface based on props
        var Inner = getStyledAvatar(this.props);
        Inner.displayName = 'Inner';
        var AvatarNode = (React.createElement(Theme.Provider, { value: theme },
            React.createElement(Outer, { size: size, stackIndex: stackIndex, testId: testId },
                React.createElement(Inner, __assign({ innerRef: this.setRef }, enhancedProps, { onClick: onClick != null ? this.guardedClick : undefined }),
                    React.createElement(AvatarImage, { alt: name, appearance: appearance, size: size, src: src })),
                this.renderIcon())));
        return enableTooltip && name ? (React.createElement(Tooltip, { content: name }, AvatarNode)) : (AvatarNode);
    };
    Avatar.defaultProps = {
        appearance: 'circle',
        enableTooltip: true,
        size: 'medium',
    };
    return Avatar;
}(Component));
export var AvatarWithoutAnalytics = mapProps({
    appearance: function (props) { return props.appearance || Avatar.defaultProps.appearance; },
    isInteractive: function (props) {
        return Boolean((typeof props.enableTooltip !== 'undefined'
            ? props.enableTooltip
            : Avatar.defaultProps.enableTooltip) && props.name);
    },
})(withPseudoState(Avatar));
export default withAnalyticsContext({
    componentName: 'avatar',
    packageName: packageName,
    packageVersion: packageVersion,
})(withAnalyticsEvents()(AvatarWithoutAnalytics));
//# sourceMappingURL=Avatar.js.map
import { __extends } from "tslib";
import React from 'react';
import { withAnalyticsEvents, } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Tooltip from '@atlaskit/tooltip';
import TeamMentionHighlightController from './TeamMentionHighlightController';
import { fireAnalyticsTeamMentionHighlightEvent, ComponentNames, Actions, } from '../../util/analytics';
import { TeamMentionHighlightTitle, TeamMentionHighlightCloseTooltip, TeamMentionHighlightDescription, TeamMentionHighlightDescriptionLink, } from '../../util/i18n';
import * as Styled from './styles';
var ICON_URL = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHdpZHRoPSIxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiBmaWxsPSIjNTI0M2FhIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHI9IjY0Ii8+PHBhdGggZD0ibTgwIDY0Yy02LjYyNzQxNyAwLTEyLTUuMzcyNTgzLTEyLTEyczUuMzcyNTgzLTEyIDEyLTEyIDEyIDUuMzcyNTgzIDEyIDEyLTUuMzcyNTgzIDEyLTEyIDEyem0tMzItMTJjLTYuNjI3NDE3IDAtMTItNS4zNzI1ODMtMTItMTJzNS4zNzI1ODMtMTIgMTItMTIgMTIgNS4zNzI1ODMgMTIgMTItNS4zNzI1ODMgMTItMTIgMTJ6bTEyIDI0YzAtNC40MiAzLjU0OC04IDgtOGgyNGM0LjQyIDAgOCAzLjU0IDggOHYxNC45MmMwIDEyLjEwOC00MCAxMi4xMDgtNDAgMHptOC0xMmgtLjAxMmMtMy4xODQzNTM3LjAwNDI0LTYuMjM2NTQxIDEuMjczNTYxNS04LjQ4NDg0MjcgMy41Mjg2MTQ5LTIuMjQ4MzAxOCAyLjI1NTA1MzQtMy41MDg0NjU2IDUuMzExMDMzLTMuNTAzMTU3MyA4LjQ5NTM4NTF2MTEuMjI4Yy0xMS43ODQgMi4xMzYtMjgtLjI1Mi0yOC03LjkzNnYtMTUuMzA0YzAtNC40MjQgMy41NDgtOC4wMTIgOC04LjAxMmgyNGMyLjEyMjcwODYtLjAwMzE5MTIgNC4xNTkzOTQ2LjgzODYzODYgNS42NjAzNzggMi4zMzk2MjJzMi4zNDI4MTMyIDMuNTM3NjY5NCAyLjMzOTYyMiA1LjY2MDM3OHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjk1Ii8+PC9nPjwvc3ZnPg==';
var TeamMentionHighlightInternal = /** @class */ (function (_super) {
    __extends(TeamMentionHighlightInternal, _super);
    function TeamMentionHighlightInternal(props) {
        var _this = _super.call(this, props) || this;
        _this.onCreateTeamLinkClick = function () {
            _this.setState({ isHighlightHidden: true });
            var onCreateTeamLinkClick = _this.props.onCreateTeamLinkClick;
            TeamMentionHighlightController.registerCreateLinkClick();
            if (onCreateTeamLinkClick) {
                onCreateTeamLinkClick();
            }
        };
        // This is to stop overly aggressive behaviour in tinyMCe editor where clicking anywhere in the Highlight would immediate close the entire
        // dropdown dialog. See TEAMS-611
        _this.preventClickOnCard = function (event) {
            // event is a MouseEvent
            // We stop the event from propagating, so we need to manually close
            var isClickOnCloseButton = _this.elCloseWrapper.current &&
                _this.elCloseWrapper.current.contains(event.target);
            if (isClickOnCloseButton) {
                _this.onCloseClick();
            }
            // Manually perform on-click for the link, if the link was clicked.
            var isClickCreateTeamLink = _this.elCreateTeamWrapper.current &&
                _this.elCreateTeamWrapper.current.contains(event.target);
            if (isClickCreateTeamLink) {
                _this.onCreateTeamLinkClick();
            }
            // Allow default so the link to create team still works, but prevent the rest
            event.stopPropagation();
            event.stopImmediatePropagation();
        };
        _this.onCloseClick = function () {
            _this.setState({ isHighlightHidden: true });
            _this.props.onClose();
        };
        _this.elWrapper = React.createRef();
        _this.elCloseWrapper = React.createRef();
        _this.elCreateTeamWrapper = React.createRef();
        _this.state = {
            isHighlightHidden: false,
        };
        return _this;
    }
    TeamMentionHighlightInternal.prototype.componentDidMount = function () {
        var onViewed = this.props.onViewed;
        this.addEventHandler();
        // Highlight hiding logic was moved to Mount method because if Highlight is re-rendered after updating the
        // counts at MentionHighlightController, Highlight will appear for sometime and then disappear. As of the time
        // of writing this code, this was only happening in Fabric Editor ( See TEAMS-623 )
        if (!TeamMentionHighlightController.isHighlightEnabled()) {
            this.setState({ isHighlightHidden: true });
        }
        else {
            TeamMentionHighlightController.registerRender();
            if (onViewed) {
                onViewed();
            }
        }
    };
    TeamMentionHighlightInternal.prototype.componentWillUnmount = function () {
        this.removeEventHandler();
    };
    TeamMentionHighlightInternal.prototype.addEventHandler = function () {
        this.elWrapper.current &&
            this.elWrapper.current.addEventListener('click', this.preventClickOnCard);
    };
    TeamMentionHighlightInternal.prototype.removeEventHandler = function () {
        this.elWrapper.current &&
            this.elWrapper.current.removeEventListener('click', this.preventClickOnCard);
    };
    TeamMentionHighlightInternal.prototype.render = function () {
        var _this = this;
        var createTeamLink = this.props.createTeamLink;
        var isHighlightHidden = this.state.isHighlightHidden;
        if (isHighlightHidden) {
            return null;
        }
        return (React.createElement("div", { ref: this.elWrapper },
            React.createElement(Styled.Card, null,
                React.createElement(Styled.Content, null,
                    React.createElement(Styled.Aside, null,
                        React.createElement("img", { src: ICON_URL, height: 32 })),
                    React.createElement(Styled.Section, null,
                        React.createElement(Styled.Heading, null,
                            React.createElement(Styled.Title, null,
                                React.createElement(TeamMentionHighlightTitle, null))),
                        React.createElement(Styled.Body, null,
                            React.createElement(TeamMentionHighlightDescription, null, function (description) { return (React.createElement("div", null,
                                description,
                                React.createElement("span", { ref: _this.elCreateTeamWrapper },
                                    React.createElement(TeamMentionHighlightDescriptionLink, null, function (linkText) { return (React.createElement("a", { href: createTeamLink, target: "_blank" },
                                        ' ',
                                        linkText)
                                    // on click fired by preventClickOnCard, not here
                                    ); })))); }))),
                    React.createElement(Styled.Actions, null,
                        React.createElement("div", { ref: this.elCloseWrapper },
                            React.createElement(TeamMentionHighlightCloseTooltip, null, function (tooltip) { return (React.createElement(Tooltip, { content: tooltip, position: "bottom" },
                                React.createElement(Button, { appearance: "subtle", iconBefore: React.createElement(EditorCloseIcon, { label: "Close", size: "medium" }), spacing: "none" }))); })))))));
    };
    TeamMentionHighlightInternal.defaultProps = {
        createTeamLink: '/people/search#createTeam',
    };
    return TeamMentionHighlightInternal;
}(React.Component));
export { TeamMentionHighlightInternal };
var TeamMentionHighlightWithAnalytics = withAnalyticsEvents({
    onClose: function (createEvent) {
        fireAnalyticsTeamMentionHighlightEvent(createEvent)(ComponentNames.TEAM_MENTION_HIGHLIGHT, Actions.CLOSED, ComponentNames.MENTION, 'closeButton');
    },
    onCreateTeamLinkClick: function (createEvent) {
        fireAnalyticsTeamMentionHighlightEvent(createEvent)(ComponentNames.TEAM_MENTION_HIGHLIGHT, Actions.CLICKED, ComponentNames.MENTION, 'createTeamLink');
    },
    onViewed: function (createEvent) {
        fireAnalyticsTeamMentionHighlightEvent(createEvent)(ComponentNames.TEAM_MENTION_HIGHLIGHT, Actions.VIEWED, ComponentNames.MENTION, undefined, TeamMentionHighlightController.getSeenCount());
    },
})(TeamMentionHighlightInternal);
var TeamMentionHighlight = TeamMentionHighlightWithAnalytics;
export default TeamMentionHighlight;
//# sourceMappingURL=index.js.map
import React from 'react';
import HeadingAnchor from './heading-anchor';
import Url from 'url-parse';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, } from '../../analytics/enums';
import AnalyticsContext from '../../analytics/analyticsContext';
import { CopyTextConsumer } from './copy-text-provider';
var getCurrentUrlWithHash = function (hash) {
    if (hash === void 0) { hash = ''; }
    var url = new Url(window.location.href);
    url.set('hash', encodeURIComponent(hash));
    return url.href;
};
function Heading(props) {
    var headingId = props.headingId;
    var HX = "h" + props.level;
    return (React.createElement(HX, { id: headingId },
        !!props.showAnchorLink && (React.createElement(CopyTextConsumer, null, function (_a) {
            var copyTextToClipboard = _a.copyTextToClipboard;
            return (headingId && (React.createElement(AnalyticsContext.Consumer, null, function (_a) {
                var fireAnalyticsEvent = _a.fireAnalyticsEvent;
                return (React.createElement(HeadingAnchor, { onCopyText: function () {
                        fireAnalyticsEvent({
                            action: ACTION.CLICKED,
                            actionSubject: ACTION_SUBJECT.BUTTON,
                            actionSubjectId: ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
                            eventType: EVENT_TYPE.UI,
                        });
                        return copyTextToClipboard(getCurrentUrlWithHash(headingId));
                    } }));
            })));
        })),
        props.children));
}
export default Heading;
//# sourceMappingURL=heading.js.map
import { __assign } from "tslib";
import { OPERATIONAL_EVENT_TYPE, UI_EVENT_TYPE, } from '@atlaskit/analytics-gas-types';
import { isSpecialMention, } from '@atlaskit/mention/resource';
import { name as packageName, version as packageVersion, } from '../../version.json';
import { isTeamType } from './utils';
var componentName = 'mention';
export var buildAnalyticsPayload = function (actionSubject, action, eventType, sessionId, otherAttributes) {
    if (otherAttributes === void 0) { otherAttributes = {}; }
    return ({
        action: action,
        actionSubject: actionSubject,
        eventType: eventType,
        attributes: __assign({ packageName: packageName,
            packageVersion: packageVersion,
            componentName: componentName,
            sessionId: sessionId }, otherAttributes),
    });
};
var emptyQueryResponse = {
    queryLength: 0,
    spaceInQuery: false,
};
var extractAttributesFromQuery = function (query) {
    if (query) {
        return {
            queryLength: query.length,
            spaceInQuery: query.indexOf(' ') !== -1,
        };
    }
    return emptyQueryResponse;
};
export var buildTypeAheadCancelPayload = function (duration, upKeyCount, downKeyCount, sessionId, query) {
    var _a = extractAttributesFromQuery(query), queryLength = _a.queryLength, spaceInQuery = _a.spaceInQuery;
    return buildAnalyticsPayload('mentionTypeahead', 'cancelled', UI_EVENT_TYPE, sessionId, {
        duration: duration,
        downKeyCount: downKeyCount,
        upKeyCount: upKeyCount,
        queryLength: queryLength,
        spaceInQuery: spaceInQuery,
    });
};
var getPosition = function (mentionList, selectedMention) {
    if (mentionList) {
        var index = mentionList.findIndex(function (mention) { return mention.id === selectedMention.id; });
        return index === -1 ? undefined : index;
    }
    return;
};
var isClicked = function (insertType) { return insertType === 'selected'; };
export var buildTypeAheadInsertedPayload = function (duration, upKeyCount, downKeyCount, sessionId, insertType, mention, mentionList, query) {
    var _a = extractAttributesFromQuery(query), queryLength = _a.queryLength, spaceInQuery = _a.spaceInQuery;
    return buildAnalyticsPayload('mentionTypeahead', isClicked(insertType) ? 'clicked' : 'pressed', UI_EVENT_TYPE, sessionId, {
        duration: duration,
        position: getPosition(mentionList, mention),
        keyboardKey: isClicked(insertType) ? undefined : insertType,
        queryLength: queryLength,
        spaceInQuery: spaceInQuery,
        isSpecial: isSpecialMention(mention),
        accessLevel: mention.accessLevel || '',
        userType: mention.userType,
        userId: mention.id,
        upKeyCount: upKeyCount,
        downKeyCount: downKeyCount,
        memberCount: isTeamType(mention.userType) && mention.context
            ? mention.context.memberCount
            : null,
        includesYou: isTeamType(mention.userType) && mention.context
            ? mention.context.includesYou
            : null,
    });
};
export var buildTypeAheadRenderedPayload = function (duration, userIds, query, teams) {
    var _a = extractAttributesFromQuery(query), queryLength = _a.queryLength, spaceInQuery = _a.spaceInQuery;
    var actionSubject = userIds ? 'mentionTypeahead' : 'teamMentionTypeahead';
    return {
        action: 'rendered',
        actionSubject: actionSubject,
        eventType: OPERATIONAL_EVENT_TYPE,
        attributes: {
            packageName: packageName,
            packageVersion: packageVersion,
            componentName: componentName,
            duration: duration,
            userIds: userIds,
            teams: teams,
            queryLength: queryLength,
            spaceInQuery: spaceInQuery,
        },
    };
};
//# sourceMappingURL=analytics.js.map
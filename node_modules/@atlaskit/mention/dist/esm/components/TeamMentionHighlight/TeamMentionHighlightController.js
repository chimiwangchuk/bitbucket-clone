export var mentionHighlightLocalStorageKey = 'atlassian.people.context.team.mention.highlight';
var EMPTY = {
    seenCount: 0,
    dontShow: false,
};
// Don't show if the user can't access local storage
var DISABLED_LOCAL_STORAGE = {
    seenCount: 99,
    dontShow: true,
};
var MAX_SEEN_LIMIT = 5;
var TeamMentionHighlightController = /** @class */ (function () {
    function TeamMentionHighlightController() {
    }
    // Note - not a simple look up to avoid showing it to users that have local storage disabled
    TeamMentionHighlightController.readFromLocalStorage = function () {
        try {
            var localVal = localStorage.getItem(mentionHighlightLocalStorageKey);
            if (!localVal) {
                // Attempt to write to see if the user has local storage access
                localStorage.setItem(mentionHighlightLocalStorageKey, JSON.stringify(EMPTY));
                localVal = localStorage.getItem(mentionHighlightLocalStorageKey);
            }
            if (localVal) {
                return JSON.parse(localVal);
            }
            else {
                return DISABLED_LOCAL_STORAGE;
            }
        }
        catch (err) {
            return DISABLED_LOCAL_STORAGE;
        }
    };
    TeamMentionHighlightController.saveToLocalStorage = function (item) {
        try {
            localStorage.setItem(mentionHighlightLocalStorageKey, JSON.stringify(item));
        }
        catch (err) {
            // do nothing
        }
    };
    TeamMentionHighlightController.markAsDone = function () {
        var item = TeamMentionHighlightController.readFromLocalStorage();
        item.dontShow = true;
        TeamMentionHighlightController.saveToLocalStorage(item);
    };
    TeamMentionHighlightController.isHighlightEnabled = function () {
        var item = TeamMentionHighlightController.readFromLocalStorage();
        return item.seenCount < MAX_SEEN_LIMIT && !item.dontShow;
    };
    TeamMentionHighlightController.registerRender = function () {
        var item = TeamMentionHighlightController.readFromLocalStorage();
        item.seenCount += 1;
        if (item.seenCount > MAX_SEEN_LIMIT) {
            item.dontShow = true;
        }
        TeamMentionHighlightController.saveToLocalStorage(item);
        return item;
    };
    TeamMentionHighlightController.getSeenCount = function () {
        return TeamMentionHighlightController.readFromLocalStorage().seenCount;
    };
    TeamMentionHighlightController.registerCreateLinkClick = TeamMentionHighlightController.markAsDone;
    TeamMentionHighlightController.registerTeamMention = TeamMentionHighlightController.markAsDone;
    TeamMentionHighlightController.registerClosed = TeamMentionHighlightController.markAsDone;
    return TeamMentionHighlightController;
}());
export default TeamMentionHighlightController;
//# sourceMappingURL=TeamMentionHighlightController.js.map
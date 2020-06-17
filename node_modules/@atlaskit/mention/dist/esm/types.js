export var MentionType;
(function (MentionType) {
    MentionType[MentionType["SELF"] = 0] = "SELF";
    MentionType[MentionType["RESTRICTED"] = 1] = "RESTRICTED";
    MentionType[MentionType["DEFAULT"] = 2] = "DEFAULT";
})(MentionType || (MentionType = {}));
export var UserAccessLevel;
(function (UserAccessLevel) {
    UserAccessLevel[UserAccessLevel["NONE"] = 0] = "NONE";
    UserAccessLevel[UserAccessLevel["SITE"] = 1] = "SITE";
    UserAccessLevel[UserAccessLevel["APPLICATION"] = 2] = "APPLICATION";
    UserAccessLevel[UserAccessLevel["CONTAINER"] = 3] = "CONTAINER";
})(UserAccessLevel || (UserAccessLevel = {}));
export var UserType;
(function (UserType) {
    UserType[UserType["DEFAULT"] = 0] = "DEFAULT";
    UserType[UserType["SPECIAL"] = 1] = "SPECIAL";
    UserType[UserType["APP"] = 2] = "APP";
    UserType[UserType["TEAM"] = 3] = "TEAM";
    UserType[UserType["SYSTEM"] = 4] = "SYSTEM";
})(UserType || (UserType = {}));
export var MentionNameStatus;
(function (MentionNameStatus) {
    MentionNameStatus[MentionNameStatus["UNKNOWN"] = 0] = "UNKNOWN";
    MentionNameStatus[MentionNameStatus["SERVICE_ERROR"] = 1] = "SERVICE_ERROR";
    MentionNameStatus[MentionNameStatus["OK"] = 2] = "OK";
})(MentionNameStatus || (MentionNameStatus = {}));
export function isRestricted(accessLevel) {
    return (!!accessLevel && accessLevel !== UserAccessLevel[UserAccessLevel.CONTAINER]);
}
export function isSpecialMention(mention) {
    return !!mention.userType && mention.userType === UserType[UserType.SPECIAL];
}
export function isAppMention(mention) {
    return mention.userType && mention.userType === UserType[UserType.APP];
}
export function isTeamMention(mention) {
    return mention.userType && mention.userType === UserType[UserType.TEAM];
}
export function isSpecialMentionText(mentionText) {
    return mentionText && (mentionText === '@all' || mentionText === '@here');
}
export var isPromise = function (p) { return !!(p && p.then); };
//# sourceMappingURL=types.js.map
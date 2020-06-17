export var isTeamType = function (userType) { return userType === 'TEAM'; };
export var isTeamStats = function (stat) {
    return stat && !isNaN(stat.teamMentionDuration);
};
//# sourceMappingURL=utils.js.map
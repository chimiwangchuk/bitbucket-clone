import { __assign, __read, __spread } from "tslib";
// queues a match at a given position in the document
var matched = function (state, action) { return (__assign(__assign({}, state), { resolving: __spread(state.resolving, [
        {
            start: action.start,
            end: action.end,
            match: action.match,
        },
    ]) })); };
// store the replacement for a match
var resolved = function (state, action) { return (__assign(__assign({}, state), { matches: __spread(state.matches, [
        {
            replacement: action.replacement,
            matchString: action.matchString,
        },
    ]) })); };
// indicates a replacement in the document has been completed, and removes the match from both resolving and matches
var finish = function (state, action) {
    return __assign(__assign({}, state), { resolving: state.resolving.filter(function (resolving) { return resolving.match[0] !== action.matchString; }), matches: state.matches.filter(function (matching) { return matching.matchString !== action.matchString; }) });
};
var reduce = function (state, action) {
    switch (action.action) {
        case 'matched':
            return matched(state, action);
        case 'resolved':
            return resolved(state, action);
        case 'finish':
            return finish(state, action);
        default:
            return state;
    }
};
export default reduce;
//# sourceMappingURL=reducers.js.map
import { __awaiter, __generator } from "tslib";
import { closeHistory } from 'prosemirror-history';
import { processRawValue } from '../../utils';
import { autoformatAction } from './utils';
export var buildHandler = function (_regex, handler) {
    return function (view, match, start, end) { return __awaiter(void 0, void 0, void 0, function () {
        var replacementPromise, replacementData, replacementNode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    replacementPromise = handler(match.slice(1, match.length - 1));
                    // queue the position and match pair so that we can remap across transactions
                    // while we wait for the replacmentPromise to resolve
                    view.dispatch(autoformatAction(view.state.tr, {
                        action: 'matched',
                        match: match,
                        start: start,
                        end: end,
                    }));
                    return [4 /*yield*/, replacementPromise];
                case 1:
                    replacementData = _a.sent();
                    replacementNode = processRawValue(view.state.schema, replacementData);
                    view.dispatch(autoformatAction(view.state.tr, {
                        action: 'resolved',
                        matchString: match[0],
                        replacement: replacementNode,
                    }));
                    return [2 /*return*/, replacementData];
            }
        });
    }); };
};
export var completeReplacements = function (view, state) {
    var inlineCard = view.state.schema.nodes.inlineCard;
    state.matches.forEach(function (completedMatch) {
        var matchingRequests = state.resolving.filter(function (candidate) { return candidate.match[0] === completedMatch.matchString; });
        var tr = view.state.tr;
        matchingRequests.forEach(function (request) {
            var match = request.match, start = request.start, end = request.end;
            var replacement = completedMatch.replacement;
            var prefix = match[1];
            var suffix = match[match.length - 1];
            var matchEndPos = end + suffix.length;
            // only permit inlineCard as replacement target for now
            if (!replacement ||
                (replacement.type !== inlineCard && !replacement.isText)) {
                return;
            }
            // get the current document text, adding # or | if we cross node boundaries
            var docText = view.state.doc.textBetween(start, matchEndPos, '#', '|');
            // only replace if text still remains the same as when typed at the start
            if (docText === match[0]) {
                tr = tr.replaceWith(tr.mapping.map(start + prefix.length), tr.mapping.map(end, -1), replacement);
            }
        });
        // clear this match from plugin state now that we've processed it
        tr = autoformatAction(tr, {
            action: 'finish',
            matchString: completedMatch.matchString,
        });
        // and dispatch the replacement, closing history for cmd+z to allow undo separately
        view.dispatch(closeHistory(tr));
    });
};
//# sourceMappingURL=doc.js.map
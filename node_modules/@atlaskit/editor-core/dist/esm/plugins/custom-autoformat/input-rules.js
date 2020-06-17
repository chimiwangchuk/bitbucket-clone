var MAX_MATCH = 500;
// this is a modified version of
// https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/inputrules.js#L53
export var triggerInputRule = function (view, rules, from, to, text) {
    var state = view.state;
    var $from = state.doc.resolve(from);
    if ($from.parent.type.spec.code) {
        return false;
    }
    var textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - MAX_MATCH), $from.parentOffset, undefined, '\ufffc') + text;
    // loop through rules trying to find one that matches
    for (var i = 0; i < rules.length; i++) {
        var match = void 0;
        if (text.length) {
            match = rules[i].matchTyping.exec(textBefore);
        }
        else {
            match = rules[i].matchEnter.exec(textBefore);
        }
        if (match) {
            // kick off the handler
            var pos = from - (match[0].length - text.length);
            rules[i].handler(view, match, pos, to);
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=input-rules.js.map
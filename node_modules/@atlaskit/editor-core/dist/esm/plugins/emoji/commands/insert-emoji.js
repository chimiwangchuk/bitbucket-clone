import { __assign } from "tslib";
import { safeInsert } from 'prosemirror-utils';
import { Fragment } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import { addAnalytics, EVENT_TYPE, ACTION_SUBJECT_ID, ACTION_SUBJECT, ACTION, } from '../../analytics';
export function insertEmoji(emojiId, inputMethod) {
    return function (state, dispatch) {
        var emoji = state.schema.nodes.emoji;
        if (emoji && emojiId) {
            var node = emoji.createChecked(__assign(__assign({}, emojiId), { text: emojiId.fallback || emojiId.shortName }));
            var textNode = state.schema.text(' ');
            if (dispatch) {
                var fragment = Fragment.fromArray([node, textNode]);
                var tr = safeInsert(fragment)(state.tr);
                if (inputMethod) {
                    addAnalytics(state, tr, {
                        action: ACTION.INSERTED,
                        actionSubject: ACTION_SUBJECT.DOCUMENT,
                        actionSubjectId: ACTION_SUBJECT_ID.EMOJI,
                        attributes: { inputMethod: inputMethod },
                        eventType: EVENT_TYPE.TRACK,
                    });
                }
                dispatch(tr.setSelection(Selection.near(tr.doc.resolve(state.selection.$from.pos + fragment.size))));
            }
            return true;
        }
        return false;
    };
}
//# sourceMappingURL=insert-emoji.js.map
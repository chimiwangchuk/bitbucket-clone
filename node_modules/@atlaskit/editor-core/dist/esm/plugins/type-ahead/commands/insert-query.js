import { __read, __spread } from "tslib";
import { safeInsert } from 'prosemirror-utils';
import { TextSelection } from 'prosemirror-state';
export function insertTypeAheadQuery(trigger, replaceLastChar) {
    if (replaceLastChar === void 0) { replaceLastChar = false; }
    return function (state, dispatch) {
        if (!dispatch) {
            return false;
        }
        if (replaceLastChar) {
            var tr = state.tr, selection = state.selection;
            var marks = selection.$from.marks();
            dispatch(tr
                .setSelection(TextSelection.create(tr.doc, selection.$from.pos - 1, selection.$from.pos))
                .replaceSelectionWith(state.doc.type.schema.text(trigger, __spread([
                state.schema.marks.typeAheadQuery.create({ trigger: trigger })
            ], marks)), false));
            return true;
        }
        dispatch(safeInsert(state.schema.text(trigger, [
            state.schema.marks.typeAheadQuery.create({ trigger: trigger }),
        ]))(state.tr));
        return true;
    };
}
//# sourceMappingURL=insert-query.js.map
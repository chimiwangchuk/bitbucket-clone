// #region Imports
import { Selection } from 'prosemirror-state';
import { isCellSelection, findCellClosestToPos, emptyCell, } from 'prosemirror-utils';
// #endregion
// #region Commands
export var clearMultipleCells = function (targetCellPosition) { return function (state, dispatch) {
    var cursorPos;
    var tr = state.tr;
    if (isCellSelection(tr.selection)) {
        var selection = tr.selection;
        selection.forEachCell(function (_node, pos) {
            var $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
            tr = emptyCell(findCellClosestToPos($pos), state.schema)(tr);
        });
        cursorPos = selection.$headCell.pos;
    }
    else if (targetCellPosition) {
        var cell = findCellClosestToPos(tr.doc.resolve(targetCellPosition + 1));
        tr = emptyCell(cell, state.schema)(tr);
        cursorPos = cell.pos;
    }
    if (tr.docChanged && cursorPos) {
        var $pos = tr.doc.resolve(tr.mapping.map(cursorPos));
        var textSelection = Selection.findFrom($pos, 1, true);
        if (textSelection) {
            tr.setSelection(textSelection);
        }
        if (dispatch) {
            dispatch(tr);
        }
        return true;
    }
    return false;
}; };
export var clearSelection = function (state, dispatch) {
    if (dispatch) {
        dispatch(state.tr
            .setSelection(Selection.near(state.selection.$from))
            .setMeta('addToHistory', false));
    }
    return true;
};
// #endregion
//# sourceMappingURL=clear.js.map
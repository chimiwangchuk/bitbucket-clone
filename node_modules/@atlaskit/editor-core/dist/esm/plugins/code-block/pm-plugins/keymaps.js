import { keymap } from 'prosemirror-keymap';
import { Selection } from 'prosemirror-state';
import { findParentNodeOfTypeClosestToPos, hasParentNodeOfType, } from 'prosemirror-utils';
import { getCursor, isEmptyNode, pipe } from '../../../utils';
var deleteCurrentItem = function ($from) { return function (tr) {
    return tr.delete($from.before($from.depth) - 1, $from.end($from.depth) + 1);
}; };
var setTextSelection = function (pos) { return function (tr) {
    var newSelection = Selection.findFrom(tr.doc.resolve(pos), -1, true);
    if (newSelection) {
        tr.setSelection(newSelection);
    }
    return tr;
}; };
export function keymapPlugin(schema) {
    return keymap({
        Backspace: function (state, dispatch) {
            var $cursor = getCursor(state.selection);
            var _a = state.schema.nodes, paragraph = _a.paragraph, codeBlock = _a.codeBlock, listItem = _a.listItem, table = _a.table, layoutColumn = _a.layoutColumn;
            if (!$cursor || $cursor.parent.type !== codeBlock) {
                return false;
            }
            if ($cursor.pos === 1 ||
                (hasParentNodeOfType(listItem)(state.selection) &&
                    $cursor.parentOffset === 0)) {
                var node = findParentNodeOfTypeClosestToPos($cursor, codeBlock);
                if (!node) {
                    return false;
                }
                dispatch(state.tr
                    .setNodeMarkup(node.pos, node.node.type, node.node.attrs, [])
                    .setBlockType($cursor.pos, $cursor.pos, paragraph));
                return true;
            }
            if (dispatch &&
                $cursor.node &&
                isEmptyNode(schema)($cursor.node()) &&
                (hasParentNodeOfType(layoutColumn)(state.selection) ||
                    hasParentNodeOfType(table)(state.selection))) {
                var tr = state.tr;
                var insertPos = $cursor.pos;
                dispatch(pipe(deleteCurrentItem($cursor), setTextSelection(insertPos))(tr).scrollIntoView());
                return true;
            }
            return false;
        },
    });
}
export default keymapPlugin;
//# sourceMappingURL=keymaps.js.map
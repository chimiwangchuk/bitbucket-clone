import { CellSelection } from 'prosemirror-tables';
import { FORMATTING_MARK_TYPES, FORMATTING_NODE_TYPES, } from './commands/clear-formatting';
export var nodeLen = function (node) {
    return node.nodeType === 3 && node.nodeValue
        ? node.nodeValue.length
        : node.childNodes.length;
};
export var isIgnorable = function (dom) {
    return dom.pmViewDesc && dom.pmViewDesc.size === 0;
};
export var isBlockNode = function (dom) {
    var desc = dom.pmViewDesc;
    return desc && desc.node && desc.node.isBlock;
};
export var domIndex = function (node) {
    if (node) {
        for (var index = 0;; index++) {
            node = node.previousSibling;
            if (!node) {
                return index;
            }
        }
    }
    return;
};
export var hasCode = function (state, pos) {
    var code = state.schema.marks.code;
    var node = pos >= 0 && state.doc.nodeAt(pos);
    if (node) {
        return !!node.marks.filter(function (mark) { return mark.type === code; }).length;
    }
    return false;
};
/**
 * Determine if a mark (with specific attribute values) exists anywhere in the selection.
 */
export var markActive = function (state, mark) {
    var _a = state.selection, from = _a.from, to = _a.to, empty = _a.empty;
    // When the selection is empty, only the active marks apply.
    if (empty) {
        return !!mark.isInSet(state.tr.storedMarks || state.selection.$from.marks());
    }
    // For a non-collapsed selection, the marks on the nodes matter.
    var found = false;
    state.doc.nodesBetween(from, to, function (node) {
        found = found || mark.isInSet(node.marks);
    });
    return found;
};
/**
 * Determine if a mark of a specific type exists anywhere in the selection.
 */
export var anyMarkActive = function (state, markType) {
    var _a = state.selection, $from = _a.$from, from = _a.from, to = _a.to, empty = _a.empty;
    if (empty) {
        return !!markType.isInSet(state.storedMarks || $from.marks());
    }
    var rangeHasMark = false;
    if (state.selection instanceof CellSelection) {
        state.selection.forEachCell(function (cell, cellPos) {
            var from = cellPos;
            var to = cellPos + cell.nodeSize;
            if (!rangeHasMark) {
                rangeHasMark = state.doc.rangeHasMark(from, to, markType);
            }
        });
    }
    else {
        rangeHasMark = state.doc.rangeHasMark(from, to, markType);
    }
    return rangeHasMark;
};
var blockStylingIsPresent = function (state) {
    var _a = state.selection, from = _a.from, to = _a.to;
    var isBlockStyling = false;
    state.doc.nodesBetween(from, to, function (node) {
        if (FORMATTING_NODE_TYPES.indexOf(node.type.name) !== -1) {
            isBlockStyling = true;
            return false;
        }
        return true;
    });
    return isBlockStyling;
};
var marksArePresent = function (state) {
    var activeMarkTypes = FORMATTING_MARK_TYPES.filter(function (mark) {
        if (!!state.schema.marks[mark]) {
            var _a = state.selection, $from = _a.$from, empty = _a.empty;
            var marks = state.schema.marks;
            if (empty) {
                return !!marks[mark].isInSet(state.storedMarks || $from.marks());
            }
            return anyMarkActive(state, marks[mark]);
        }
        return false;
    });
    return activeMarkTypes.length > 0;
};
export var checkFormattingIsPresent = function (state) {
    return marksArePresent(state) || blockStylingIsPresent(state);
};
//# sourceMappingURL=utils.js.map
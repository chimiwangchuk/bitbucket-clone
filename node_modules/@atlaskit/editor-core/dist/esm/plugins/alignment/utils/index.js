import { findParentNodeOfType } from 'prosemirror-utils';
import { CellSelection } from 'prosemirror-tables';
export var getActiveAlignment = function (state) {
    if (state.selection instanceof CellSelection) {
        var marks_1 = [];
        state.selection.forEachCell(function (cell) {
            var mark = cell.firstChild.marks.filter(function (mark) { return mark.type === state.schema.marks.alignment; })[0];
            marks_1.push(mark ? mark.attrs.align : 'start');
        });
        return marks_1.every(function (mark) { return mark === marks_1[0]; })
            ? marks_1[0]
            : 'start';
    }
    var node = findParentNodeOfType([
        state.schema.nodes.paragraph,
        state.schema.nodes.heading,
    ])(state.selection);
    var getMark = node &&
        node.node.marks.filter(function (mark) { return mark.type === state.schema.marks.alignment; })[0];
    return (getMark && getMark.attrs.align) || 'start';
};
//# sourceMappingURL=index.js.map
import { findTable } from 'prosemirror-utils';
import { TableMap } from 'prosemirror-tables';
export var getMergedCellsPositions = function (tr) {
    var table = findTable(tr.selection);
    if (!table) {
        return [];
    }
    var map = TableMap.get(table.node);
    var cellPositions = new Set();
    var mergedCells = [];
    map.map.forEach(function (value) {
        if (cellPositions.has(value)) {
            mergedCells.push(value);
        }
        else {
            cellPositions.add(value);
        }
    });
    return mergedCells;
};
//# sourceMappingURL=table.js.map
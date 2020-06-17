import { TableMap } from 'prosemirror-tables';
import { findTable, getSelectionRect } from 'prosemirror-utils';
export function getSelectedTableInfo(selection) {
    var map;
    var totalRowCount = 0;
    var totalColumnCount = 0;
    var table = findTable(selection);
    if (table) {
        map = TableMap.get(table.node);
        totalRowCount = map.height;
        totalColumnCount = map.width;
    }
    return {
        table: table,
        map: map,
        totalRowCount: totalRowCount,
        totalColumnCount: totalColumnCount,
    };
}
export function getSelectedCellInfo(selection) {
    var horizontalCells = 1;
    var verticalCells = 1;
    var totalCells = 1;
    var _a = getSelectedTableInfo(selection), table = _a.table, map = _a.map, totalRowCount = _a.totalRowCount, totalColumnCount = _a.totalColumnCount;
    if (table && map) {
        var rect = getSelectionRect(selection);
        if (rect) {
            totalCells = map.cellsInRect(rect).length;
            horizontalCells = rect.right - rect.left;
            verticalCells = rect.bottom - rect.top;
        }
    }
    return {
        totalRowCount: totalRowCount,
        totalColumnCount: totalColumnCount,
        horizontalCells: horizontalCells,
        verticalCells: verticalCells,
        totalCells: totalCells,
    };
}
//# sourceMappingURL=analytics.js.map
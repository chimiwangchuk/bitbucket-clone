import { __assign } from "tslib";
import { TableMap, CellSelection } from 'prosemirror-tables';
import { TextSelection } from 'prosemirror-state';
import { setMeta } from './metadata';
export var updateColumnWidths = function (resizeState, table, start) { return function (tr) {
    var map = TableMap.get(table);
    var updatedCellsAttrs = {};
    // calculating new attributes for each cell
    for (var columnIndex = 0; columnIndex < map.width; columnIndex++) {
        for (var rowIndex = 0; rowIndex < map.height; rowIndex++) {
            var width = resizeState.cols[columnIndex].width;
            var mapIndex = rowIndex * map.width + columnIndex;
            var cellPos = map.map[mapIndex];
            var attrs = updatedCellsAttrs[cellPos] || __assign({}, table.nodeAt(cellPos).attrs);
            var colspan = attrs.colspan || 1;
            if (attrs.colwidth && attrs.colwidth.length > colspan) {
                tr = setMeta({
                    type: 'UPDATE_COLUMN_WIDTHS',
                    problem: 'COLWIDTHS_BEFORE_UPDATE',
                    data: { colwidths: attrs.colwidth, colspan: colspan },
                })(tr);
                attrs.colwidth = attrs.colwidth.slice(0, colspan);
            }
            // Rowspanning cell that has already been handled
            if (rowIndex && map.map[mapIndex] === map.map[mapIndex - map.width]) {
                continue;
            }
            var colspanIndex = colspan === 1 ? 0 : columnIndex - map.colCount(cellPos);
            if (attrs.colwidth && attrs.colwidth[colspanIndex] === width) {
                continue;
            }
            var colwidth = attrs.colwidth
                ? attrs.colwidth.slice()
                : Array.from({ length: colspan }, function (_) { return 0; });
            colwidth[colspanIndex] = width;
            if (colwidth.length > colspan) {
                tr = setMeta({
                    type: 'UPDATE_COLUMN_WIDTHS',
                    problem: 'COLWIDTHS_AFTER_UPDATE',
                    data: { colwidths: colwidth, colspan: colspan },
                })(tr);
                colwidth = colwidth.slice(0, colspan);
            }
            updatedCellsAttrs[cellPos] = __assign(__assign({}, attrs), { colwidth: colwidth });
        }
    }
    // updating all cells with new attributes
    var rows = [];
    var seen = {};
    for (var rowIndex = 0; rowIndex < map.height; rowIndex++) {
        var row = table.child(rowIndex);
        var cells = [];
        for (var columnIndex = 0; columnIndex < map.width; columnIndex++) {
            var mapIndex = rowIndex * map.width + columnIndex;
            var pos = map.map[mapIndex];
            var cell = table.nodeAt(pos);
            if (!seen[pos] && cell) {
                cells.push(cell.type.createChecked(updatedCellsAttrs[pos] || cell.attrs, cell.content, cell.marks));
                seen[pos] = true;
            }
        }
        rows.push(row.type.createChecked(row.attrs, cells, row.marks));
    }
    var tablePos = start - 1;
    var selection = tr.selection;
    tr.replaceWith(tablePos, tablePos + table.nodeSize, table.type.createChecked(table.attrs, rows, table.marks));
    // restore selection after replacing the table
    if (selection instanceof TextSelection) {
        tr.setSelection(new TextSelection(tr.doc.resolve(selection.$from.pos), tr.doc.resolve(selection.$to.pos)));
    }
    else if (selection instanceof CellSelection) {
        var newSelection = CellSelection.create(tr.doc, selection.$anchorCell.pos, selection.$headCell.pos);
        // TS complaints about missing "visible" prop in CellSelection type
        tr.setSelection(newSelection);
    }
    return tr;
}; };
//# sourceMappingURL=column-width.js.map
import { __read, __spread } from "tslib";
export function calcTableColumnWidths(node) {
    var tableColumnWidths = [];
    var firstRow = node.firstChild;
    if (firstRow) {
        // Sanity validation, but it should always have a first row
        // Iterate for the cells in the first row
        firstRow.forEach(function (colNode) {
            var colwidth = colNode.attrs.colwidth || [0];
            // If we have colwidth, we added it
            if (colwidth) {
                tableColumnWidths = __spread(tableColumnWidths, colwidth);
            }
        });
    }
    return tableColumnWidths;
}
export function hasMergedCell(tableNode) {
    var hasSpan = false;
    tableNode.descendants(function (node) {
        if (node.type.name === 'tableRow') {
            return true;
        }
        var _a = node.attrs, colspan = _a.colspan, rowspan = _a.rowspan;
        if (colspan > 1 || rowspan > 1) {
            hasSpan = true;
        }
        return false;
    });
    return hasSpan;
}
export function convertProsemirrorTableNodeToArrayOfRows(tableNode) {
    var result = [];
    tableNode.forEach(function (rowNode) {
        if (rowNode.type.name === 'tableRow') {
            var row_1 = [];
            rowNode.forEach(function (n) { return row_1.push(n); });
            result.push(row_1);
        }
    });
    return result;
}
//# sourceMappingURL=table.js.map
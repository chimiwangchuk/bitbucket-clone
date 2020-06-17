import { __assign } from "tslib";
import { tableCellMinWidth, tableNewColumnMinWidth, calcTableColumnWidths, } from '@atlaskit/editor-common';
import { growColumn, shrinkColumn } from './resize-logic';
import { getCellsRefsInColumn, getColumnStateFromDOM, } from './column-state';
import { insertColgroupFromNode, hasTableBeenResized } from './colgroup';
export var getResizeState = function (_a) {
    var minWidth = _a.minWidth, maxSize = _a.maxSize, table = _a.table, tableRef = _a.tableRef, start = _a.start, domAtPos = _a.domAtPos;
    if (hasTableBeenResized(table)) {
        return {
            cols: calcTableColumnWidths(table).map(function (width, index) { return ({
                width: width === 0 ? tableNewColumnMinWidth : width,
                minWidth: width === 0 ? tableNewColumnMinWidth : minWidth,
                index: index,
            }); }),
            maxSize: maxSize,
        };
    }
    // Getting the resize state from DOM
    var colgroupChildren = insertColgroupFromNode(tableRef, table);
    return {
        cols: Array.from(colgroupChildren).map(function (_, index) {
            var cellsRefs = getCellsRefsInColumn(index, table, start, domAtPos);
            return getColumnStateFromDOM(cellsRefs, index, minWidth);
        }),
        maxSize: maxSize,
    };
};
// Resize a given column by an amount from the current state
export var resizeColumn = function (resizeState, colIndex, amount, tableRef, selectedColumns) {
    var newState = amount > 0
        ? growColumn(resizeState, colIndex, amount, selectedColumns)
        : amount < 0
            ? shrinkColumn(resizeState, colIndex, amount, selectedColumns)
            : resizeState;
    updateColgroup(newState, tableRef);
    return newState;
};
// updates Colgroup DOM node with new widths
export var updateColgroup = function (state, tableRef) {
    var cols = tableRef.querySelectorAll('col');
    state.cols
        .filter(function (column) { return column && !!column.width; }) // if width is 0, we dont want to apply that.
        .forEach(function (column, i) {
        if (cols[i]) {
            cols[i].style.width = column.width + "px";
        }
    });
};
export var getTotalWidth = function (_a) {
    var cols = _a.cols;
    return cols.reduce(function (totalWidth, col) { return totalWidth + col.width; }, 0);
};
// adjust columns to take up the total width
// difference in total columns widths vs table width happens due to the "Math.floor"
export var adjustColumnsWidths = function (resizeState, maxSize) {
    var totalWidth = getTotalWidth(resizeState);
    var diff = maxSize - totalWidth;
    if (diff > 0 || (diff < 0 && Math.abs(diff) < tableCellMinWidth)) {
        var updated_1 = false;
        return __assign(__assign({}, resizeState), { cols: resizeState.cols.map(function (col) {
                if (!updated_1 && col.width + diff > col.minWidth) {
                    updated_1 = true;
                    return __assign(__assign({}, col), { width: col.width + diff });
                }
                return col;
            }) });
    }
    return resizeState;
};
export var evenAllColumnsWidths = function (resizeState) {
    var maxSize = getTotalWidth(resizeState);
    var evenWidth = Math.floor(maxSize / resizeState.cols.length);
    var cols = resizeState.cols.map(function (col) { return (__assign(__assign({}, col), { width: evenWidth })); });
    return adjustColumnsWidths(__assign(__assign({}, resizeState), { cols: cols }), maxSize);
};
export var bulkColumnsResize = function (resizeState, columnsIndexes, sourceColumnIndex) {
    var currentTableWidth = getTotalWidth(resizeState);
    var colIndex = columnsIndexes.indexOf(sourceColumnIndex) > -1
        ? sourceColumnIndex
        : sourceColumnIndex + 1;
    var sourceCol = resizeState.cols[colIndex];
    var seenColumns = {};
    var widthsDiffs = [];
    var cols = resizeState.cols.map(function (col) {
        if (columnsIndexes.indexOf(col.index) > -1) {
            var diff = col.width - sourceCol.width;
            if (diff !== 0) {
                widthsDiffs.push(diff);
            }
            return __assign(__assign({}, col), { width: sourceCol.width });
        }
        return col;
    });
    var newState = __assign(__assign({}, resizeState), { cols: cols.map(function (col) {
            if (columnsIndexes.indexOf(col.index) > -1 ||
                // take from prev columns only if dragging the first handle to the left
                (columnsIndexes.indexOf(sourceColumnIndex) > -1 && col.index < colIndex)) {
                return col;
            }
            while (widthsDiffs.length) {
                var diff = widthsDiffs.shift() || 0;
                var column = seenColumns[col.index] || col;
                var maybeWidth = column.width + diff;
                if (maybeWidth > column.minWidth) {
                    seenColumns[column.index] = __assign(__assign({}, column), { width: maybeWidth });
                }
                else {
                    widthsDiffs.push(maybeWidth - column.minWidth);
                    seenColumns[column.index] = __assign(__assign({}, column), { width: column.minWidth });
                    break;
                }
            }
            return seenColumns[col.index] || col;
        }) });
    // minimum possible table widths at the current layout
    var minTableWidth = resizeState.maxSize;
    // new table widths after bulk resize
    var newTotalWidth = getTotalWidth(newState);
    // when all columns are selected, what do we do when sum of columns widths is lower than min possible table widths?
    if (columnsIndexes.length === resizeState.cols.length &&
        newTotalWidth < minTableWidth) {
        // table is not in overflow -> normal resize of a single column
        if (currentTableWidth === minTableWidth) {
            return resizeState;
        }
        // table is in overflow: keep the dragged column at its widths and evenly distribute columns
        // to recover from overflow state
        else {
            var columnWidth_1 = Math.floor((minTableWidth - sourceCol.width) / (newState.cols.length - 1));
            newState = __assign(__assign({}, resizeState), { cols: newState.cols.map(function (col) {
                    if (col.index === sourceCol.index) {
                        return col;
                    }
                    return __assign(__assign({}, col), { width: columnWidth_1 });
                }) });
        }
    }
    // fix total table widths by adding missing pixels to columns widths here and there
    return adjustColumnsWidths(newState, resizeState.maxSize);
};
export var areColumnsEven = function (resizeState) {
    var newResizeState = evenAllColumnsWidths(resizeState);
    return newResizeState.cols.every(function (col, i) { return col.width === resizeState.cols[i].width; });
};
//# sourceMappingURL=resize-state.js.map
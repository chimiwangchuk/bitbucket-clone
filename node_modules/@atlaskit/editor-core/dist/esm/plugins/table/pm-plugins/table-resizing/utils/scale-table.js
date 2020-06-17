import { __assign } from "tslib";
import { tableCellMinWidth, akEditorTableNumberColumnWidth, } from '@atlaskit/editor-common';
import { getTableWidth } from '../../../utils';
import { getLayoutSize, getResizeState, getTotalWidth, reduceSpace, adjustColumnsWidths, } from '../utils';
// Base function to trigger the actual scale on a table node.
// Will only resize/scale if a table has been previously resized.
export var scale = function (tableRef, options, domAtPos) {
    /**
     * isBreakoutEnabled === true -> default center aligned
     * isBreakoutEnabled === false -> full width mode
     */
    var node = options.node, containerWidth = options.containerWidth, previousContainerWidth = options.previousContainerWidth, dynamicTextSizing = options.dynamicTextSizing, prevNode = options.prevNode, start = options.start, isBreakoutEnabled = options.isBreakoutEnabled, layoutChanged = options.layoutChanged;
    var maxSize = getLayoutSize(node.attrs.layout, containerWidth, {
        dynamicTextSizing: dynamicTextSizing,
        isBreakoutEnabled: isBreakoutEnabled,
    });
    var prevTableWidth = getTableWidth(prevNode);
    var previousMaxSize = getLayoutSize(prevNode.attrs.layout, previousContainerWidth, {
        dynamicTextSizing: dynamicTextSizing,
        isBreakoutEnabled: isBreakoutEnabled,
    });
    var newWidth = maxSize;
    // adjust table width if layout is updated
    var hasOverflow = prevTableWidth > previousMaxSize;
    if (layoutChanged && hasOverflow) {
        // No keep overflow if the old content can be in the new size
        var canFitInNewSize = prevTableWidth < maxSize;
        if (canFitInNewSize) {
            newWidth = maxSize;
        }
        else {
            // Keep the same scale.
            var overflowScale = prevTableWidth / previousMaxSize;
            newWidth = Math.floor(newWidth * overflowScale);
        }
    }
    if (node.attrs.isNumberColumnEnabled) {
        newWidth -= akEditorTableNumberColumnWidth;
    }
    var resizeState = getResizeState({
        minWidth: tableCellMinWidth,
        maxSize: maxSize,
        table: node,
        tableRef: tableRef,
        start: start,
        domAtPos: domAtPos,
    });
    return scaleTableTo(resizeState, newWidth);
};
export var scaleWithParent = function (tableRef, parentWidth, table, start, domAtPos) {
    var resizeState = getResizeState({
        minWidth: tableCellMinWidth,
        maxSize: parentWidth,
        table: table,
        tableRef: tableRef,
        start: start,
        domAtPos: domAtPos,
    });
    if (table.attrs.isNumberColumnEnabled) {
        parentWidth -= akEditorTableNumberColumnWidth;
    }
    return scaleTableTo(resizeState, Math.floor(parentWidth));
};
// Scales the table to a given size and updates its colgroup DOM node
function scaleTableTo(state, maxSize) {
    var scaleFactor = maxSize / getTotalWidth(state);
    var newState = __assign(__assign({}, state), { maxSize: maxSize, cols: state.cols.map(function (col) {
            var minWidth = col.minWidth, width = col.width;
            var newColWidth = Math.floor(width * scaleFactor);
            if (newColWidth < minWidth) {
                newColWidth = minWidth;
            }
            return __assign(__assign({}, col), { width: newColWidth });
        }) });
    var newTotalWidth = getTotalWidth(newState);
    if (newTotalWidth > maxSize) {
        newState = reduceSpace(newState, newTotalWidth - maxSize);
    }
    return adjustColumnsWidths(newState, maxSize);
}
//# sourceMappingURL=scale-table.js.map
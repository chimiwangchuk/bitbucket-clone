import { __assign } from "tslib";
import { akEditorTableNumberColumnWidth, } from '@atlaskit/editor-common';
import { tableInsertColumnButtonOffset, tableInsertColumnButtonSize, tableToolbarSize, } from '../styles';
var HORIZONTAL_ALIGN_COLUMN_BUTTON = -(tableInsertColumnButtonSize / 2);
var HORIZONTAL_ALIGN_NUMBERED_COLUMN_BUTTON = HORIZONTAL_ALIGN_COLUMN_BUTTON + akEditorTableNumberColumnWidth;
var VERTICAL_ALIGN_COLUMN_BUTTON = tableToolbarSize + tableInsertColumnButtonOffset;
var HORIZONTAL_ALIGN_ROW_BUTTON = -(tableToolbarSize +
    tableInsertColumnButtonOffset +
    tableInsertColumnButtonSize);
var VERTICAL_ALIGN_ROW_BUTTON = tableInsertColumnButtonSize / 2;
function getRowOptions(index) {
    var defaultOptions = {
        alignX: 'left',
        alignY: 'bottom',
        offset: [0, VERTICAL_ALIGN_ROW_BUTTON],
    };
    if (index === 0) {
        defaultOptions = __assign(__assign({}, defaultOptions), { alignY: 'top', 
            // The offset is the inverse the original, because is align top nop bottom.
            offset: [0, -VERTICAL_ALIGN_ROW_BUTTON] });
    }
    return __assign(__assign({}, defaultOptions), { onPositionCalculated: function (position) {
            return __assign(__assign({}, position), { 
                // Left position should be always the offset (To place in the correct position even if the table has overflow).
                left: HORIZONTAL_ALIGN_ROW_BUTTON });
        } });
}
function getColumnOptions(index, tableContainer, hasNumberedColumns) {
    var options = {
        alignX: 'end',
        alignY: 'top',
        offset: [HORIZONTAL_ALIGN_COLUMN_BUTTON, VERTICAL_ALIGN_COLUMN_BUTTON],
        // :: (position: PopupPosition) -> PopupPosition
        // Limit the InsertButton position to the table container
        // if the left position starts before it
        // we should always set the InsertButton on the start,
        // considering the offset from the first column
        onPositionCalculated: function (position) {
            var left = position.left;
            if (!left) {
                // If not left, lest skip expensive next calculations.
                return position;
            }
            if (index === 0) {
                return __assign(__assign({}, position), { left: hasNumberedColumns
                        ? HORIZONTAL_ALIGN_NUMBERED_COLUMN_BUTTON
                        : HORIZONTAL_ALIGN_COLUMN_BUTTON });
            }
            // Check if current position is greater than the available container width
            var rect = tableContainer
                ? tableContainer.getBoundingClientRect()
                : null;
            return __assign(__assign({}, position), { left: rect && left > rect.width ? rect.width : left });
        },
    };
    // We need to change the popup position when
    // the column index is zero
    if (index === 0) {
        return __assign(__assign({}, options), { alignX: 'left', alignY: 'top' });
    }
    return options;
}
function getPopupOptions(type, index, hasNumberedColumns, tableContainer) {
    switch (type) {
        case 'column':
            return getColumnOptions(index, tableContainer, hasNumberedColumns);
        case 'row':
            return getRowOptions(index);
        default:
            return {};
    }
}
export default getPopupOptions;
//# sourceMappingURL=getPopupOptions.js.map
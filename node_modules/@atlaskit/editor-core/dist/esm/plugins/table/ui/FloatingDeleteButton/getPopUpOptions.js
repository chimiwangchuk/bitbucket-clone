import { __assign } from "tslib";
import { tableDeleteButtonOffset, tableToolbarSize, tableDeleteButtonSize, } from '../styles';
var DELETE_BUTTON_CONTROLS_OFFSET = tableToolbarSize + tableDeleteButtonSize + tableDeleteButtonOffset;
function getColumnOptions(left, tableWrapper) {
    return {
        alignX: 'left',
        alignY: 'start',
        offset: [left, DELETE_BUTTON_CONTROLS_OFFSET],
        shouldRenderPopup: function () {
            if (tableWrapper) {
                var rect = tableWrapper.getBoundingClientRect();
                var maxVisibleLeftPosition = rect.width + tableWrapper.scrollLeft - tableDeleteButtonSize;
                var minVisibleLeftPosition = tableWrapper.scrollLeft;
                return (maxVisibleLeftPosition - left > 0 && left > minVisibleLeftPosition);
            }
            return true;
        },
    };
}
function getRowOptions(top) {
    return {
        alignX: 'left',
        alignY: 'start',
        forcePlacement: true,
        offset: [0, -top],
        onPositionCalculated: function (position) {
            return __assign(__assign({}, position), { 
                // We need to force left to always be the offset to not be affected by overflow
                left: -DELETE_BUTTON_CONTROLS_OFFSET });
        },
    };
}
export default function getPopupOptions(_a) {
    var left = _a.left, top = _a.top, selectionType = _a.selectionType, tableWrapper = _a.tableWrapper;
    switch (selectionType) {
        case 'column':
            return getColumnOptions(left, tableWrapper);
        case 'row':
            return getRowOptions(top);
        default: {
            return {};
        }
    }
}
//# sourceMappingURL=getPopUpOptions.js.map
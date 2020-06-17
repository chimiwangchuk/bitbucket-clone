import { __assign } from "tslib";
export default (function (pluginState, action) {
    switch (action.type) {
        case 'STOP_RESIZING':
            return __assign(__assign({}, pluginState), { resizeHandlePos: null, dragging: null });
        case 'SET_RESIZE_HANDLE_POSITION':
            return __assign(__assign({}, pluginState), { resizeHandlePos: action.data.resizeHandlePos });
        case 'SET_DRAGGING':
            return __assign(__assign({}, pluginState), { dragging: action.data.dragging });
        case 'SET_LAST_CLICK':
            var lastClick = action.data.lastClick;
            return __assign(__assign({}, pluginState), { lastClick: lastClick, resizeHandlePos: lastClick ? pluginState.resizeHandlePos : null });
        default:
            return pluginState;
    }
});
//# sourceMappingURL=reducer.js.map
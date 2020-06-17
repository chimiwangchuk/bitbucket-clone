import { __assign } from "tslib";
import { MediaLinkingActionsTypes } from './actions';
export default (function (state, action) {
    switch (action.type) {
        case MediaLinkingActionsTypes.showToolbar: {
            return __assign(__assign({}, state), { visible: true });
        }
        case MediaLinkingActionsTypes.setUrl: {
            return __assign(__assign({}, state), { editable: true, link: action.payload });
        }
        case MediaLinkingActionsTypes.hideToolbar: {
            return __assign(__assign({}, state), { visible: false });
        }
        case MediaLinkingActionsTypes.unlink: {
            return __assign(__assign({}, state), { link: '', visible: false, editable: false });
        }
    }
    return state;
});
//# sourceMappingURL=reducer.js.map
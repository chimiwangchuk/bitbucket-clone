var _a;
import { __assign } from "tslib";
import clone from 'lodash.clonedeep';
import * as actions from '../actions/constants';
import { getStatus } from '../actions/helpers';
var cardReducerMap = (_a = {},
    _a[actions.ACTION_PENDING] = function (_state, _a) {
        var type = _a.type;
        return { status: type, lastUpdatedAt: Date.now() };
    },
    _a[actions.ACTION_RESOLVING] = function (state, _a) {
        var type = _a.type;
        return __assign(__assign({}, state), { status: type });
    },
    _a[actions.ACTION_RESOLVED] = function (state, _a) {
        var type = _a.type, payload = _a.payload;
        var nextDetails = payload;
        var nextState = clone(state);
        if (nextDetails) {
            nextState.status = getStatus(nextDetails);
            nextState.details = nextDetails;
        }
        else {
            // Keep the pre-existing data in the store. If there
            // is no data, the UI should handle this gracefully.
            nextState.status = type;
        }
        nextState.lastUpdatedAt = Date.now();
        return nextState;
    },
    _a[actions.ACTION_ERROR] = function (state, _a) {
        var type = _a.type;
        return __assign(__assign({}, state), { status: type });
    },
    _a);
export var cardReducer = function (state, action) {
    var _a;
    if (cardReducerMap[action.type]) {
        var cardState = state[action.url];
        var nextState = cardReducerMap[action.type](cardState, action);
        return __assign(__assign({}, state), (_a = {}, _a[action.url] = nextState, _a));
    }
    return state;
};
//# sourceMappingURL=index.js.map
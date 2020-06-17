import { __assign, __read, __spread } from "tslib";
var queue = function (state, action) {
    return __assign(__assign({}, state), { requests: state.requests.concat(action.requests) });
};
var resolve = function (state, action) {
    var requests = state.requests.reduce(function (requests, request) {
        if (request.url !== action.url) {
            requests.push(request);
        }
        return requests;
    }, []);
    return __assign(__assign({}, state), { requests: requests });
};
var register = function (state, action) {
    return __assign(__assign({}, state), { cards: __spread(state.cards, [action.info]) });
};
var setProvider = function (state, action) {
    return __assign(__assign({}, state), { provider: action.provider });
};
var setLinkToolbar = function (state, action) {
    return __assign(__assign({}, state), { showLinkingToolbar: action.type === 'SHOW_LINK_TOOLBAR' });
};
export default (function (state, action) {
    switch (action.type) {
        case 'QUEUE':
            return queue(state, action);
        case 'SET_PROVIDER':
            return setProvider(state, action);
        case 'RESOLVE':
            return resolve(state, action);
        case 'REGISTER':
            return register(state, action);
        case 'SHOW_LINK_TOOLBAR':
        case 'HIDE_LINK_TOOLBAR':
            return setLinkToolbar(state, action);
    }
});
//# sourceMappingURL=reducers.js.map
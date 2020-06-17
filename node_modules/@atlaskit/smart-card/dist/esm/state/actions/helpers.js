import { isServerError } from '../../client/types';
export var cardAction = function (type, _a, payload) {
    var url = _a.url;
    return ({
        type: type,
        url: url,
        payload: payload,
    });
};
export var getByDefinitionId = function (definitionId, store) {
    var urls = Object.keys(store);
    return urls.filter(function (url) {
        var details = store[url].details;
        return details && details.meta.definitionId === definitionId;
    });
};
export var getUrl = function (store, url) {
    return (store.getState()[url] || {
        status: 'pending',
        lastUpdatedAt: Date.now(),
    });
};
export var getDefinitionId = function (details) {
    return details && details.meta && details.meta.definitionId;
};
export var getServices = function (details) {
    return (details && details.meta.auth) || [];
};
export var hasResolved = function (details) {
    return details && isAccessible(details) && isVisible(details);
};
export var isAccessible = function (_a) {
    var access = _a.meta.access;
    return access === 'granted';
};
export var isVisible = function (_a) {
    var visibility = _a.meta.visibility;
    return visibility === 'restricted' || visibility === 'public';
};
export var getStatus = function (_a) {
    var meta = _a.meta;
    var access = meta.access, visibility = meta.visibility;
    switch (access) {
        case 'forbidden':
            if (visibility === 'not_found') {
                return 'not_found';
            }
            else {
                return 'forbidden';
            }
        case 'unauthorized':
            return 'unauthorized';
        default:
            return 'resolved';
    }
};
export var getError = function (obj) {
    if (isServerError(obj)) {
        return obj.name;
    }
    else {
        var data = obj.data;
        var _a = (data || {}).error, error = _a === void 0 ? {} : _a;
        return error.type;
    }
};
//# sourceMappingURL=helpers.js.map
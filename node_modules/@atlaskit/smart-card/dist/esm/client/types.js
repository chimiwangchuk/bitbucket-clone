export var isServerError = function (obj) {
    return 'message' in obj && 'name' in obj && 'resourceUrl' in obj && 'status' in obj;
};
//# sourceMappingURL=types.js.map
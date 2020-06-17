export var doc = function () {
    var content = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        content[_i] = arguments[_i];
    }
    return ({
        type: 'doc',
        version: 1,
        content: content,
    });
};
//# sourceMappingURL=doc.js.map
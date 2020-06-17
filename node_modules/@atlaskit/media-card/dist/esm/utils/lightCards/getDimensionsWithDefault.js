export var getDimensionsWithDefault = function (dimensions) {
    if (dimensions === void 0) { dimensions = { width: '100%', height: '100%' }; }
    return {
        height: typeof dimensions.height === 'number'
            ? dimensions.height + "px"
            : dimensions.height,
        width: typeof dimensions.width === 'number'
            ? dimensions.width + "px"
            : dimensions.width,
    };
};
//# sourceMappingURL=getDimensionsWithDefault.js.map
export var snapTo = function (target, points) {
    return points.length === 0
        ? // extreme last case if there are no points somehow
            target
        : points.reduce(function (point, closest) {
            return Math.abs(closest - target) < Math.abs(point - target)
                ? closest
                : point;
        });
};
export var handleSides = ['left', 'right'];
export var alignmentLayouts = ['align-start', 'align-end'];
export var imageAlignmentMap = {
    left: 'start',
    right: 'end',
};
//# sourceMappingURL=utils.js.map
import { gridSize } from '@atlaskit/theme/constants';
var dimensions = {
    regular: {
        height: gridSize() * 2,
        width: gridSize() * 4,
    },
    large: {
        height: gridSize() * 2 + gridSize() / 2,
        width: gridSize() * 5,
    },
};
export var borderWidth = '2px';
export var paddingUnitless = gridSize() / 4;
export var transition = '0.2s';
export var getHeight = function (_a) {
    var size = _a.size;
    return dimensions[size].height;
};
export var getWidth = function (_a) {
    var size = _a.size;
    return dimensions[size].width;
};
//# sourceMappingURL=constants.js.map
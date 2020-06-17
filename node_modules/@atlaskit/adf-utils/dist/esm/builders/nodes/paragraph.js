import { createTextNodes } from '../utils/create-text-nodes';
export var paragraph = function () {
    var content = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        content[_i] = arguments[_i];
    }
    return ({
        type: 'paragraph',
        content: createTextNodes(content),
    });
};
//# sourceMappingURL=paragraph.js.map
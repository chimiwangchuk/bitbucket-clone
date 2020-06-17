import { __assign } from "tslib";
import { traverse } from '@atlaskit/adf-utils';
export function removeMarks(node) {
    var newNode = __assign({}, node);
    delete newNode.marks;
    return newNode;
}
export function sanitizeNode(json) {
    var sanitizedJSON = traverse(json, {
        text: function (node) {
            if (!node || !Array.isArray(node.marks)) {
                return node;
            }
            return __assign(__assign({}, node), { marks: node.marks.filter(function (mark) { return mark.type !== 'typeAheadQuery'; }) });
        },
        status: function (node) {
            if (node.attrs && !!node.attrs.text) {
                return removeMarks(node);
            }
            return false; // empty status
        },
        emoji: removeMarks,
        mention: removeMarks,
        date: removeMarks,
        hardBreak: removeMarks,
        inlineCard: removeMarks,
    });
    return sanitizedJSON;
}
//# sourceMappingURL=node-filter.js.map
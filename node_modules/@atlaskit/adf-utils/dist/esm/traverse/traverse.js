import { __assign } from "tslib";
export function validateVisitors(_visitors) {
    return true;
}
export function traverse(adf, visitors) {
    if (!validateVisitors(visitors)) {
        throw new Error("Visitors are not valid: \"" + Object.keys(visitors).join(', ') + "\"");
    }
    return traverseNode(adf, { node: undefined }, visitors, 0);
}
function traverseNode(adfNode, parent, visitors, index) {
    var visitor = visitors[adfNode.type] || visitors['any'];
    var newNode = __assign({}, adfNode);
    if (visitor) {
        var processedNode = visitor(__assign({}, newNode), parent, index);
        if (processedNode === false) {
            return false;
        }
        newNode = processedNode || adfNode;
    }
    if (newNode.content) {
        newNode.content = newNode.content.reduce(function (acc, node, idx) {
            var processedNode = traverseNode(node, { node: newNode, parent: parent }, visitors, idx);
            if (processedNode !== false) {
                acc.push(processedNode);
            }
            return acc;
        }, []);
    }
    return newNode;
}
//# sourceMappingURL=traverse.js.map
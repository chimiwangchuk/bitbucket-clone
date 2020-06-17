import { traverse } from './traverse';
export function reduce(adf, callback, initial) {
    var result = initial;
    traverse(adf, {
        any: function (node) {
            result = callback(result, node);
        },
    });
    return result;
}
//# sourceMappingURL=reduce.js.map
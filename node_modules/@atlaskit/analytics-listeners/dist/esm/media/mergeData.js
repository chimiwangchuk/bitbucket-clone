import { __assign, __read, __spread } from "tslib";
// TagsA will be added first in the tags array
var joinPayloadTags = function (tagsA, tagsB) {
    return tagsA || tagsB ? { tags: __spread((tagsA || []), (tagsB || [])) } : {};
};
// Object A overrides Object B
var mergePayloadAttributes = function (attributesA, attributesB) {
    return attributesA || attributesB
        ? {
            attributes: __assign(__assign({}, (attributesB || {})), (attributesA || {})),
        }
        : {};
};
// Object A overrides Object B
// Tags from Object A will be added first in the tags array
function mergePayloadObjects(payloadA, payloadB) {
    return __assign(__assign(__assign(__assign({}, payloadB), payloadA), mergePayloadAttributes(payloadA.attributes, payloadB.attributes)), joinPayloadTags(payloadA.tags, payloadB.tags));
}
function mergeContext(payload, context) {
    return context.reduce(function (merged, contextData) {
        if (haveSamePackageName(payload, contextData)) {
            return mergePayloadObjects(contextData, merged);
        }
        else {
            return merged;
        }
    }, {});
}
function haveSamePackageName(payloadA, payloadB) {
    var packageNameA = payloadA.attributes && payloadA.attributes.packageName;
    var packageNameB = payloadB.attributes && payloadB.attributes.packageName;
    return packageNameA && packageNameB && packageNameA === packageNameB;
}
// This function merges payload with all the context data that match on attributes.packageName
// All the merged data is meant to be included on the final GAS payload.
// Attributes override each other considering payload as top priority and then each context data
// from the deepest level of the component tree (highest priority) to the top most level (lowest priority).
export function mergeEventData(_a) {
    var payload = _a.payload, context = _a.context;
    if (!payload) {
        return;
    }
    var mergedContext = mergeContext(payload, context);
    return mergePayloadObjects(payload, mergedContext);
}
//# sourceMappingURL=mergeData.js.map
import { __assign, __rest } from "tslib";
import { DEFAULT_SOURCE, } from '@atlaskit/analytics-gas-types';
import { ELEMENTS_CONTEXT, EDITOR_CONTEXT, } from '@atlaskit/analytics-namespaced-context';
import merge from 'lodash.merge';
import { ELEMENTS_TAG } from './FabricElementsListener';
import { EDITOR_TAG } from './FabricEditorListener';
var extractFieldsFromContext = function (fieldsToPick) { return function (contexts) {
    return contexts
        .map(function (ctx) {
        return fieldsToPick.reduce(function (result, key) {
            var _a;
            return ctx[key] ? merge(result, (_a = {}, _a[key] = ctx[key], _a)) : result;
        }, {});
    })
        .reduce(function (result, item) { return merge(result, item); }, {});
}; };
var fieldExtractor = function (contextKey) {
    return extractFieldsFromContext([
        'source',
        'objectType',
        'objectId',
        'containerType',
        'containerId',
        contextKey,
    ]);
};
var getContextKey = function (tag) {
    switch (tag) {
        case ELEMENTS_TAG:
            return ELEMENTS_CONTEXT;
        case EDITOR_TAG:
            return EDITOR_CONTEXT;
        default:
            return '';
    }
};
var updatePayloadWithContext = function (tag, event) {
    if (event.context.length === 0) {
        return __assign({ source: DEFAULT_SOURCE }, event.payload);
    }
    var contextKey = getContextKey(tag) || 'attributes';
    var _a = fieldExtractor(contextKey)(event.context), _b = contextKey, attributes = _a[_b], fields = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    if (attributes) {
        event.payload.attributes = merge(attributes, event.payload.attributes || {});
    }
    return __assign(__assign({ source: DEFAULT_SOURCE }, fields), event.payload);
};
var addTag = function (tag, originalTags) {
    var tags = new Set(originalTags || []);
    tags.add(tag);
    return Array.from(tags);
};
export var processEventPayload = function (event, tag) {
    return __assign(__assign({}, updatePayloadWithContext(tag, event)), { tags: addTag(tag, event.payload.tags) });
};
//# sourceMappingURL=process-event-payload.js.map
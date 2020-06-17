import { __assign } from "tslib";
import { traverse } from '@atlaskit/adf-utils';
import { isResolvingMentionProvider, } from '@atlaskit/mention/resource';
/**
 * Sanitises a document where some content should not be in the document (e.g. mention names).
 *
 * It is expected that these names we be resolved separately (e.g. when rendering
 * a node view).
 */
export function sanitizeNodeForPrivacy(json, providerFactory) {
    var mentionNames = new Map();
    var hasCacheableMentions = false;
    var sanitizedJSON = traverse(json, {
        mention: function (node) {
            if (node.attrs && node.attrs.text) {
                hasCacheableMentions = true;
                // Remove @ prefix
                var text = node.attrs.text;
                var name_1 = text.startsWith('@') ? text.slice(1) : text;
                mentionNames.set(node.attrs.id, name_1);
            }
            return __assign(__assign({}, node), { attrs: __assign(__assign({}, node.attrs), { text: '' }) });
        },
    });
    if (hasCacheableMentions && providerFactory) {
        var handler_1 = function (_name, providerPromise) {
            if (providerPromise) {
                providerPromise.then(function (provider) {
                    if (isResolvingMentionProvider(provider)) {
                        mentionNames.forEach(function (name, id) {
                            provider.cacheMentionName(id, name);
                        });
                        mentionNames.clear();
                        providerFactory.unsubscribe('mentionProvider', handler_1);
                    }
                });
            }
        };
        providerFactory.subscribe('mentionProvider', handler_1);
    }
    return sanitizedJSON;
}
//# sourceMappingURL=privacy-filter.js.map
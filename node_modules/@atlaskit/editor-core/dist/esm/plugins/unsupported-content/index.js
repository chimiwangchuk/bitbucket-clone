import { confluenceUnsupportedBlock, confluenceUnsupportedInline, unsupportedBlock, unsupportedInline, } from '@atlaskit/adf-schema';
import { Plugin, PluginKey } from 'prosemirror-state';
import { ReactNodeView } from '../../nodeviews';
import ReactUnsupportedBlockNode from './nodeviews/unsupported-block';
import ReactUnsupportedInlineNode from './nodeviews/unsupported-inline';
import { traverseNode } from './utils';
export var pluginKey = new PluginKey('unsupportedContentPlugin');
var createPlugin = function (_a) {
    var schema = _a.schema, portalProviderAPI = _a.portalProviderAPI;
    return new Plugin({
        state: {
            init: function (_config, state) {
                traverseNode(state.doc, schema);
            },
            apply: function (_tr, pluginState) {
                return pluginState;
            },
        },
        key: pluginKey,
        props: {
            nodeViews: {
                confluenceUnsupportedBlock: ReactNodeView.fromComponent(ReactUnsupportedBlockNode, portalProviderAPI),
                confluenceUnsupportedInline: ReactNodeView.fromComponent(ReactUnsupportedInlineNode, portalProviderAPI),
                unsupportedBlock: ReactNodeView.fromComponent(ReactUnsupportedBlockNode, portalProviderAPI),
                unsupportedInline: ReactNodeView.fromComponent(ReactUnsupportedInlineNode, portalProviderAPI),
            },
        },
    });
};
var unsupportedContentPlugin = function () { return ({
    name: 'unsupportedContent',
    nodes: function () {
        return [
            {
                name: 'confluenceUnsupportedBlock',
                node: confluenceUnsupportedBlock,
            },
            {
                name: 'confluenceUnsupportedInline',
                node: confluenceUnsupportedInline,
            },
            {
                name: 'unsupportedBlock',
                node: unsupportedBlock,
            },
            {
                name: 'unsupportedInline',
                node: unsupportedInline,
            },
        ];
    },
    pmPlugins: function () {
        return [
            {
                name: 'unsupportedContent',
                plugin: createPlugin,
            },
        ];
    },
}); };
export default unsupportedContentPlugin;
//# sourceMappingURL=index.js.map
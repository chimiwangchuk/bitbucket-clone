import { PluginKey } from 'prosemirror-state';
export var pluginKey = new PluginKey('customAutoformatPlugin');
export var getPluginState = function (editorState) {
    return pluginKey.getState(editorState);
};
export var autoformatAction = function (tr, action) {
    return tr.setMeta(pluginKey, action);
};
//# sourceMappingURL=utils.js.map
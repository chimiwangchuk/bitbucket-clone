import { pmHistoryPluginKey } from './pm-history-types';
export var getPmHistoryPlugin = function (state) {
    return state.plugins.find(function (plugin) { return plugin.key === pmHistoryPluginKey; });
};
export var getPmHistoryPluginState = function (state) {
    var pmHistoryPlugin = getPmHistoryPlugin(state);
    if (!pmHistoryPlugin) {
        return;
    }
    return pmHistoryPlugin.getState(state);
};
//# sourceMappingURL=utils.js.map
import { Plugin, PluginKey } from 'prosemirror-state';
import { checkFormattingIsPresent } from '../utils';
export var pluginKey = new PluginKey('clearFormattingPlugin');
export var plugin = function (dispatch) {
    return new Plugin({
        state: {
            init: function (_config, state) {
                return { formattingIsPresent: checkFormattingIsPresent(state) };
            },
            apply: function (_tr, pluginState, _oldState, newState) {
                var formattingIsPresent = checkFormattingIsPresent(newState);
                if (formattingIsPresent !== pluginState.formattingIsPresent) {
                    dispatch(pluginKey, { formattingIsPresent: formattingIsPresent });
                    return { formattingIsPresent: formattingIsPresent };
                }
                return pluginState;
            },
        },
        key: pluginKey,
    });
};
//# sourceMappingURL=clear-formatting.js.map
import { __assign } from "tslib";
import { Plugin, PluginKey } from 'prosemirror-state';
import { isAlignable } from '../commands';
import { getActiveAlignment } from '../utils';
export function createInitialPluginState(editorState, pluginConfig) {
    return {
        align: getActiveAlignment(editorState) || pluginConfig.align,
        isEnabled: true,
    };
}
export var pluginKey = new PluginKey('alignmentPlugin');
export function createPlugin(dispatch, pluginConfig) {
    return new Plugin({
        key: pluginKey,
        state: {
            init: function (_config, editorState) {
                return createInitialPluginState(editorState, pluginConfig);
            },
            apply: function (_tr, state, _prevState, nextState) {
                var nextPluginState = getActiveAlignment(nextState);
                var isEnabled = isAlignable(nextPluginState)(nextState, 
                /**
                 * NOTE: Stan is already making dispatch optional in another PR.
                 * We can remove this once it's merged.
                 */
                undefined);
                var newState = __assign(__assign({}, state), { align: nextPluginState, isEnabled: isEnabled });
                if (nextPluginState !== state.align || isEnabled !== state.isEnabled) {
                    dispatch(pluginKey, newState);
                }
                return newState;
            },
        },
    });
}
//# sourceMappingURL=main.js.map
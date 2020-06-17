import { __assign } from "tslib";
import { Plugin, PluginKey } from 'prosemirror-state';
import { findParentDomRefOfType, findParentNodeOfType, } from 'prosemirror-utils';
import codeBlockNodeView from '../nodeviews/code-block';
export var getPluginState = function (state) {
    return pluginKey.getState(state);
};
export var setPluginState = function (stateProps) { return function (state, dispatch) {
    var pluginState = getPluginState(state);
    dispatch(state.tr.setMeta(pluginKey, __assign(__assign({}, pluginState), stateProps)));
    return true;
}; };
export var pluginKey = new PluginKey('codeBlockPlugin');
export var createPlugin = function (_a) {
    var dispatch = _a.dispatch;
    return new Plugin({
        state: {
            init: function () {
                return {
                    toolbarVisible: false,
                };
            },
            apply: function (tr, pluginState) {
                var nextPluginState = tr.getMeta(pluginKey);
                if (nextPluginState) {
                    dispatch(pluginKey, nextPluginState);
                    return nextPluginState;
                }
                return pluginState;
            },
        },
        key: pluginKey,
        view: function () {
            return {
                update: function (view) {
                    var _a = view.state, selection = _a.selection, codeBlock = _a.schema.nodes.codeBlock;
                    var pluginState = getPluginState(view.state);
                    var parentDOM = findParentDomRefOfType(codeBlock, view.domAtPos.bind(view))(selection);
                    if (parentDOM !== pluginState.element) {
                        var parent_1 = findParentNodeOfType(codeBlock)(selection);
                        var newState = {
                            element: parentDOM,
                            toolbarVisible: !!parent_1,
                        };
                        setPluginState(newState)(view.state, view.dispatch);
                        return true;
                    }
                    /** Plugin dispatch needed to reposition the toolbar */
                    dispatch(pluginKey, __assign({}, pluginState));
                    return;
                },
            };
        },
        props: {
            nodeViews: {
                codeBlock: codeBlockNodeView,
            },
            handleDOMEvents: {
                blur: function (view) {
                    var pluginState = getPluginState(view.state);
                    if (pluginState.toolbarVisible) {
                        setPluginState({
                            toolbarVisible: false,
                            element: null,
                        })(view.state, view.dispatch);
                        return true;
                    }
                    return false;
                },
            },
        },
    });
};
//# sourceMappingURL=main.js.map
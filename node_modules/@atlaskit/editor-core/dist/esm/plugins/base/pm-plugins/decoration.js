import { DecorationSet, Decoration } from 'prosemirror-view';
import { PluginKey, Plugin, NodeSelection, } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
export var decorationStateKey = new PluginKey('decorationPlugin');
export var ACTIONS;
(function (ACTIONS) {
    ACTIONS[ACTIONS["DECORATION_ADD"] = 0] = "DECORATION_ADD";
    ACTIONS[ACTIONS["DECORATION_REMOVE"] = 1] = "DECORATION_REMOVE";
})(ACTIONS || (ACTIONS = {}));
export var hoverDecoration = function (nodeType, add, className) {
    if (className === void 0) { className = 'danger'; }
    return function (state, dispatch) {
        var parentNode;
        var from;
        if (state.selection instanceof NodeSelection) {
            parentNode = state.selection.node;
            var nodeTypes = Array.isArray(nodeType) ? nodeType : [nodeType];
            if (nodeTypes.indexOf(parentNode.type) < 0) {
                return false;
            }
            from = state.selection.from;
        }
        else {
            var foundParentNode = findParentNodeOfType(nodeType)(state.selection);
            if (!foundParentNode) {
                return false;
            }
            from = foundParentNode.pos;
            parentNode = foundParentNode.node;
        }
        if (!parentNode) {
            return false;
        }
        if (dispatch) {
            dispatch(state.tr
                .setMeta(decorationStateKey, {
                action: add ? ACTIONS.DECORATION_ADD : ACTIONS.DECORATION_REMOVE,
                data: Decoration.node(from, from + parentNode.nodeSize, {
                    class: className,
                }, { key: 'decorationNode' }),
            })
                .setMeta('addToHistory', false));
        }
        return true;
    };
};
export default (function () {
    return new Plugin({
        key: decorationStateKey,
        state: {
            init: function () { return ({ decoration: undefined }); },
            apply: function (tr, pluginState) {
                if (pluginState.decoration) {
                    var mapResult = tr.mapping.mapResult(pluginState.decoration.from);
                    if (mapResult.deleted) {
                        pluginState = { decoration: undefined };
                    }
                }
                var meta = tr.getMeta(decorationStateKey);
                if (!meta) {
                    return pluginState;
                }
                switch (meta.action) {
                    case ACTIONS.DECORATION_ADD:
                        return {
                            decoration: meta.data,
                        };
                    case ACTIONS.DECORATION_REMOVE:
                        return { decoration: undefined };
                    default:
                        return pluginState;
                }
            },
        },
        props: {
            decorations: function (state) {
                var doc = state.doc;
                var decoration = decorationStateKey.getState(state).decoration;
                if (decoration) {
                    return DecorationSet.create(doc, [decoration]);
                }
                return null;
            },
        },
    });
});
//# sourceMappingURL=decoration.js.map
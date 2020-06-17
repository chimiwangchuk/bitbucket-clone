import { __assign, __read, __spread } from "tslib";
import { Plugin, PluginKey } from 'prosemirror-state';
import { analyticsService } from '../../analytics';
import { dedupe } from '../../utils';
import { find } from './search';
import { analyticsEventKey, ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, ACTION_SUBJECT_ID, } from '../analytics';
var quickInsertPlugin = function () { return ({
    name: 'quickInsert',
    pmPlugins: function (quickInsert) {
        return [
            {
                name: 'quickInsert',
                plugin: function (_a) {
                    var providerFactory = _a.providerFactory;
                    return quickInsertPluginFactory(quickInsert, providerFactory);
                },
            },
        ];
    },
    pluginsOptions: {
        typeAhead: {
            trigger: '/',
            getItems: function (query, state, intl, _a, _tr, dispatch) {
                var prevActive = _a.prevActive, queryChanged = _a.queryChanged;
                analyticsService.trackEvent('atlassian.editor.quickinsert.query');
                if (!prevActive && queryChanged) {
                    dispatch(analyticsEventKey, {
                        payload: {
                            action: ACTION.INVOKED,
                            actionSubject: ACTION_SUBJECT.TYPEAHEAD,
                            actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_QUICK_INSERT,
                            attributes: { inputMethod: INPUT_METHOD.KEYBOARD },
                            eventType: EVENT_TYPE.UI,
                        },
                    });
                }
                var quickInsertState = pluginKey.getState(state);
                var defaultItems = processItems(quickInsertState.items, intl);
                var defaultSearch = function () { return find(query, defaultItems); };
                if (quickInsertState.provider) {
                    return quickInsertState.provider
                        .then(function (items) {
                        return find(query, dedupe(__spread(defaultItems, items), function (item) { return item.title; }));
                    })
                        .catch(function (err) {
                        // eslint-disable-next-line no-console
                        console.error(err);
                        return defaultSearch();
                    });
                }
                return defaultSearch();
            },
            selectItem: function (state, item, insert) {
                analyticsService.trackEvent('atlassian.editor.quickinsert.select', {
                    item: item.title,
                });
                return item.action(insert, state);
            },
        },
    },
}); };
export default quickInsertPlugin;
var itemsCache = {};
var processItems = function (items, intl) {
    if (!itemsCache[intl.locale]) {
        itemsCache[intl.locale] = items.reduce(function (acc, item) {
            if (typeof item === 'function') {
                return acc.concat(item(intl));
            }
            return acc.concat(item);
        }, []);
    }
    return itemsCache[intl.locale];
};
/**
 *
 * ProseMirror Plugin
 *
 */
export var pluginKey = new PluginKey('quickInsertPluginKey');
export var setProvider = function (provider) { return function (state, dispatch) {
    if (dispatch) {
        dispatch(state.tr.setMeta(pluginKey, provider));
    }
    return true;
}; };
function quickInsertPluginFactory(quickInsertItems, providerFactory) {
    return new Plugin({
        key: pluginKey,
        state: {
            init: function () {
                return {
                    items: quickInsertItems || [],
                };
            },
            apply: function (tr, pluginState) {
                var provider = tr.getMeta(pluginKey);
                if (provider) {
                    return __assign(__assign({}, pluginState), { provider: provider });
                }
                return pluginState;
            },
        },
        view: function (editorView) {
            var providerHandler = function (_name, providerPromise) {
                if (providerPromise) {
                    setProvider(providerPromise.then(function (provider) {
                        return provider.getItems();
                    }))(editorView.state, editorView.dispatch);
                }
            };
            providerFactory.subscribe('quickInsertProvider', providerHandler);
            return {
                destroy: function () {
                    providerFactory.unsubscribe('quickInsertProvider', providerHandler);
                },
            };
        },
    });
}
//# sourceMappingURL=index.js.map
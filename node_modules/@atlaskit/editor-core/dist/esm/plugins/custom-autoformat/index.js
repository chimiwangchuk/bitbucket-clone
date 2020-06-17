import { __assign, __awaiter, __generator } from "tslib";
import { Plugin as PMPlugin } from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import reducers from './reducers';
import { triggerInputRule } from './input-rules';
import { completeReplacements, buildHandler } from './doc';
import { getPluginState, pluginKey } from './utils';
export var createPMPlugin = function (_a) {
    var providerFactory = _a.providerFactory;
    var rules = [];
    return new PMPlugin({
        state: {
            init: function () {
                return {
                    resolving: [],
                    matches: [],
                };
            },
            apply: function (tr, prevPluginState) {
                if (!prevPluginState) {
                    return prevPluginState;
                }
                // remap positions
                var remappedPluginState = __assign(__assign({}, prevPluginState), { resolving: prevPluginState.resolving.map(function (candidate) { return (__assign(__assign({}, candidate), { start: tr.mapping.map(candidate.start), end: tr.mapping.map(candidate.end, -1) })); }) });
                var meta = tr.getMeta(pluginKey);
                if (!meta) {
                    return remappedPluginState;
                }
                return reducers(remappedPluginState, meta);
            },
        },
        props: {
            handleTextInput: function (view, from, to, text) {
                triggerInputRule(view, rules, from, to, text);
                return false;
            },
            handleKeyDown: keydownHandler({
                Enter: function (_state, _dispatch, view) {
                    triggerInputRule(view, rules, view.state.selection.from, view.state.selection.to, '');
                    return false;
                },
            }),
        },
        view: function () {
            var _this = this;
            var handleProvider = function (name, provider) {
                if (name !== 'autoformattingProvider' || !provider) {
                    return;
                }
                provider.then(function (autoformattingProvider) { return __awaiter(_this, void 0, void 0, function () {
                    var ruleset;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, autoformattingProvider.getRules()];
                            case 1:
                                ruleset = _a.sent();
                                Object.keys(ruleset).forEach(function (rule) {
                                    var inputRule = {
                                        matchTyping: new RegExp('(\\s+|^)' + rule + '(\\s)$'),
                                        matchEnter: new RegExp('(\\s+|^)' + rule + '()$'),
                                        handler: buildHandler(rule, ruleset[rule]),
                                    };
                                    rules.push(inputRule);
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
            providerFactory.subscribe('autoformattingProvider', handleProvider);
            return {
                update: function (view) {
                    var currentState = getPluginState(view.state);
                    if (!currentState) {
                        return;
                    }
                    // make replacements in document for finished autoformats
                    if (currentState.matches) {
                        completeReplacements(view, currentState);
                    }
                },
                destroy: function () {
                    providerFactory.unsubscribe('autoformattingProvider', handleProvider);
                },
            };
        },
        key: pluginKey,
    });
};
var customAutoformatPlugin = function () { return ({
    name: 'customAutoformat',
    pmPlugins: function () {
        return [{ name: 'customAutoformat', plugin: createPMPlugin }];
    },
}); };
export default customAutoformatPlugin;
//# sourceMappingURL=index.js.map
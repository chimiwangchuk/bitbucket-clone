import { toggleMark } from 'prosemirror-commands';
import { Plugin, PluginKey } from 'prosemirror-state';
import { shallowEqual } from '../../../utils';
import { anyMarkActive } from '../utils';
import { createInlineCodeFromTextInputWithAnalytics } from '../commands/text-formatting';
import * as keymaps from '../../../keymaps';
import * as commands from '../commands/text-formatting';
export var pluginKey = new PluginKey('textFormatting');
var getTextFormattingState = function (editorState) {
    var _a = editorState.schema.marks, em = _a.em, code = _a.code, strike = _a.strike, strong = _a.strong, subsup = _a.subsup, underline = _a.underline;
    var state = {};
    if (code) {
        state.codeActive = anyMarkActive(editorState, code.create());
        state.codeDisabled = !toggleMark(code)(editorState);
    }
    if (em) {
        state.emActive = anyMarkActive(editorState, em);
        state.emDisabled = state.codeActive ? true : !toggleMark(em)(editorState);
    }
    if (strike) {
        state.strikeActive = anyMarkActive(editorState, strike);
        state.strikeDisabled = state.codeActive
            ? true
            : !toggleMark(strike)(editorState);
    }
    if (strong) {
        state.strongActive = anyMarkActive(editorState, strong);
        state.strongDisabled = state.codeActive
            ? true
            : !toggleMark(strong)(editorState);
    }
    if (subsup) {
        var subMark = subsup.create({ type: 'sub' });
        var supMark = subsup.create({ type: 'sup' });
        state.subscriptActive = anyMarkActive(editorState, subMark);
        state.subscriptDisabled = state.codeActive
            ? true
            : !toggleMark(subsup, { type: 'sub' })(editorState);
        state.superscriptActive = anyMarkActive(editorState, supMark);
        state.superscriptDisabled = state.codeActive
            ? true
            : !toggleMark(subsup, { type: 'sup' })(editorState);
    }
    if (underline) {
        state.underlineActive = anyMarkActive(editorState, underline);
        state.underlineDisabled = state.codeActive
            ? true
            : !toggleMark(underline)(editorState);
    }
    return state;
};
export var plugin = function (dispatch) {
    return new Plugin({
        state: {
            init: function (_config, state) {
                return getTextFormattingState(state);
            },
            apply: function (_tr, pluginState, _oldState, newState) {
                var state = getTextFormattingState(newState);
                if (!shallowEqual(pluginState, state)) {
                    dispatch(pluginKey, state);
                    return state;
                }
                return pluginState;
            },
        },
        key: pluginKey,
        props: {
            handleKeyDown: function (view, event) {
                var state = view.state, dispatch = view.dispatch;
                if (event.key === keymaps.moveRight.common) {
                    return commands.moveRight()(state, dispatch);
                }
                else if (event.key === keymaps.moveLeft.common) {
                    return commands.moveLeft()(state, dispatch);
                }
                return false;
            },
            handleTextInput: function (view, from, to, text) {
                var state = view.state, dispatch = view.dispatch;
                return createInlineCodeFromTextInputWithAnalytics(from, to, text)(state, dispatch);
            },
        },
    });
};
//# sourceMappingURL=main.js.map
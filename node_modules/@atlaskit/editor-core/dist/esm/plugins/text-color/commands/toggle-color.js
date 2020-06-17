import { pluginKey, ACTIONS } from '../pm-plugins/main';
import { getDisabledState } from '../utils/disabled';
import { toggleMark } from '../../../utils/commands';
export var toggleColor = function (color) { return function (state, dispatch) {
    var textColor = state.schema.marks.textColor;
    var tr = state.tr;
    var disabledState = getDisabledState(state);
    if (disabledState) {
        if (dispatch) {
            dispatch(tr.setMeta(pluginKey, { action: ACTIONS.DISABLE }));
        }
        return false;
    }
    if (dispatch) {
        state.tr.setMeta(pluginKey, { action: ACTIONS.SET_COLOR, color: color });
        state.tr.scrollIntoView();
        toggleMark(textColor, { color: color })(state, dispatch);
    }
    return true;
}; };
//# sourceMappingURL=toggle-color.js.map
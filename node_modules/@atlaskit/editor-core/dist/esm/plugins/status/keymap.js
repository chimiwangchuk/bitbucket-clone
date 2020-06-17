import { keymap } from 'prosemirror-keymap';
import * as keymaps from '../../keymaps';
import { mayGetStatusAtSelection } from './utils';
export function keymapPlugin() {
    var list = {};
    keymaps.bindKeymapWithCommand(keymaps.enter.common, consumeKeyEvent, list);
    keymaps.bindKeymapWithCommand(keymaps.tab.common, consumeKeyEvent, list);
    return keymap(list);
}
// consume event to prevent status node problems with positioning and selection
var consumeKeyEvent = function (state, _dispatch) {
    return !!mayGetStatusAtSelection(state.tr.selection);
};
export default keymapPlugin;
//# sourceMappingURL=keymap.js.map
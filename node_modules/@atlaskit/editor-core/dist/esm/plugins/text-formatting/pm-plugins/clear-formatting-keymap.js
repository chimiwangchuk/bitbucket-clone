import { keymap } from 'prosemirror-keymap';
import * as keymaps from '../../../keymaps';
import { trackAndInvoke } from '../../../analytics';
import { clearFormattingWithAnalytics } from '../commands/clear-formatting';
import { INPUT_METHOD } from '../../analytics';
export function keymapPlugin() {
    var list = {};
    keymaps.bindKeymapWithCommand(keymaps.clearFormatting.common, trackAndInvoke('atlassian.editor.format.clear.keyboard', clearFormattingWithAnalytics(INPUT_METHOD.SHORTCUT)), list);
    return keymap(list);
}
export default keymapPlugin;
//# sourceMappingURL=clear-formatting-keymap.js.map
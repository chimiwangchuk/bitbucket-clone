import { Plugin, PluginKey } from 'prosemirror-state';
import { isEmptyDocument } from '../../utils';
export var pluginKey = new PluginKey('clearMarksOnChangeToEmptyDocumentPlugin');
export function createPlugin() {
    return new Plugin({
        key: pluginKey,
        appendTransaction: function (_transactions, oldState, newState) {
            // ED-2973: When a user clears the editor's content, remove the current active marks
            if (!isEmptyDocument(oldState.doc) && isEmptyDocument(newState.doc)) {
                return newState.tr.setStoredMarks([]);
            }
            return;
        },
    });
}
var clearMarksOnChangeToEmptyDocumentPlugin = function () { return ({
    name: 'clearMarksOnEmptyDoc',
    pmPlugins: function () {
        return [{ name: 'clearMarksOnChange', plugin: createPlugin }];
    },
}); };
export default clearMarksOnChangeToEmptyDocumentPlugin;
//# sourceMappingURL=index.js.map
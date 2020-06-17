import plugin from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
export { GapCursorSelection, Side } from './selection';
export { setCursorForTopLevelBlocks } from './actions';
var gapCursorPlugin = function () { return ({
    name: 'gapCursor',
    pmPlugins: function () {
        return [
            {
                name: 'gapCursorKeymap',
                plugin: function () { return keymapPlugin(); },
            },
            {
                name: 'gapCursor',
                plugin: function () { return plugin; },
            },
        ];
    },
}); };
export default gapCursorPlugin;
//# sourceMappingURL=index.js.map
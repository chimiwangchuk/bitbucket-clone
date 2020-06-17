import { indentation } from '@atlaskit/adf-schema';
import { keymapPlugin } from './pm-plugins/keymap';
var indentationPlugin = function () { return ({
    name: 'indentation',
    marks: function () {
        return [{ name: 'indentation', mark: indentation }];
    },
    pmPlugins: function () {
        return [
            {
                name: 'indentationKeymap',
                plugin: function () { return keymapPlugin(); },
            },
        ];
    },
}); };
export default indentationPlugin;
//# sourceMappingURL=index.js.map
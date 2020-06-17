import { tableBackgroundColorPalette, tableBackgroundBorderColor, } from '@atlaskit/adf-schema';
import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';
var cellBackgroundColorPalette = [];
tableBackgroundColorPalette.forEach(function (label, color) {
    var key = label.toLowerCase().replace(' ', '-');
    var message = getColorMessage(paletteMessages, key);
    cellBackgroundColorPalette.push({
        value: color,
        label: label,
        border: tableBackgroundBorderColor,
        message: message,
    });
});
export default cellBackgroundColorPalette;
//# sourceMappingURL=cellBackgroundColorPalette.js.map
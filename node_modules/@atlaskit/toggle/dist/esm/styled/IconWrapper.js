import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { DN30, DN600 } from '@atlaskit/theme/colors';
import { getWidth, paddingUnitless } from './constants';
var iconPadding = paddingUnitless / 2 + "px";
var getPadding = function (_a) {
    var isChecked = _a.isChecked;
    return isChecked
        ? "\n    padding-left: " + iconPadding + ";\n    padding-right: 0;\n  "
        : "\n    padding-left: 0;\n    padding-right: " + iconPadding + ";\n  ";
};
// the Icon sizes are 16/24/32/48 so we have to force-scale the icons down to 20px this way
var iconSizing = function (_a) {
    var size = _a.size;
    return size === 'large' ? "> span { height: 20px; width: 20px; }" : '';
};
var getIconColor = function (_a) {
    var isChecked = _a.isChecked;
    return isChecked
        ? themed({ light: 'inherit', dark: DN30 })
        : themed({ light: 'inherit', dark: DN600 });
};
export default styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  max-width: ", "px;\n  align-items: center;\n  ", ";\n  color: ", ";\n  ", ";\n"], ["\n  display: flex;\n  max-width: ", "px;\n  align-items: center;\n  ", ";\n  color: ", ";\n  ", ";\n"])), function (props) { return getWidth(props) / 2; }, getPadding, getIconColor, iconSizing);
var templateObject_1;
//# sourceMappingURL=IconWrapper.js.map
import { __makeTemplateObject, __rest } from "tslib";
import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import { borderWidth, getHeight, getWidth, transition } from './constants';
var colorOptions = {
    bgChecked: themed({ light: colors.G400, dark: colors.G300 }),
    bgCheckedHover: themed({ light: colors.G300, dark: colors.G200 }),
    bgCheckedDisabled: themed({ light: colors.N20, dark: colors.DN70 }),
    bgUnchecked: themed({ light: colors.N200, dark: colors.DN70 }),
    bgUncheckedHover: themed({ light: colors.N70, dark: colors.DN60 }),
    bgUncheckedDisabled: themed({ light: colors.N20, dark: colors.DN70 }),
};
var getBgColor = function (_a) {
    var isChecked = _a.isChecked, isDisabled = _a.isDisabled, rest = __rest(_a, ["isChecked", "isDisabled"]);
    var color = colorOptions.bgUnchecked;
    if (isChecked)
        color = colorOptions.bgChecked;
    if (isDisabled && !isChecked)
        color = colorOptions.bgUncheckedDisabled;
    if (isDisabled && isChecked)
        color = colorOptions.bgCheckedDisabled;
    return color(rest);
};
var getHoverStyles = function (_a) {
    var isChecked = _a.isChecked, isDisabled = _a.isDisabled, rest = __rest(_a, ["isChecked", "isDisabled"]);
    var bgcolor;
    if (!isDisabled) {
        bgcolor = isChecked
            ? colorOptions.bgCheckedHover
            : colorOptions.bgUncheckedHover;
    }
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    &:hover {\n      ", ";\n      cursor: ", ";\n    }\n  "], ["\n    &:hover {\n      ",
        ";\n      cursor: ", ";\n    }\n  "])), bgcolor
        ? css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            background-color: ", ";\n          "], ["\n            background-color: ", ";\n          "])), bgcolor(rest)) : '', isDisabled ? 'not-allowed' : 'pointer');
};
var getBorderColor = function (_a) {
    var isFocused = _a.isFocused, rest = __rest(_a, ["isFocused"]);
    return isFocused
        ? themed({ light: colors.B100, dark: colors.B75 })(rest)
        : 'transparent';
};
export default styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background-clip: content-box;\n  background-color: ", ";\n  border-radius: ", "px;\n  border: ", " solid ", ";\n  display: block;\n  height: ", "px;\n  padding: ", ";\n  position: relative;\n  transition: ", ";\n  width: ", "px;\n\n  ", ";\n"], ["\n  background-clip: content-box;\n  background-color: ", ";\n  border-radius: ", "px;\n  border: ", " solid ", ";\n  display: block;\n  height: ", "px;\n  padding: ", ";\n  position: relative;\n  transition: ", ";\n  width: ", "px;\n\n  ", ";\n"])), getBgColor, getHeight, borderWidth, getBorderColor, getHeight, borderWidth, transition, getWidth, getHoverStyles);
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Slide.js.map
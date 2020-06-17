import { __makeTemplateObject } from "tslib";
import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import { itemSpacing } from '../../constants';
var getFocusColor = themed('appearance', {
    connectivity: { light: colors.B500, dark: colors.B200 },
    confirmation: { light: colors.G400, dark: colors.G400 },
    info: { light: colors.P500, dark: colors.P300 },
    warning: { light: colors.Y500, dark: colors.Y500 },
    error: { light: colors.R500, dark: colors.R500 },
});
export var Root = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n  max-width: 100%;\n  &:focus {\n    outline: 1px solid ", ";\n  }\n"], ["\n  display: inline-block;\n  max-width: 100%;\n  &:focus {\n    outline: 1px solid ", ";\n  }\n"])), getFocusColor);
export var ButtonContents = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  align-items: center;\n  display: flex;\n  text-decoration: none;\n  ", ";\n"], ["\n  align-items: center;\n  display: flex;\n  text-decoration: none;\n  ",
    ";\n"])), function (_a) {
    var isHovered = _a.isHovered;
    return isHovered && css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      color: ", ";\n      text-decoration: underline;\n    "], ["\n      color: ", ";\n      text-decoration: underline;\n    "])), colors.N600);
});
var getTitleColor = themed({ light: colors.N600, dark: colors.DN600 });
var getTextColor = themed({ light: colors.N300, dark: colors.DN100 });
export var Title = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n  font-weight: 500;\n  padding: 0 ", "px;\n"], ["\n  color: ", ";\n  font-weight: 500;\n  padding: 0 ", "px;\n"])), getTitleColor, itemSpacing);
export var Text = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: ", ";\n  padding: 0 ", "px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n"], ["\n  color: ", ";\n  padding: 0 ", "px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n"])), getTextColor, itemSpacing);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=styledInlineMessage.js.map
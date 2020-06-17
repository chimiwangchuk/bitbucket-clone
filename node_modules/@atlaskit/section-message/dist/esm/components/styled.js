import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { N500 } from '@atlaskit/theme/colors';
import { multiply } from '@atlaskit/theme/math';
import { h500 } from '@atlaskit/theme/typography';
export var Container = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  border-radius: ", "px;\n  background-color: ", ";\n  padding: ", "px;\n"], ["\n  display: flex;\n  border-radius: ", "px;\n  background-color: ", ";\n  padding: ", "px;\n"])), borderRadius, function (_a) {
    var backgroundColor = _a.backgroundColor;
    return backgroundColor;
}, multiply(gridSize, 2));
export var ContentContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  flex-grow: 1;\n"], ["\n  flex-grow: 1;\n"])));
export var Title = styled.h1(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0;\n  ", ";\n"], ["\n  margin: 0;\n  ", ";\n"])), h500);
export var Description = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  * + & {\n    margin-top: 8px;\n  }\n"], ["\n  * + & {\n    margin-top: 8px;\n  }\n"])));
export var Actions = styled.ul(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  list-style: none;\n  padding-left: 0;\n  * + & {\n    margin-top: 8px;\n  }\n"], ["\n  display: flex;\n  list-style: none;\n  padding-left: 0;\n  * + & {\n    margin-top: 8px;\n  }\n"])));
export var Action = styled.li(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  align-items: center;\n  display: flex;\n  margin: 0;\n  & + &::before {\n    color: ", ";\n    content: '\u00B7';\n    display: inline-block;\n    text-align: center;\n    vertical-align: middle;\n    width: ", "px;\n  }\n"], ["\n  align-items: center;\n  display: flex;\n  margin: 0;\n  & + &::before {\n    color: ", ";\n    content: '\u00B7';\n    display: inline-block;\n    text-align: center;\n    vertical-align: middle;\n    width: ", "px;\n  }\n"])), N500, multiply(gridSize, 2));
// If the icon is not wrapped in a div with a width, and we instead use margin or
// padding, the icon is shrunk by the padding.
// Since the icons will have a consistent size, we can treat them as pre-calculated
// space.
export var IconWrapper = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  flex: 0 0 auto;\n  width: ", "px;\n  > span {\n    margin: -2px 0;\n    vertical-align: top;\n  }\n"], ["\n  flex: 0 0 auto;\n  width: ", "px;\n  > span {\n    margin: -2px 0;\n    vertical-align: top;\n  }\n"])), multiply(gridSize, 5));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=styled.js.map
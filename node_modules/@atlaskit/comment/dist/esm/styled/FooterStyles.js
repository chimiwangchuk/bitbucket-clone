import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N500, Y500 } from '@atlaskit/theme/colors';
import { actionsPadding } from './constants';
var ThemeColor = {
    text: {
        default: N500,
        error: Y500,
    },
};
export var ActionsItem = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n\n  & + &::before {\n    color: ", ";\n    content: '\u00B7';\n    display: inline-block;\n    text-align: center;\n    vertical-align: middle;\n    width: ", "px;\n  }\n"], ["\n  display: flex;\n\n  & + &::before {\n    color: ", ";\n    content: '\u00B7';\n    display: inline-block;\n    text-align: center;\n    vertical-align: middle;\n    width: ", "px;\n  }\n"])), ThemeColor.text.default, actionsPadding);
export var ErrorIcon = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  padding-right: ", "px;\n"], ["\n  color: ", ";\n  padding-right: ", "px;\n"])), ThemeColor.text.error, gridSize());
export var ActionsContainer = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  align-items: center;\n  display: flex;\n  flex-wrap: wrap;\n  margin-top: ", "px;\n"], ["\n  align-items: center;\n  display: flex;\n  flex-wrap: wrap;\n  margin-top: ", "px;\n"])), gridSize() * 0.75);
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=FooterStyles.js.map
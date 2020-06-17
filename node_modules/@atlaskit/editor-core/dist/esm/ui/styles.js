import { __makeTemplateObject } from "tslib";
import styled, { css } from 'styled-components';
import { colors, gridSize, borderRadius } from '@atlaskit/theme';
var akGridSize = gridSize() + 'px';
export var ButtonGroup = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-flex;\n  align-items: center;\n\n  & > div {\n    display: flex;\n  }\n"], ["\n  display: inline-flex;\n  align-items: center;\n\n  & > div {\n    display: flex;\n  }\n"])));
export var Separator = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background: ", ";\n  width: 1px;\n  height: 24px;\n  display: inline-block;\n  margin: 0 8px;\n"], ["\n  background: ", ";\n  width: 1px;\n  height: 24px;\n  display: inline-block;\n  margin: 0 8px;\n"])), colors.N30);
export var Wrapper = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n\n  > div,\n  > span {\n    display: flex;\n  }\n\n  > div > div {\n    display: flex;\n  }\n  margin-left: ", "px;\n  min-width: ", ";\n"], ["\n  display: flex;\n  align-items: center;\n\n  > div,\n  > span {\n    display: flex;\n  }\n\n  > div > div {\n    display: flex;\n  }\n  margin-left: ", "px;\n  min-width: ",
    ";\n"])), function (_a) {
    var isSmall = _a.isSmall;
    return (isSmall ? 4 : 0);
}, function (_a) {
    var isSmall = _a.isSmall;
    return isSmall ? '40px' : 'auto';
});
export var ExpandIconWrapper = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-left: -8px;\n"], ["\n  margin-left: -8px;\n"])));
export var TriggerWrapper = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
export var MenuWrapper = Wrapper;
export var ButtonContent = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  min-width: 80px;\n  height: 24px;\n  line-height: 24px;\n  align-items: center;\n  padding: ", ";\n  flex-direction: column;\n"], ["\n  display: flex;\n  min-width: 80px;\n  height: 24px;\n  line-height: 24px;\n  align-items: center;\n  padding: ", ";\n  flex-direction: column;\n"])), function (props) { return (props.width ? 0 : '0 8px'); });
// Taken from the style of inline dialog components
export var dropShadow = css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  box-shadow: 0 0 1px rgba(9, 30, 66, 0.31),\n    0 4px 8px -2px rgba(9, 30, 66, 0.25);\n"], ["\n  box-shadow: 0 0 1px rgba(9, 30, 66, 0.31),\n    0 4px 8px -2px rgba(9, 30, 66, 0.25);\n"])));
export var scrollbarStyles = "\n  -ms-overflow-style: -ms-autohiding-scrollbar;\n\n  &::-webkit-scrollbar {\n    height: " + akGridSize + ";\n    width: " + akGridSize + ";\n  }\n\n  &::-webkit-scrollbar-corner {\n    display: none;\n  }\n\n  &::-webkit-scrollbar-thumb {\n    background-color: rgba(0, 0, 0, 0);\n  }\n\n  &:hover::-webkit-scrollbar-thumb {\n    background-color: rgba(0, 0, 0, 0.2);\n    border-radius: " + akGridSize + ";\n  }\n\n  &::-webkit-scrollbar-thumb:hover {\n    background-color: rgba(0, 0, 0, 0.4);\n  }\n";
export var Shortcut = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  background-color: rgba(223, 225, 229, 0.5); /* N60 at 50% */\n  color: ", ";\n  border-radius: ", "px;\n  padding: 4px;\n  line-height: 12px;\n  font-size: 11.67px;\n  align-self: flex-end;\n"], ["\n  background-color: rgba(223, 225, 229, 0.5); /* N60 at 50% */\n  color: ", ";\n  border-radius: ", "px;\n  padding: 4px;\n  line-height: 12px;\n  font-size: 11.67px;\n  align-self: flex-end;\n"])), colors.N100, borderRadius());
export var ClickSelectWrapper = styled.span(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  user-select: all;\n"], ["\n  user-select: all;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=styles.js.map
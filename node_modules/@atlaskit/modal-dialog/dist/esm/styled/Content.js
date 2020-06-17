import { __makeTemplateObject } from "tslib";
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import { N30, DN30, R400, Y400 } from '@atlaskit/theme/colors';
import { divide } from '@atlaskit/theme/math';
import { flexMaxHeightIEFix } from '../utils/flex-max-height-ie-fix';
// Constants
// ==============================
var modalPadding = gridSize() * 3;
var keylineColor = themed({ light: N30, dark: DN30 });
export var keylineHeight = 2;
// Wrapper
// ==============================
export var wrapperStyles = css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  ", ";\n"], ["\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  ", ";\n"])), flexMaxHeightIEFix);
export var Header = styled.header(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  align-items: center;\n  display: flex;\n  flex: 0 0 auto;\n  justify-content: space-between;\n  transition: box-shadow 200ms;\n  z-index: 1;\n  padding: ", "px ", "px ", "px\n    ", "px;\n  box-shadow: ", ";\n"], ["\n  align-items: center;\n  display: flex;\n  flex: 0 0 auto;\n  justify-content: space-between;\n  transition: box-shadow 200ms;\n  z-index: 1;\n  padding: ", "px ", "px ", "px\n    ", "px;\n  box-shadow: ",
    ";\n"])), modalPadding, modalPadding, modalPadding - keylineHeight, modalPadding, function (props) {
    return props.showKeyline
        ? "0 " + keylineHeight + "px 0 0 " + keylineColor(props)
        : 'none';
});
export var Title = styled.h4(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  align-items: center;\n  display: flex;\n  font-size: 20px;\n  font-style: inherit;\n  font-weight: 500;\n  letter-spacing: -0.008em;\n  line-height: 1;\n  margin: 0;\n  min-width: 0;\n"], ["\n  align-items: center;\n  display: flex;\n  font-size: 20px;\n  font-style: inherit;\n  font-weight: 500;\n  letter-spacing: -0.008em;\n  line-height: 1;\n  margin: 0;\n  min-width: 0;\n"])));
export var TitleText = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  flex: 1 1 auto;\n  min-width: 0;\n  word-wrap: break-word;\n  width: 100%;\n  ", ";\n"], ["\n  flex: 1 1 auto;\n  min-width: 0;\n  word-wrap: break-word;\n  width: 100%;\n  ",
    ";\n"])), function (props) {
    return !props.isHeadingMultiline &&
        "\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    ";
});
var iconColor = {
    danger: R400,
    warning: Y400,
};
export var titleIconWrapperStyles = function (appearance) { return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: ", ";\n  margin-right: ", "px;\n  flex: 0 0 auto;\n"], ["\n  color: ", ";\n  margin-right: ", "px;\n  flex: 0 0 auto;\n"])), iconColor[appearance], gridSize()); };
// Body
// ==============================
/**
  Adding the padding here avoids cropping box shadow on first/last
  children. The combined vertical spacing is maintained by subtracting the
  keyline height from header and footer.
*/
export var bodyStyles = function (shouldScroll) { return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  flex: 1 1 auto;\n  ", "\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    overflow-y: auto;\n    height: 100%;\n  }\n"], ["\n  flex: 1 1 auto;\n  ",
    "\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    overflow-y: auto;\n    height: 100%;\n  }\n"])), shouldScroll
    ? "\n        overflow-y: auto;\n        overflow-x: hidden;\n        padding: " + keylineHeight + "px " + modalPadding + "px;\n      "
    : "\n        padding: 0 " + modalPadding + "px;\n      "); };
export var Body = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), function (props) { return bodyStyles(props.shouldScroll); });
export var Footer = styled.footer(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  align-items: center;\n  display: flex;\n  flex: 0 0 auto;\n  justify-content: space-between;\n  transition: box-shadow 200ms;\n  z-index: 1;\n  padding: ", "px ", "px ", "px\n    ", "px;\n  box-shadow: ", ";\n"], ["\n  align-items: center;\n  display: flex;\n  flex: 0 0 auto;\n  justify-content: space-between;\n  transition: box-shadow 200ms;\n  z-index: 1;\n  padding: ", "px ", "px ", "px\n    ", "px;\n  box-shadow: ",
    ";\n"])), modalPadding - keylineHeight, modalPadding, modalPadding, modalPadding, function (props) {
    return props.showKeyline
        ? "0 -" + keylineHeight + "px 0 0 " + keylineColor(props)
        : 'none';
});
export var Actions = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  display: inline-flex;\n  margin: 0 -", "px;\n"], ["\n  display: inline-flex;\n  margin: 0 -", "px;\n"])), divide(gridSize, 2));
export var ActionItem = styled.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  flex: 1 0 auto;\n  margin: 0 ", "px;\n"], ["\n  flex: 1 0 auto;\n  margin: 0 ", "px;\n"])), divide(gridSize, 2));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=Content.js.map
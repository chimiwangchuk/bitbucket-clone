import { __makeTemplateObject } from "tslib";
import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { multiply, divide } from '@atlaskit/theme/math';
var TRANSITION_DURATION = '0.25s ease-in-out';
/* Container */
export var getMaxHeight = function (_a) {
    var appearance = _a.appearance;
    return appearance === 'announcement' ? '88px' : '52px';
};
export var backgroundColor = themed('appearance', {
    error: { light: colors.R400, dark: colors.R300 },
    warning: { light: colors.Y300, dark: colors.Y300 },
    announcement: { light: colors.N500, dark: colors.N500 },
});
export var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  max-height: ", ";\n  overflow: ", ";\n  background-color: ", ";\n"], ["\n  max-height: ", ";\n  overflow: ",
    ";\n  background-color: ", ";\n"])), getMaxHeight, function (_a) {
    var appearance = _a.appearance;
    return appearance === 'announcement' ? 'scroll' : 'visible';
}, backgroundColor);
export var testErrorBackgroundColor = colors.R400;
export var testErrorTextColor = colors.N0;
export var textColor = themed('appearance', {
    error: { light: colors.N0, dark: colors.DN40 },
    warning: { light: colors.N700, dark: colors.DN40 },
    announcement: { light: colors.N0, dark: colors.N0 },
});
export var Content = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  align-items: center;\n  background-color: ", ";\n  color: ", ";\n  display: flex;\n  fill: ", ";\n  font-weight: 500;\n  justify-content: center;\n  padding: ", "px;\n  text-align: center;\n  ", "\n\n  margin: auto;\n  ", " transition: color ", ";\n\n  a,\n  a:visited,\n  a:hover,\n  a:active,\n  a:focus {\n    color: ", ";\n    text-decoration: underline;\n  }\n"], ["\n  align-items: center;\n  background-color: ", ";\n  color: ", ";\n  display: flex;\n  fill: ", ";\n  font-weight: 500;\n  justify-content: center;\n  padding: ", "px;\n  text-align: center;\n  ", /* transition: color ${TRANSITION_DURATION}; */ "\n\n  margin: auto;\n  ",
    " transition: color ", ";\n\n  a,\n  a:visited,\n  a:hover,\n  a:active,\n  a:focus {\n    color: ", ";\n    text-decoration: underline;\n  }\n"])), backgroundColor, textColor, backgroundColor, multiply(gridSize, 1.5), '' /* transition: color ${TRANSITION_DURATION}; */, function (_a) {
    var appearance = _a.appearance;
    return appearance === 'announcement'
        ? 'max-width: 876px;'
        : '';
}, TRANSITION_DURATION, textColor);
export var Icon = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex: 0 0 auto;\n"], ["\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex: 0 0 auto;\n"])));
var textOverflow = function (_a) {
    var appearance = _a.appearance;
    return appearance === 'announcement'
        ? ''
        : css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n        text-overflow: ellipsis;\n        white-space: nowrap;\n      "], ["\n        text-overflow: ellipsis;\n        white-space: nowrap;\n      "])));
};
export var Visibility = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  max-height: ", "px;\n  overflow: hidden;\n  transition: max-height ", ";\n"], ["\n  max-height: ",
    "px;\n  overflow: hidden;\n  transition: max-height ", ";\n"])), function (props) {
    return props.isOpen ? props.bannerHeight : 0;
}, TRANSITION_DURATION);
export var Text = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  flex: 0 1 auto;\n  padding: ", "px;\n  ", ";\n  overflow: hidden;\n"], ["\n  flex: 0 1 auto;\n  padding: ", "px;\n  ", ";\n  overflow: hidden;\n"])), divide(gridSize, 2), textOverflow);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=styled.js.map
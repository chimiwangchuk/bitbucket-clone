import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { themed, withTheme } from '@atlaskit/theme/components';
import { N40, DN70, B200, N500, DN400 } from '@atlaskit/theme/colors';
import { getBorderRadius, getInnerStyles, BORDER_WIDTH, } from '@atlaskit/avatar';
var EXCESS_INDICATOR_FONT_SIZE = {
    xsmall: 10,
    small: 10,
    medium: 11,
    large: 12,
    xlarge: 16,
    xxlarge: 16,
};
export var Outer = withTheme(styled.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", " background: 0;\n"], ["\n  ", " background: 0;\n"])), getInnerStyles));
export var Inner = withTheme(styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background-color: ", ";\n  border-radius: ", ";\n  align-items: center;\n  box-shadow: 0 0 0\n    ", "\n    ", ";\n  color: ", ";\n  cursor: pointer;\n  display: flex;\n  flex-basis: 100%;\n  flex-grow: 1;\n  font-size: ", "px;\n  justify-content: center;\n  transition: box-shadow 200ms;\n"], ["\n  background-color: ", ";\n  border-radius: ", ";\n  align-items: center;\n  box-shadow: 0 0 0\n    ",
    "\n    ", ";\n  color: ", ";\n  cursor: pointer;\n  display: flex;\n  flex-basis: 100%;\n  flex-grow: 1;\n  font-size: ", "px;\n  justify-content: center;\n  transition: box-shadow 200ms;\n"])), themed({ light: N40, dark: DN70 }), getBorderRadius, function (props) {
    return props.isFocus && !props.isActive ? BORDER_WIDTH[props.size] + "px" : 0;
}, B200, themed({ light: N500, dark: DN400 }), function (props) { return EXCESS_INDICATOR_FONT_SIZE[props.size || 'medium']; }));
var templateObject_1, templateObject_2;
//# sourceMappingURL=MoreIndicator.js.map
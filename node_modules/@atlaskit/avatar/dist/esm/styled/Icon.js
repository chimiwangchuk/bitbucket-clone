import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { withTheme } from '@atlaskit/theme/components';
import { background } from '@atlaskit/theme/colors';
import { BORDER_WIDTH } from './constants';
export var Outer = withTheme(styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  align-content: center;\n  align-items: center;\n  background-color: ", ";\n  border-radius: 50%;\n  box-sizing: border-box;\n  display: flex;\n  height: 100%;\n  overflow: hidden;\n  padding: ", "px;\n  width: 100%;\n"], ["\n  align-content: center;\n  align-items: center;\n  background-color: ", ";\n  border-radius: 50%;\n  box-sizing: border-box;\n  display: flex;\n  height: 100%;\n  overflow: hidden;\n  padding: ",
    "px;\n  width: 100%;\n"])), function (props) { return props.bgColor || background; }, function (_a) {
    var size = _a.size;
    return (size && BORDER_WIDTH[size]) || BORDER_WIDTH.medium;
}));
export var Inner = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  align-items: center;\n  border-radius: 50%;\n  display: flex;\n  height: 100%;\n  overflow: hidden;\n  width: 100%;\n"], ["\n  align-items: center;\n  border-radius: 50%;\n  display: flex;\n  height: 100%;\n  overflow: hidden;\n  width: 100%;\n"])));
var templateObject_1, templateObject_2;
//# sourceMappingURL=Icon.js.map
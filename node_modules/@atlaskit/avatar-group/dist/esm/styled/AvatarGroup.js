import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { backgroundOnLayer, backgroundHover, backgroundActive, } from '@atlaskit/theme/colors';
import { BORDER_WIDTH } from '@atlaskit/avatar';
var gutterUnitless = gridSize() / 2;
var gutter = gutterUnitless + "px";
export var Grid = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  line-height: 1;\n  margin-left: -", ";\n  margin-right: -", ";\n\n  > * {\n    margin-bottom: ", ";\n    padding-left: ", ";\n    padding-right: ", ";\n  }\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  line-height: 1;\n  margin-left: -", ";\n  margin-right: -", ";\n\n  > * {\n    margin-bottom: ", ";\n    padding-left: ", ";\n    padding-right: ", ";\n  }\n"])), gutter, gutter, gridSize, gutter, gutter);
export var Stack = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  line-height: 1;\n  /* Balance the negative margin of the children */\n  margin-right: ", "px;\n\n  > * {\n    margin-right: -", "px;\n  }\n"], ["\n  display: flex;\n  line-height: 1;\n  /* Balance the negative margin of the children */\n  margin-right: ", "px;\n\n  > * {\n    margin-right: -", "px;\n  }\n"])), function (props) { return BORDER_WIDTH[props.size] * 2 + gutterUnitless; }, function (props) { return BORDER_WIDTH[props.size] * 2 + gutterUnitless; });
export function getBackgroundColor(_a) {
    var isActive = _a.isActive, isHover = _a.isHover;
    var themedBackgroundColor = backgroundOnLayer;
    if (isHover) {
        themedBackgroundColor = backgroundHover;
    }
    if (isActive) {
        themedBackgroundColor = backgroundActive;
    }
    return themedBackgroundColor;
}
var templateObject_1, templateObject_2;
//# sourceMappingURL=AvatarGroup.js.map
import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { defaultGridColumnWidth, spacing } from './vars';
var getMargin = function (props) {
    return props.theme.isNestedGrid ? "-" + spacing[props.theme.spacing] + "px" : 'auto';
};
var getMaxWidth = function (props) {
    return props.layout === 'fixed'
        ? defaultGridColumnWidth * props.theme.columns + "px"
        : '100%';
};
var getPadding = function (props) { return spacing[props.theme.spacing] / 2 + "px"; };
var Grid = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  align-items: flex-start;\n  display: flex;\n  flex-wrap: wrap;\n  margin: 0 ", ";\n  max-width: ", ";\n  padding: 0 ", ";\n  position: relative;\n"], ["\n  align-items: flex-start;\n  display: flex;\n  flex-wrap: wrap;\n  margin: 0 ", ";\n  max-width: ", ";\n  padding: 0 ", ";\n  position: relative;\n"])), getMargin, getMaxWidth, getPadding);
export default Grid;
export { getMargin, getMaxWidth, getPadding };
var templateObject_1;
//# sourceMappingURL=GridElement.js.map
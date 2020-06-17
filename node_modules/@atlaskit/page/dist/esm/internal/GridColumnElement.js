import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { spacing } from './vars';
var getColumnRatio = function (props) {
    if (props.medium === props.theme.columns) {
        return '100%';
    }
    return "99.9999% / " + props.theme.columns + " * " + props.medium;
};
var getColumnWidth = function (props) {
    return props.medium > 0
        ? "calc(" + getColumnRatio(props) + " - " + spacing[props.theme.spacing] + "px)"
        : 'auto';
};
var availableColumns = function (props) { return props.theme.columns; };
var specifiedColumns = function (props) {
    return props.medium ? props.medium : availableColumns(props);
};
var columns = function (props) {
    return Math.min(availableColumns(props), specifiedColumns(props));
};
var gridSpacing = function (props) { return spacing[props.theme.spacing]; };
var getMaxWidthColumnRatio = function (props) {
    if (columns(props) >= availableColumns(props)) {
        return '100%';
    }
    return "99.9999% / " + availableColumns(props) + " * " + columns(props);
};
// Unable to use the flexbox shorthand rules because Styled Components doesn't
// handle them correctly for IE11.
// Also IE11 and Edge both have rounding issues for flexbox which is why a width of
// 99.9999% is used. Using 100% here causes columns to wrap prematurely.
var GridColumn = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  flex-grow: 1;\n  flex-shrink: 0;\n  flex-basis: ", ";\n  margin: 0 ", "px;\n  max-width: calc(", " - ", "px);\n  min-width: calc(99.9999% / ", " - ", "px);\n  word-wrap: break-word;\n"], ["\n  flex-grow: 1;\n  flex-shrink: 0;\n  flex-basis: ", ";\n  margin: 0 ", "px;\n  max-width: calc(", " - ", "px);\n  min-width: calc(99.9999% / ", " - ", "px);\n  word-wrap: break-word;\n"])), getColumnWidth, function (props) { return spacing[props.theme.spacing] / 2; }, getMaxWidthColumnRatio, gridSpacing, availableColumns, gridSpacing);
export default GridColumn;
export { getColumnWidth };
var templateObject_1;
//# sourceMappingURL=GridColumnElement.js.map
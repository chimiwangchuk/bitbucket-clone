import { __makeTemplateObject } from "tslib";
import styled, { css } from 'styled-components';
import { N500 } from '@atlaskit/theme/colors';
var ThemeColor = {
    text: N500,
};
var common = function (_a) {
    var hasAuthor = _a.hasAuthor;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  &:not(:hover):not(:active) {\n    color: ", ";\n  }\n  font-weight: ", ";\n"], ["\n  &:not(:hover):not(:active) {\n    color: ", ";\n  }\n  font-weight: ", ";\n"])), ThemeColor.text, hasAuthor ? 500 : 'inherit');
};
export var Anchor = styled.a(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ", ";\n"])), function (p) { return common(p); });
export var Span = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ", ";\n"])), function (p) { return common(p); });
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=FieldStyles.js.map
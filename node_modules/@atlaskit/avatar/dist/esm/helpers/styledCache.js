import { __makeTemplateObject } from "tslib";
import { withTheme } from '@atlaskit/theme/components';
import styled from 'styled-components';
import CustomComponentProxy from '../components/CustomComponentProxy';
// This is necessary because we don't know what DOM element the custom component will render.
export default (function (styles) {
    var StyledCustomComponent = withTheme(styled(CustomComponentProxy)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      &,\n      &:hover,\n      &:active,\n      &:focus {\n        ", "\n      }\n    "], ["\n      &,\n      &:hover,\n      &:active,\n      &:focus {\n        ", "\n      }\n    "])), styles));
    var StyledButton = withTheme(styled.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    ", ";\n  "], ["\n    ", ";\n  "])), styles));
    var StyledLink = withTheme(styled.a(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    a& {\n      ", ";\n    }\n  "], ["\n    a& {\n      ", ";\n    }\n  "])), styles));
    var StyledSpan = withTheme(styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    ", ";\n  "], ["\n    ", ";\n  "])), styles));
    return function getStyled(_a) {
        var component = _a.component, href = _a.href, onClick = _a.onClick;
        var Ret = StyledSpan;
        if (component) {
            Ret = StyledCustomComponent;
        }
        else if (href) {
            Ret = StyledLink;
        }
        else if (onClick) {
            Ret = StyledButton;
        }
        return Ret;
    };
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=styledCache.js.map
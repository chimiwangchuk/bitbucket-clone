import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N100A } from '@atlaskit/theme/colors';
var ThemeColor = {
    Restricted: {
        text: N100A,
    },
};
export var BulletSpacer = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding-right: ", "px;\n"], ["\n  padding-right: ", "px;\n"])), gridSize() / 2);
export var Restricted = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  display: flex;\n"], ["\n  color: ", ";\n  display: flex;\n"])), ThemeColor.Restricted.text);
export var RestrictedIconWrapper = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-right: ", "px;\n"], ["\n  margin-right: ", "px;\n"])), gridSize() / 2);
RestrictedIconWrapper.displayName = 'RestrictedIconWrapper';
export var TopItem = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: inline-block;\n  margin-left: ", "px;\n\n  [dir='rtl'] & {\n    margin-left: 0;\n    margin-right: ", "px;\n  }\n\n  &:first-child {\n    margin-left: 0;\n\n    [dir='rtl'] & {\n      margin-right: 0;\n    }\n  }\n"], ["\n  display: inline-block;\n  margin-left: ", "px;\n\n  [dir='rtl'] & {\n    margin-left: 0;\n    margin-right: ", "px;\n  }\n\n  &:first-child {\n    margin-left: 0;\n\n    [dir='rtl'] & {\n      margin-right: 0;\n    }\n  }\n"])), gridSize(), gridSize());
export var TopItemsContainer = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=HeaderStyles.js.map
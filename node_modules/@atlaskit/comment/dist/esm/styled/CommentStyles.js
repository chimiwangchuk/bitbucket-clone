import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N800, N100A } from '@atlaskit/theme/colors';
var ThemeColor = {
    text: {
        default: N800,
        disabled: N100A,
    },
};
export var Content = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n  margin-top: ", "px;\n"], ["\n  color: ",
    ";\n  margin-top: ", "px;\n"])), function (p) {
    return p.isDisabled ? ThemeColor.text.disabled : ThemeColor.text.default;
}, gridSize() / 2);
var templateObject_1;
//# sourceMappingURL=CommentStyles.js.map
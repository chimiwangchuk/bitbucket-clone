import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';
import { errorIconColor, errorTitleColor, errorTextColor, } from '../styled/constants';
export var ErrorWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  text-align: center;\n  padding: ", "px;\n  color: ", ";\n"], ["\n  text-align: center;\n  padding: ", "px;\n  color: ", ";\n"])), math.multiply(gridSize, 3), errorIconColor);
export var ErrorTitle = styled.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  line-height: ", "px;\n  margin: ", "px 0;\n"], ["\n  color: ", ";\n  line-height: ", "px;\n  margin: ", "px 0;\n"])), errorTitleColor, math.multiply(gridSize, 3), gridSize);
export var ErrorText = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), errorTextColor);
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Error.js.map
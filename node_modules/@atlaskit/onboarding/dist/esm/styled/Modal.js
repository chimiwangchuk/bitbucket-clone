import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { divide } from '@atlaskit/theme/math';
export var Body = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 40px 20px;\n  text-align: center;\n"], ["\n  padding: 40px 20px;\n  text-align: center;\n"])));
export var Heading = styled.h4(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: inherit;\n  font-size: 20px;\n  font-style: inherit;\n  font-weight: 500;\n  letter-spacing: -0.008em;\n  line-height: 1.2;\n  margin-bottom: ", "px;\n"], ["\n  color: inherit;\n  font-size: 20px;\n  font-style: inherit;\n  font-weight: 500;\n  letter-spacing: -0.008em;\n  line-height: 1.2;\n  margin-bottom: ", "px;\n"])), gridSize);
export var Image = styled.img(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  border-top-left-radius: ", "px;\n  border-top-right-radius: ", "px;\n  height: auto;\n  width: 100%;\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    border-radius: 0;\n  }\n"], ["\n  border-top-left-radius: ", "px;\n  border-top-right-radius: ", "px;\n  height: auto;\n  width: 100%;\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    border-radius: 0;\n  }\n"])), borderRadius, borderRadius);
export var Actions = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  justify-content: center;\n  padding: 0 40px 40px;\n"], ["\n  display: flex;\n  justify-content: center;\n  padding: 0 40px 40px;\n"])));
export var ActionItem = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin: 0 ", "px;\n"], ["\n  margin: 0 ", "px;\n"])), divide(gridSize, 2));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Modal.js.map
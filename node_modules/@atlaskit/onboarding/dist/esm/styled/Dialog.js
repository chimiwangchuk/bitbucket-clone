import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply, divide } from '@atlaskit/theme/math';
export var FillScreen = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 100%;\n  left: 0;\n  overflow-y: auto;\n  position: absolute;\n  top: ", "px;\n  width: 100%;\n"], ["\n  height: 100%;\n  left: 0;\n  overflow-y: auto;\n  position: absolute;\n  top: ", "px;\n  width: 100%;\n"])), function (p) { return p.scrollDistance; });
export var DialogBody = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  flex: 1 1 auto;\n  padding: ", "px ", "px ", "px;\n\n  p:last-child,\n  ul:last-child,\n  ol:last-child {\n    margin-bottom: 0;\n  }\n"], ["\n  flex: 1 1 auto;\n  padding: ", "px ", "px ", "px;\n\n  p:last-child,\n  ul:last-child,\n  ol:last-child {\n    margin-bottom: 0;\n  }\n"])), multiply(gridSize, 2), multiply(gridSize, 3), gridSize);
// internal elements
export var Heading = styled.h4(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: inherit;\n  font-size: 20px;\n  font-style: inherit;\n  font-weight: 500;\n  letter-spacing: -0.008em;\n  line-height: 1.2;\n  margin-bottom: ", "px;\n"], ["\n  color: inherit;\n  font-size: 20px;\n  font-style: inherit;\n  font-weight: 500;\n  letter-spacing: -0.008em;\n  line-height: 1.2;\n  margin-bottom: ", "px;\n"])), gridSize);
export var Image = styled.img(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  height: auto;\n  max-width: 100%;\n"], ["\n  height: auto;\n  max-width: 100%;\n"])));
// actions
export var Actions = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  padding: 0 ", "px ", "px;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  padding: 0 ", "px ", "px;\n"])), multiply(gridSize, 3), multiply(gridSize, 2));
export var ActionItems = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  margin: 0 -", "px;\n"], ["\n  display: flex;\n  margin: 0 -", "px;\n"])), divide(gridSize, 2));
export var ActionItem = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin: 0 ", "px;\n"], ["\n  margin: 0 ", "px;\n"])), divide(gridSize, 2));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=Dialog.js.map
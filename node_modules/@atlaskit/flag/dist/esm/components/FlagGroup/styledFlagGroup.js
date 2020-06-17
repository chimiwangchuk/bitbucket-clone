import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { gridSize, layers } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
export default styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  bottom: ", "px;\n  left: ", "px;\n  position: fixed;\n  z-index: ", ";\n\n  @media (max-width: 560px) {\n    bottom: 0;\n    left: 0;\n  }\n"], ["\n  bottom: ", "px;\n  left: ", "px;\n  position: fixed;\n  z-index: ", ";\n\n  @media (max-width: 560px) {\n    bottom: 0;\n    left: 0;\n  }\n"])), multiply(gridSize, 6), multiply(gridSize, 10), layers.flag);
export var SROnly = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border: 0;\n  clip: rect(1px, 1px, 1px, 1px);\n  height: 1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n"], ["\n  border: 0;\n  clip: rect(1px, 1px, 1px, 1px);\n  height: 1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n"])));
export var Inner = styled(TransitionGroup)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=styledFlagGroup.js.map
import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { layers } from '@atlaskit/theme/constants';
import { N100A, DN90A } from '@atlaskit/theme/colors';
var backgroundColor = themed({ light: N100A, dark: DN90A });
export var opacity = function (p) { return (p.isTinted ? 1 : 0); };
export var pointerEvents = function (p) {
    return p.canClickThrough ? 'none' : 'initial';
};
export default styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: ", ";\n  bottom: 0;\n  left: 0;\n  opacity: ", ";\n  pointer-events: ", ";\n  position: fixed;\n  right: 0;\n  top: 0;\n  transition: opacity 220ms;\n  z-index: ", ";\n"], ["\n  background: ", ";\n  bottom: 0;\n  left: 0;\n  opacity: ", ";\n  pointer-events: ", ";\n  position: fixed;\n  right: 0;\n  top: 0;\n  transition: opacity 220ms;\n  z-index: ", ";\n"])), backgroundColor, opacity, pointerEvents, layers.blanket);
var templateObject_1;
//# sourceMappingURL=styled.js.map
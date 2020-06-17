import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { layers } from '@atlaskit/theme/constants';
import { N100A, DN90A } from '@atlaskit/theme/colors';
// NOTE:
// we can't use @atlaskit/blanket
// because it has to sit on top of other layered elements (i.e. Modal).
var backgroundColor = themed({ light: N100A, dark: DN90A });
// IE11 and Edge: z-index needed because fixed position calculates z-index relative
// to body instead of nearest stacking context (Portal in our case).
export default styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: ", ";\n  bottom: 0;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transition: opacity 220ms;\n  z-index: ", ";\n"], ["\n  background: ", ";\n  bottom: 0;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transition: opacity 220ms;\n  z-index: ", ";\n"])), function (p) { return (p.isTinted ? backgroundColor : 'transparent'); }, layers.spotlight);
var templateObject_1;
//# sourceMappingURL=Blanket.js.map
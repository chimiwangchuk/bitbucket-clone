import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, gridSize, layers } from '@atlaskit/theme/constants';
import { N0, DN50, N900, DN600 } from '@atlaskit/theme/colors';
import { multiply } from '@atlaskit/theme/math';
import { e200 } from '@atlaskit/theme/elevation';
var backgroundColor = themed({ light: N0, dark: DN50 });
var textColor = themed({ light: N900, dark: DN600 });
// eslint-disable-next-line import/prefer-default-export
export var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: ", ";\n  border-radius: ", "px;\n  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */\n  color: ", ";\n  max-height: ", "px;\n  max-width: ", "px;\n  padding: ", "px ", "px;\n  z-index: ", ";\n\n  ", ";\n\n  &:focus {\n    outline: none;\n  }\n"], ["\n  background: ", ";\n  border-radius: ", "px;\n  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */\n  color: ", ";\n  max-height: ", "px;\n  max-width: ", "px;\n  padding: ", "px ", "px;\n  z-index: ", ";\n\n  ", ";\n\n  &:focus {\n    outline: none;\n  }\n"])), backgroundColor, borderRadius, textColor, multiply(gridSize, 56), multiply(gridSize, 56), multiply(gridSize, 2), multiply(gridSize, 3), layers.dialog, e200);
var templateObject_1;
//# sourceMappingURL=styled.js.map
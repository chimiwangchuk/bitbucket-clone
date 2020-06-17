import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { N0, DN600, N70, DN30 } from '@atlaskit/theme/colors';
import { transition } from './constants';
var color = themed({ light: N0, dark: DN600 });
var disabledColor = themed({ light: N70, dark: DN30 });
var getFlexDirection = function (_a) {
    var isChecked = _a.isChecked;
    return isChecked ? 'row' : 'row-reverse';
};
export default styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n  display: flex;\n  flex-direction: ", ";\n  height: 100%;\n  transition: ", ";\n  width: 100%;\n"], ["\n  color: ", ";\n  display: flex;\n  flex-direction: ", ";\n  height: 100%;\n  transition: ", ";\n  width: 100%;\n"])), function (_a) {
    var isDisabled = _a.isDisabled;
    return (isDisabled ? disabledColor : color);
}, getFlexDirection, transition);
var templateObject_1;
//# sourceMappingURL=Inner.js.map
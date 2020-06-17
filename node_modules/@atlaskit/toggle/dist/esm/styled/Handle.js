import { __makeTemplateObject, __rest } from "tslib";
import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { N0, DN600, DN0 } from '@atlaskit/theme/colors';
import { getHeight, paddingUnitless, transition } from './constants';
var backgroundColor = themed({ light: N0, dark: DN600 });
var backgroundColorChecked = themed({ light: N0, dark: DN0 });
var backgroundColorDisabled = themed({ light: N0, dark: DN0 });
var getTransform = function (_a) {
    var isChecked = _a.isChecked, size = _a.size;
    return isChecked ? "translateX(" + getHeight({ size: size }) + "px)" : 'initial';
};
var getBackgroundColor = function (_a) {
    var isChecked = _a.isChecked, isDisabled = _a.isDisabled, rest = __rest(_a, ["isChecked", "isDisabled"]);
    if (isDisabled)
        return backgroundColorDisabled(rest);
    if (isChecked)
        return backgroundColorChecked(rest);
    return backgroundColor(rest);
};
export default styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: ", ";\n  border-radius: 50%;\n  bottom: ", "px;\n  content: '';\n  height: ", "px;\n  left: ", "px;\n  position: absolute;\n  transform: ", ";\n  transition: ", ";\n  width: ", "px;\n"], ["\n  background-color: ", ";\n  border-radius: 50%;\n  bottom: ", "px;\n  content: '';\n  height: ", "px;\n  left: ", "px;\n  position: absolute;\n  transform: ", ";\n  transition: ", ";\n  width: ", "px;\n"])), getBackgroundColor, 2 * paddingUnitless, function (props) { return getHeight(props) - paddingUnitless * 2; }, 2 * paddingUnitless, getTransform, transition, function (props) { return getHeight(props) - paddingUnitless * 2; });
var templateObject_1;
//# sourceMappingURL=Handle.js.map
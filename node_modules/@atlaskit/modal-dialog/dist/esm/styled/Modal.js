import { __makeTemplateObject } from "tslib";
import styled from '@emotion/styled';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, layers } from '@atlaskit/theme/constants';
import { N30A, N60A, N0, DN50, text } from '@atlaskit/theme/colors';
import { WIDTH_ENUM, gutter } from '../shared-variables';
import { flexMaxHeightIEFix, IEMaxHeightCalcPx, } from '../utils/flex-max-height-ie-fix';
var boxShadow = function (_a) {
    var isChromeless = _a.isChromeless;
    return isChromeless
        ? 'none'
        : "\n      0 0 0 1px " + N30A + ", 0 2px 1px " + N30A + ",\n      0 0 20px -6px " + N60A + "\n    ";
};
var dialogBgColor = function (_a) {
    var isChromeless = _a.isChromeless;
    return isChromeless ? 'transparent' : themed({ light: N0, dark: DN50 })();
};
var maxDimensions = "calc(100% - " + gutter * 2 + "px)";
var maxHeightDimensions = "calc(100% - " + (gutter * 2 - IEMaxHeightCalcPx) + "px)";
export var dialogWidth = function (_a) {
    var widthName = _a.widthName, widthValue = _a.widthValue;
    if (typeof widthValue === 'number') {
        return widthValue + "px";
    }
    return widthName ? WIDTH_ENUM.widths[widthName] + "px" : widthValue || 'auto';
};
export var dialogHeight = function (_a) {
    var heightValue = _a.heightValue;
    if (typeof heightValue === 'number') {
        return heightValue + "px";
    }
    return heightValue || 'auto';
};
export var FillScreen = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 100vh;\n  left: 0;\n  overflow-y: auto;\n  position: absolute;\n  top: ", "px;\n  width: 100%;\n  z-index: ", ";\n  -webkit-overflow-scrolling: touch;\n"], ["\n  height: 100vh;\n  left: 0;\n  overflow-y: auto;\n  position: absolute;\n  top: ", "px;\n  width: 100%;\n  z-index: ", ";\n  -webkit-overflow-scrolling: touch;\n"])), function (props) { return props.scrollDistance; }, layers.modal);
export var PositionerAbsolute = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  height: ", ";\n  left: 0;\n  margin-left: auto;\n  margin-right: auto;\n  max-width: ", ";\n  position: absolute;\n  right: 0;\n  top: ", "px;\n  width: ", ";\n  z-index: ", ";\n  pointer-events: none;\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    height: 100%;\n    left: 0;\n    position: fixed;\n    top: 0;\n    max-width: 100%;\n    width: 100%;\n  }\n"], ["\n  display: flex;\n  flex-direction: column;\n  height: ", ";\n  left: 0;\n  margin-left: auto;\n  margin-right: auto;\n  max-width: ", ";\n  position: absolute;\n  right: 0;\n  top: ", "px;\n  width: ", ";\n  z-index: ", ";\n  pointer-events: none;\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    height: 100%;\n    left: 0;\n    position: fixed;\n    top: 0;\n    max-width: 100%;\n    width: 100%;\n  }\n"])), maxHeightDimensions, maxDimensions, gutter, dialogWidth, layers.modal);
export var PositionerRelative = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: ", "px auto;\n  position: relative;\n  width: ", ";\n  z-index: ", ";\n  pointer-events: none;\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    height: 100%;\n    left: 0;\n    position: fixed;\n    top: 0;\n    margin: 0;\n    max-width: 100%;\n    width: 100%;\n  }\n"], ["\n  margin: ", "px auto;\n  position: relative;\n  width: ", ";\n  z-index: ", ";\n  pointer-events: none;\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    height: 100%;\n    left: 0;\n    position: fixed;\n    top: 0;\n    margin: 0;\n    max-width: 100%;\n    width: 100%;\n  }\n"])), gutter, dialogWidth, layers.modal);
export var Dialog = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n  color: ", ";\n  display: flex;\n  flex-direction: column;\n  height: ", ";\n  ", ";\n  outline: 0;\n  pointer-events: auto;\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    height: 100%;\n    max-height: 100%;\n    border-radius: 0;\n  }\n"], ["\n  ",
    "\n  color: ", ";\n  display: flex;\n  flex-direction: column;\n  height: ",
    ";\n  ", ";\n  outline: 0;\n  pointer-events: auto;\n\n  @media (min-width: 320px) and (max-width: 480px) {\n    height: 100%;\n    max-height: 100%;\n    border-radius: 0;\n  }\n"])), function (props) {
    return props.isChromeless
        ? null
        : "\n          background-color: " + dialogBgColor(props) + ";\n          border-radius: " + borderRadius() + "px;\n          box-shadow: " + boxShadow(props) + ";\n        ";
}, text, function (props) {
    return dialogHeight({ heightValue: props.heightValue });
}, flexMaxHeightIEFix);
PositionerAbsolute.displayName = 'PositionerAbsolute';
Dialog.displayName = 'Dialog';
FillScreen.displayName = 'FillScreen';
PositionerRelative.displayName = 'PositionerRelative';
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=Modal.js.map
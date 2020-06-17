import { __makeTemplateObject, __rest } from "tslib";
import styled, { css, keyframes } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { N500, N0 } from '@atlaskit/theme/colors';
import { SIZES_MAP } from './constants';
var getStrokeWidth = function (size) { return Math.round(size / 10); };
var getStrokeCircumference = function (size) {
    var strokeWidth = getStrokeWidth(size);
    var strokeRadius = size / 2 - strokeWidth / 2;
    return Math.PI * strokeRadius * 2;
};
/* Define keyframes statically to prevent a perfomance issue in styled components v1 where the keyframes function
 * does not cache previous values resulting in each spinner injecting the same keyframe definition
 * in the DOM.
 * This can be reverted to dynamic keyframes when we upgrade to styled components v2
 */
var keyframeNames = {
    noop: keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    from { opacity: 0; }\n    to { opacity: 0; }\n  "], ["\n    from { opacity: 0; }\n    to { opacity: 0; }\n  "]))),
    rotate: keyframes(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    to { transform: rotate(360deg); }\n  "], ["\n    to { transform: rotate(360deg); }\n  "]))),
    enterOpacity: keyframes(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    from { opacity: 0; }\n    to { opacity: 1; }\n  "], ["\n    from { opacity: 0; }\n    to { opacity: 1; }\n  "]))),
    smallEnterStroke: keyframes(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ", "px; }\n  "], ["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ",
        "px; }\n  "])), getStrokeCircumference(SIZES_MAP.small), getStrokeCircumference(SIZES_MAP.small) *
        0.8),
    mediumEnterStroke: keyframes(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ", "px; }\n  "], ["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ",
        "px; }\n  "])), getStrokeCircumference(SIZES_MAP.medium), getStrokeCircumference(SIZES_MAP.medium) *
        0.8),
    largeEnterStroke: keyframes(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ", "px; }\n  "], ["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ",
        "px; }\n  "])), getStrokeCircumference(SIZES_MAP.large), getStrokeCircumference(SIZES_MAP.large) *
        0.8),
    xlargeEnterStroke: keyframes(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ", "px; }\n  "], ["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ",
        "px; }\n  "])), getStrokeCircumference(SIZES_MAP.xlarge), getStrokeCircumference(SIZES_MAP.xlarge) *
        0.8),
};
/* If a standard size is used, we can use one of our statically defined keyframes, otherwise
 * we're forced to dynamically create the keyframe and incur a performance cost.
 */
var getEnterStrokeKeyframe = function (size) {
    var standardSizeName = Object.keys(SIZES_MAP).find(function (sizeName) { return size === SIZES_MAP[sizeName]; });
    if (standardSizeName) {
        return keyframeNames[standardSizeName + "EnterStroke"];
    }
    var circumference = getStrokeCircumference(size);
    return keyframes(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ", "px; }\n  "], ["\n    from { stroke-dashoffset: ", "px; }\n    to { stroke-dashoffset: ", "px; }\n  "])), circumference, circumference * 0.8);
};
var spinnerColor = themed({ light: N500, dark: N0 });
var spinnerColorInverted = themed({ light: N0, dark: N0 });
export var getStrokeColor = function (_a) {
    var invertColor = _a.invertColor, props = __rest(_a, ["invertColor"]);
    return invertColor ? spinnerColorInverted(props) : spinnerColor(props);
};
export var svgStyles = css(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ",
    ";\n"])), function (props) {
    var circumference = getStrokeCircumference(props.size);
    var animation = function (animProps) {
        var baseAnimation = '0.86s cubic-bezier(0.4, 0.15, 0.6, 0.85) infinite';
        if (animProps.phase === 'ENTER') {
            return css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n          animation: ", " ", ",\n            0.8s ease-in-out ", ",\n            0.2s ease-in-out ", ";\n        "], ["\n          animation: ", " ", ",\n            0.8s ease-in-out ", ",\n            0.2s ease-in-out ", ";\n        "])), baseAnimation, keyframeNames.rotate, getEnterStrokeKeyframe(animProps.size), keyframeNames.enterOpacity);
        }
        return css(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n        animation: ", " ", ";\n      "], ["\n        animation: ", " ", ";\n      "])), baseAnimation, keyframeNames.rotate);
    };
    return css(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n      ", "\n      fill: none;\n      stroke: ", ";\n      stroke-dasharray: ", "px;\n      stroke-dashoffset: ", "px;\n      stroke-linecap: round;\n      stroke-width: ", "px;\n      transform-origin: center;\n    "], ["\n      ", "\n      fill: none;\n      stroke: ", ";\n      stroke-dasharray: ", "px;\n      stroke-dashoffset: ", "px;\n      stroke-linecap: round;\n      stroke-width: ", "px;\n      transform-origin: center;\n    "])), animation, getStrokeColor, circumference, circumference * 0.8, getStrokeWidth(props.size));
});
var Svg = styled.svg(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ", ";\n"])), svgStyles);
Svg.displayName = 'SpinnerSvg';
export default Svg;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
//# sourceMappingURL=styledSvg.js.map
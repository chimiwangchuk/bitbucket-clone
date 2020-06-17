import { __makeTemplateObject } from "tslib";
import styled, { keyframes, css } from 'styled-components';
/* Define keyframes statically to prevent a perfomance issue in styled components v1 where the keyframes function
 * does not cache previous values resulting in each spinner injecting the same keyframe definition
 * in the DOM.
 * This can be reverted to use dynamic keyframes when we upgrade to styled components v2
 */
var keyframeNames = {
    noop: keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    from { opacity: 0; }\n    to { opacity: 0; }\n  "], ["\n    from { opacity: 0; }\n    to { opacity: 0; }\n  "]))),
    enterRotate: keyframes(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    from { transform: rotate(50deg); }\n    to { transform: rotate(230deg); }\n  "], ["\n    from { transform: rotate(50deg); }\n    to { transform: rotate(230deg); }\n  "]))),
    leaveRotate: keyframes(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    from { transform: rotate(230deg); }\n    to { transform: rotate(510deg); }\n  "], ["\n    from { transform: rotate(230deg); }\n    to { transform: rotate(510deg); }\n  "]))),
    leaveOpacity: keyframes(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    from { opacity: 1; }\n    to { opacity: 0; }\n  "], ["\n    from { opacity: 1; }\n    to { opacity: 0; }\n  "]))),
};
export var getContainerAnimation = function (_a) {
    var delay = _a.delay, phase = _a.phase;
    if (phase === 'DELAY') {
        /* This hides the spinner and allows us to use animationend events to move to the next phase in
         * the same way we do with the other lifecycle stages */
        return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      animation: ", "s ", ";\n    "], ["\n      animation: ", "s ", ";\n    "])), delay, keyframeNames.noop);
    }
    if (phase === 'ENTER' || phase === 'IDLE') {
        return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      animation: 1s ease-in-out forwards ", ";\n    "], ["\n      animation: 1s ease-in-out forwards ", ";\n    "])), keyframeNames.enterRotate);
    }
    if (phase === 'LEAVE') {
        return css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      animation: 0.53s ease-in-out forwards ", ",\n        0.2s ease-in-out 0.33s ", ";\n    "], ["\n      animation: 0.53s ease-in-out forwards ", ",\n        0.2s ease-in-out 0.33s ", ";\n    "])), keyframeNames.leaveRotate, keyframeNames.leaveOpacity);
    }
    return '';
};
var getSize = function (_a) {
    var size = _a.size;
    return size + "px";
};
var Container = styled.span(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  ", "\n  display: flex;\n  height: ", ";\n  width: ", ";\n\n  /* Rapidly creating and removing spinners will result in multiple spinners being visible while\n   * they complete their exit animations. This rules hides the spinner if another one has been\n   * added. */\n  div + & {\n    display: none;\n  }\n"], ["\n  ", "\n  display: flex;\n  height: ", ";\n  width: ", ";\n\n  /* Rapidly creating and removing spinners will result in multiple spinners being visible while\n   * they complete their exit animations. This rules hides the spinner if another one has been\n   * added. */\n  div + & {\n    display: none;\n  }\n"])), getContainerAnimation, getSize, getSize);
Container.displayName = 'SpinnerContainer';
export default Container;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=styledContainer.js.map
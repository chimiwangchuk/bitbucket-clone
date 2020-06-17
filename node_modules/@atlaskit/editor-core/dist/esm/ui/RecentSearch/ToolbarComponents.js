import { __makeTemplateObject } from "tslib";
import styled, { css } from 'styled-components';
export var RECENT_SEARCH_WIDTH_IN_PX = 420;
export var RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX = 360;
export var RECENT_SEARCH_HEIGHT_IN_PX = 360;
export var InputWrapper = "\n  display: flex;\n  line-height: 0;\n  padding: 5px 0;\n  align-items: center;\n";
export var UrlInputWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), InputWrapper);
export var Container = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: ", "px;\n  display: flex;\n  flex-direction: column;\n  overflow: auto;\n  padding: 0;\n\n  ", ";\n  line-height: 2;\n"], ["\n  width: ", "px;\n  display: flex;\n  flex-direction: column;\n  overflow: auto;\n  padding: 0;\n\n  ",
    ";\n  line-height: 2;\n"])), RECENT_SEARCH_WIDTH_IN_PX, function (_a) {
    var provider = _a.provider;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      width: ", "px;\n    "], ["\n      width: ",
        "px;\n    "])), provider
        ? RECENT_SEARCH_WIDTH_IN_PX
        : RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX);
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=ToolbarComponents.js.map
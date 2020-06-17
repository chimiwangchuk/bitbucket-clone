import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
var WrapperStyles = "\n  /*\n    Increasing specificity with double ampersand to ensure these rules take\n    priority over the global styles applied to 'ol' elements.\n  */\n  && {\n    list-style-type: none;\n    padding-left: 0;\n  }\n";
var TaskListWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), WrapperStyles);
var DecisionListWrapper = styled.ol(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), WrapperStyles);
export { TaskListWrapper, DecisionListWrapper };
var templateObject_1, templateObject_2;
//# sourceMappingURL=ListWrapper.js.map
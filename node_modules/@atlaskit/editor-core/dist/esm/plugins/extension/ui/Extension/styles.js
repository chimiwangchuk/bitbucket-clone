import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { fontSize, gridSize } from '@atlaskit/theme';
import { colors, borderRadius, themed } from '@atlaskit/theme';
export var padding = gridSize();
export var BODIED_EXT_PADDING = padding * 2;
export var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: ", ";\n  border-radius: ", "px;\n  color: ", ";\n  position: relative;\n  vertical-align: middle;\n  font-size: ", "px;\n\n  .ProseMirror-selectednode > span > & > .extension-overlay {\n    box-shadow: inset 0px 0px 0px 2px ", ";\n    opacity: 1;\n  }\n\n  &.with-overlay {\n    .extension-overlay {\n      background: ", ";\n      color: transparent;\n    }\n\n    &:hover .extension-overlay {\n      opacity: 1;\n    }\n  }\n"], ["\n  background: ",
    ";\n  border-radius: ", "px;\n  color: ",
    ";\n  position: relative;\n  vertical-align: middle;\n  font-size: ", "px;\n\n  .ProseMirror-selectednode > span > & > .extension-overlay {\n    box-shadow: inset 0px 0px 0px 2px ", ";\n    opacity: 1;\n  }\n\n  &.with-overlay {\n    .extension-overlay {\n      background: ", ";\n      color: transparent;\n    }\n\n    &:hover .extension-overlay {\n      opacity: 1;\n    }\n  }\n"])), themed({
    light: colors.N20,
    dark: colors.DN50,
}), borderRadius(), themed({
    dark: colors.DN700,
}), fontSize(), colors.B200, colors.N20A);
export var Overlay = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border-radius: ", "px;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.3s;\n"], ["\n  border-radius: ", "px;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.3s;\n"])), borderRadius());
export var PlaceholderFallback = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: inline-flex;\n  align-items: center;\n\n  & > img {\n    margin: 0 4px;\n  }\n"], ["\n  display: inline-flex;\n  align-items: center;\n\n  & > img {\n    margin: 0 4px;\n  }\n"])));
export var PlaceholderFallbackParams = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: inline-block;\n  max-width: 200px;\n  margin-left: 5px;\n  color: ", ";\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n"], ["\n  display: inline-block;\n  max-width: 200px;\n  margin-left: 5px;\n  color: ", ";\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n"])), colors.N70);
export var StyledImage = styled.img(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  max-height: 16px;\n  max-width: 16px;\n"], ["\n  max-height: 16px;\n  max-width: 16px;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=styles.js.map
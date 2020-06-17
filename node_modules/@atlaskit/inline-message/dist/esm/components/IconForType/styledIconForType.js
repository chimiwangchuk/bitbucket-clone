import { __makeTemplateObject } from "tslib";
import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import { itemSpacing } from '../../constants';
var getBaseColor = themed('appearance', {
    connectivity: { light: colors.B400, dark: colors.B100 },
    confirmation: { light: colors.G300, dark: colors.G300 },
    info: { light: colors.P300, dark: colors.P300 },
    warning: { light: colors.Y300, dark: colors.Y300 },
    error: { light: colors.R400, dark: colors.R400 },
});
var getHoverColor = themed('appearance', {
    connectivity: { light: colors.B300, dark: colors.B75 },
    confirmation: { light: colors.G200, dark: colors.G200 },
    info: { light: colors.P200, dark: colors.P200 },
    warning: { light: colors.Y200, dark: colors.Y200 },
    error: { light: colors.R300, dark: colors.R300 },
});
var getColor = function (props) {
    if (props.isHovered || props.isOpen)
        return getHoverColor(props);
    return getBaseColor(props);
};
var IconWrapper = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  align-items: center;\n  display: flex;\n  flex: 0 0 auto;\n  padding: 0 ", ";\n  color: ", ";\n"], ["\n  align-items: center;\n  display: flex;\n  flex: 0 0 auto;\n  padding: 0 ", ";\n  color: ", ";\n"])), itemSpacing, getColor);
export default IconWrapper;
var templateObject_1;
//# sourceMappingURL=styledIconForType.js.map
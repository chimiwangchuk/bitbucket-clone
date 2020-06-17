import { __assign, __makeTemplateObject, __rest } from "tslib";
import React from 'react';
import styled from 'styled-components';
import { themed, withTheme } from '@atlaskit/theme/components';
import { N50, DN100, background } from '@atlaskit/theme/colors';
import { Theme } from '../theme';
export var ShapeGroup = withTheme(styled.g(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  & circle,\n  & rect {\n    fill: ", ";\n  }\n  & g {\n    fill: ", ";\n  }\n"], ["\n  & circle,\n  & rect {\n    fill: ", ";\n  }\n  & g {\n    fill: ", ";\n  }\n"])), themed({ light: N50, dark: DN100 }), background));
export var Slot = function (_a) {
    var isLoading = _a.isLoading, appearance = _a.appearance, size = _a.size, backgroundImage = _a.backgroundImage, label = _a.label, role = _a.role;
    return (React.createElement(Theme.Consumer, { appearance: appearance, isLoading: isLoading, size: size }, function (_a) {
        var backgroundColor = _a.backgroundColor, borderRadius = _a.borderRadius;
        return (React.createElement("span", { style: {
                backgroundColor: backgroundColor,
                backgroundImage: backgroundImage
                    ? "url(" + backgroundImage + ")"
                    : undefined,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                borderRadius: borderRadius,
                display: 'flex',
                flex: '1 1 100%',
                height: '100%',
                width: '100%',
            }, role: role, "aria-label": label }));
    }));
};
export var Svg = function (_a) {
    var appearance = _a.appearance, size = _a.size, children = _a.children, isLoading = _a.isLoading, otherProps = __rest(_a, ["appearance", "size", "children", "isLoading"]);
    return (React.createElement(Theme.Consumer, { appearance: appearance, isLoading: isLoading, size: size }, function (_a) {
        var backgroundColor = _a.backgroundColor, borderRadius = _a.borderRadius;
        return (React.createElement("svg", __assign({ style: {
                backgroundColor: backgroundColor,
                borderRadius: borderRadius,
                height: '100%',
                width: '100%',
            } }, otherProps), children));
    }));
};
var templateObject_1;
//# sourceMappingURL=AvatarImage.js.map
import { __assign, __rest } from "tslib";
import React from 'react';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme/constants';
var Navigator = function (props) { return (React.createElement(Button, __assign({}, props, { appearance: "subtle", spacing: "none", theme: function (currentTheme, themeProps) {
        var _a = currentTheme(themeProps), buttonStyles = _a.buttonStyles, rest = __rest(_a, ["buttonStyles"]);
        var halfGridSize = gridSize() / 2;
        return __assign({ buttonStyles: __assign(__assign({}, buttonStyles), { paddingLeft: halfGridSize + "px", paddingRight: halfGridSize + "px", 'html[dir=rtl] &': {
                    transform: 'rotate(180deg)',
                } }) }, rest);
    } }))); };
export default Navigator;
//# sourceMappingURL=Navigator.js.map
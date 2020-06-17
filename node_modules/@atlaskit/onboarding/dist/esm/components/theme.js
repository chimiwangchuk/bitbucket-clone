import { __assign, __rest } from "tslib";
import * as colors from '@atlaskit/theme/colors';
var spotlightTheme = {
    default: {
        background: {
            default: { light: colors.P400, dark: colors.P400 },
            hover: { light: colors.P200, dark: colors.P200 },
            active: { light: colors.P500, dark: colors.P500 },
            disabled: { light: colors.N30, dark: colors.DN70 },
            selected: { light: colors.R500, dark: colors.R500 },
            focus: { light: colors.P400, dark: colors.P400 },
        },
        boxShadow: {
            focus: {
                light: colors.P100 + " 0 0 0 2px",
                dark: colors.P100 + " 0 0 0 2px",
            },
        },
        color: {
            default: { light: colors.N0, dark: colors.N0 },
            hover: { light: colors.N0, dark: colors.N0 },
            active: { light: colors.N0, dark: colors.N0 },
            disabled: { light: colors.N0, dark: colors.DN30 },
            selected: { light: colors.N0, dark: colors.N0 },
            focus: { light: colors.N0, dark: colors.N0 },
        },
        outline: {
            focus: { light: 'none', dark: 'none' },
        },
    },
    'subtle-link': {
        textDecoration: {
            hover: {
                light: "underline " + colors.P75,
                dark: "underline " + colors.P75,
            },
        },
        textDecorationLine: {
            active: { light: 'none', dark: 'none' },
        },
        boxShadow: {
            focus: {
                light: colors.P100 + " 0 0 0 2px",
                dark: colors.P100 + " 0 0 0 2px",
            },
        },
        color: {
            default: { light: colors.N0, dark: colors.N0 },
            hover: { light: colors.P75, dark: colors.P75 },
            active: { light: colors.P100, dark: colors.P100 },
            disabled: { light: colors.P500, dark: colors.P500 },
            selected: { light: colors.N0, dark: colors.N0 },
        },
    },
};
var modalTheme = {
    primary: {
        background: {
            default: { light: colors.P400, dark: colors.P400 },
            hover: { light: colors.P200, dark: colors.P200 },
            active: { light: colors.P500, dark: colors.P500 },
            disabled: { light: colors.N30, dark: colors.DN70 },
            selected: { light: colors.R500, dark: colors.R500 },
            focus: { light: colors.P400, dark: colors.P400 },
        },
        boxShadow: {
            focus: {
                light: colors.P100 + " 0 0 0 2px",
                dark: colors.P100 + " 0 0 0 2px",
            },
        },
        color: {
            default: { light: colors.N0, dark: colors.N0 },
            disabled: { light: colors.N0, dark: colors.DN30 },
            selected: { light: colors.N0, dark: colors.N0 },
            focus: { light: colors.N0, dark: colors.N0 },
        },
    },
};
function extract(newTheme, _a) {
    var mode = _a.mode, appearance = _a.appearance, state = _a.state;
    if (!newTheme[appearance]) {
        return undefined;
    }
    var root = newTheme[appearance];
    return Object.keys(root).reduce(function (acc, val) {
        var node = root;
        [val, state, mode].forEach(function (item) {
            if (!node[item]) {
                return undefined;
            }
            if (typeof node[item] !== 'object') {
                acc[val] = node[item];
                return undefined;
            }
            node = node[item];
            return undefined;
        });
        return acc;
    }, {});
}
export var spotlightButtonTheme = function (current, themeProps) {
    var _a = current(themeProps), buttonStyles = _a.buttonStyles, rest = __rest(_a, ["buttonStyles"]);
    return __assign({ buttonStyles: __assign(__assign({}, buttonStyles), extract(spotlightTheme, themeProps)) }, rest);
};
export var modalButtonTheme = function (current, themeProps) {
    var _a = current(themeProps), buttonStyles = _a.buttonStyles, rest = __rest(_a, ["buttonStyles"]);
    return __assign({ buttonStyles: __assign(__assign({}, buttonStyles), extract(modalTheme, themeProps)) }, rest);
};
//# sourceMappingURL=theme.js.map
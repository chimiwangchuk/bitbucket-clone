import { __assign } from "tslib";
import { codeFontFamily, borderRadius, gridSize, fontSize, } from '@atlaskit/theme/constants';
import { defaultColors } from './defaultTheme';
var codeContainerStyle = {
    fontFamily: codeFontFamily,
    fontSize: '12px',
    lineHeight: 20 / 12,
    padding: gridSize(),
};
var lineNumberContainerStyle = function (theme) { return ({
    fontSize: fontSize() + "px",
    lineHeight: 20 / 14,
    color: theme.lineNumberColor,
    backgroundColor: theme.lineNumberBgColor,
    flexShrink: 0,
    padding: gridSize(),
    textAlign: 'right',
    userSelect: 'none',
}); };
var sharedCodeStyle = function (theme) { return ({
    key: {
        color: theme.keywordColor,
        fontWeight: 'bolder',
    },
    keyword: {
        color: theme.keywordColor,
        fontWeight: 'bolder',
    },
    'attr-name': {
        color: theme.attributeColor,
    },
    selector: {
        color: theme.selectorTagColor,
    },
    comment: {
        color: theme.commentColor,
        fontFamily: "SFMono-MediumItalic, " + codeFontFamily(),
        fontStyle: 'italic',
    },
    'block-comment': {
        color: theme.commentColor,
        fontFamily: "SFMono-MediumItalic, " + codeFontFamily(),
        fontStyle: 'italic',
    },
    'function-name': {
        color: theme.sectionColor,
    },
    'class-name': {
        color: theme.sectionColor,
    },
    doctype: {
        color: theme.docTagColor,
    },
    substr: {
        color: theme.substringColor,
    },
    namespace: {
        color: theme.nameColor,
    },
    builtin: {
        color: theme.builtInColor,
    },
    entity: {
        color: theme.literalColor,
    },
    bullet: {
        color: theme.bulletColor,
    },
    code: {
        color: theme.codeColor,
    },
    addition: {
        color: theme.additionColor,
    },
    regex: {
        color: theme.regexpColor,
    },
    symbol: {
        color: theme.symbolColor,
    },
    variable: {
        color: theme.variableColor,
    },
    url: {
        color: theme.linkColor,
    },
    'selector-attr': {
        color: theme.selectorAttributeColor,
    },
    'selector-pseudo': {
        color: theme.selectorPseudoColor,
    },
    type: {
        color: theme.typeColor,
    },
    string: {
        color: theme.stringColor,
    },
    quote: {
        color: theme.quoteColor,
    },
    tag: {
        color: theme.templateTagColor,
    },
    deletion: {
        color: theme.deletionColor,
    },
    title: {
        color: theme.titleColor,
    },
    section: {
        color: theme.sectionColor,
    },
    'meta-keyword': {
        color: theme.metaKeywordColor,
    },
    meta: {
        color: theme.metaColor,
    },
    italic: {
        fontStyle: 'italic',
    },
    bold: {
        fontWeight: 'bolder',
    },
    function: {
        color: theme.functionColor,
    },
    number: {
        color: theme.numberColor,
    },
}); };
var codeStyle = function (theme) { return ({
    fontFamily: codeFontFamily,
    fontSize: '12px',
    background: theme.backgroundColor,
    color: theme.textColor,
    borderRadius: borderRadius(),
    display: 'flex',
    lineHeight: 20 / 12,
    overflowX: 'auto',
    whiteSpace: 'pre',
}); };
var codeBlockStyle = function (theme) { return (__assign({ 'pre[class*="language-"]': codeStyle(theme) }, sharedCodeStyle(theme))); };
var inlineCodeStyle = function (theme) { return (__assign({ 'pre[class*="language-"]': __assign(__assign({}, codeStyle(theme)), { padding: '2px 4px', display: 'inline', whiteSpace: 'pre-wrap' }) }, sharedCodeStyle(theme))); };
export function applyTheme(theme) {
    if (theme === void 0) { theme = {}; }
    var newTheme = __assign(__assign({}, defaultColors(theme)), theme);
    return {
        lineNumberContainerStyle: lineNumberContainerStyle(newTheme),
        codeBlockStyle: codeBlockStyle(newTheme),
        inlineCodeStyle: inlineCodeStyle(newTheme),
        codeContainerStyle: codeContainerStyle,
    };
}
//# sourceMappingURL=themeBuilder.js.map
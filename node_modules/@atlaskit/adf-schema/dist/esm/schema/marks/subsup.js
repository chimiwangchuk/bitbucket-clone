import { FONT_STYLE } from '../groups';
function getAttrFromVerticalAlign(node) {
    if (node.style.verticalAlign) {
        var type = node.style.verticalAlign.slice(0, 3);
        if (type === 'sub' || type === 'sup') {
            return { type: type };
        }
    }
    return false;
}
export var subsup = {
    inclusive: true,
    group: FONT_STYLE,
    attrs: { type: { default: 'sub' } },
    parseDOM: [
        { tag: 'sub', attrs: { type: 'sub' } },
        { tag: 'sup', attrs: { type: 'sup' } },
        {
            // Special case for pasting from Google Docs
            // Google Docs uses vertical align to denote subscript and super script
            tag: 'span',
            style: 'vertical-align=super',
            getAttrs: function (node) { return getAttrFromVerticalAlign(node); },
        },
        {
            tag: 'span',
            style: 'vertical-align=sub',
            getAttrs: function (node) { return getAttrFromVerticalAlign(node); },
        },
    ],
    toDOM: function (mark) {
        return [mark.attrs.type];
    },
};
//# sourceMappingURL=subsup.js.map
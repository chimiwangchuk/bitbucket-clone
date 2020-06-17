import { FONT_STYLE } from '../groups';
var emDOM = ['em'];
export var em = {
    inclusive: true,
    group: FONT_STYLE,
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM: function () {
        return emDOM;
    },
};
//# sourceMappingURL=em.js.map
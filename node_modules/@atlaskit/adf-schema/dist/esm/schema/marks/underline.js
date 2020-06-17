import { FONT_STYLE } from '../groups';
export var underline = {
    inclusive: true,
    group: FONT_STYLE,
    parseDOM: [
        { tag: 'u' },
        {
            style: 'text-decoration',
            getAttrs: function (value) { return value === 'underline' && null; },
        },
    ],
    toDOM: function () {
        return ['u'];
    },
};
//# sourceMappingURL=underline.js.map
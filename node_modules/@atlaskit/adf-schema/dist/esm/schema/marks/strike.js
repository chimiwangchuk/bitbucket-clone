import { FONT_STYLE } from '../groups';
export var strike = {
    inclusive: true,
    group: FONT_STYLE,
    parseDOM: [
        { tag: 'strike' },
        { tag: 's' },
        { tag: 'del' },
        {
            style: 'text-decoration',
            getAttrs: function (value) { return value === 'line-through' && null; },
        },
    ],
    toDOM: function () {
        return ['s'];
    },
};
//# sourceMappingURL=strike.js.map
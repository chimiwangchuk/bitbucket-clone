import { FONT_STYLE } from '../groups';
var strongDOM = ['strong'];
export var strong = {
    inclusive: true,
    group: FONT_STYLE,
    parseDOM: [
        { tag: 'strong' },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        {
            tag: 'b',
            getAttrs: function (node) {
                var element = node;
                return element.style.fontWeight !== 'normal' && null;
            },
        },
        {
            style: 'font-weight',
            getAttrs: function (value) {
                return (typeof value === 'string' &&
                    /^(bold(er)?|[5-9]\d{2,})$/.test(value) &&
                    null);
            },
        },
    ],
    toDOM: function () {
        return strongDOM;
    },
};
//# sourceMappingURL=strong.js.map
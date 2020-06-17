export var defaultAttrs = {
    width: { default: null },
    layout: { default: 'center' },
};
export var mediaSingle = {
    inline: false,
    group: 'block',
    selectable: true,
    atom: true,
    content: 'media',
    attrs: defaultAttrs,
    parseDOM: [
        {
            tag: 'div[data-node-type="mediaSingle"]',
            getAttrs: function (dom) { return ({
                layout: dom.getAttribute('data-layout') || 'center',
                width: Number(dom.getAttribute('data-width')) || null,
            }); },
        },
    ],
    toDOM: function (node) {
        var _a = node.attrs, layout = _a.layout, width = _a.width;
        var attrs = {
            'data-node-type': 'mediaSingle',
            'data-layout': layout,
            'data-width': '',
        };
        if (width) {
            attrs['data-width'] =
                isFinite(width) && Math.floor(width) === width
                    ? width
                    : width.toFixed(2);
        }
        return ['div', attrs, 0];
    },
};
export var toJSON = function (node) { return ({
    attrs: Object.keys(node.attrs).reduce(function (obj, key) {
        if (node.attrs[key] !== null) {
            obj[key] = node.attrs[key];
        }
        return obj;
    }, {}),
}); };
//# sourceMappingURL=media-single.js.map
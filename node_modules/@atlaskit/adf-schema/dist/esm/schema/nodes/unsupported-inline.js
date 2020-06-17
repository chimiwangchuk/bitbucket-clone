export var unsupportedInline = {
    inline: true,
    group: 'inline',
    selectable: true,
    attrs: {
        originalValue: { default: {} },
    },
    parseDOM: [
        {
            tag: '[data-node-type="unsupportedInline"]',
            getAttrs: function (dom) { return ({
                originalValue: JSON.parse(dom.getAttribute('data-original-value') || '{}'),
            }); },
        },
    ],
    toDOM: function (node) {
        var attrs = {
            'data-node-type': 'unsupportedInline',
            'data-original-value': JSON.stringify(node.attrs.originalValue),
        };
        return ['span', attrs, 'Unsupported content'];
    },
};
//# sourceMappingURL=unsupported-inline.js.map
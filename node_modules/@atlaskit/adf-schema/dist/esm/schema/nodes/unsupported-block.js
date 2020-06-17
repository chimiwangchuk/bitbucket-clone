export var unsupportedBlock = {
    inline: false,
    group: 'block',
    atom: true,
    selectable: true,
    attrs: {
        originalValue: { default: {} },
    },
    parseDOM: [
        {
            tag: '[data-node-type="unsupportedBlock"]',
            getAttrs: function (dom) { return ({
                originalValue: JSON.parse(dom.getAttribute('data-original-value') || '{}'),
            }); },
        },
    ],
    toDOM: function (node) {
        var attrs = {
            'data-node-type': 'unsupportedBlock',
            'data-original-value': JSON.stringify(node.attrs.originalValue),
        };
        return ['div', attrs, 'Unsupported content'];
    },
};
//# sourceMappingURL=unsupported-block.js.map
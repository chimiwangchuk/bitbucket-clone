export var extension = {
    inline: false,
    group: 'block',
    atom: true,
    selectable: true,
    attrs: {
        extensionType: { default: '' },
        extensionKey: { default: '' },
        parameters: { default: null },
        text: { default: null },
        layout: { default: 'default' },
    },
    parseDOM: [
        {
            tag: '[data-node-type="extension"]',
            getAttrs: function (domNode) {
                var dom = domNode;
                return {
                    extensionType: dom.getAttribute('data-extension-type'),
                    extensionKey: dom.getAttribute('data-extension-key'),
                    text: dom.getAttribute('data-text'),
                    parameters: JSON.parse(dom.getAttribute('data-parameters') || '{}'),
                    layout: dom.getAttribute('data-layout') || 'default',
                };
            },
        },
    ],
    toDOM: function (node) {
        var attrs = {
            'data-node-type': 'extension',
            'data-extension-type': node.attrs.extensionType,
            'data-extension-key': node.attrs.extensionKey,
            'data-text': node.attrs.text,
            'data-parameters': JSON.stringify(node.attrs.parameters),
            'data-layout': node.attrs.layout,
        };
        return ['div', attrs];
    },
};
//# sourceMappingURL=extension.js.map
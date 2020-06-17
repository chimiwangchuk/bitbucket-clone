export var inlineExtension = {
    inline: true,
    group: 'inline',
    selectable: true,
    attrs: {
        extensionType: { default: '' },
        extensionKey: { default: '' },
        parameters: { default: null },
        text: { default: null },
    },
    parseDOM: [
        {
            tag: 'span[data-extension-type]',
            getAttrs: function (domNode) {
                var dom = domNode;
                return {
                    extensionType: dom.getAttribute('data-extension-type'),
                    extensionKey: dom.getAttribute('data-extension-key'),
                    text: dom.getAttribute('data-text'),
                    parameters: JSON.parse(dom.getAttribute('data-parameters') || '{}'),
                };
            },
        },
    ],
    toDOM: function (node) {
        var attrs = {
            'data-extension-type': node.attrs.extensionType,
            'data-extension-key': node.attrs.extensionKey,
            'data-text': node.attrs.text,
            'data-parameters': JSON.stringify(node.attrs.parameters),
            contenteditable: 'false',
        };
        return ['span', attrs];
    },
};
//# sourceMappingURL=inline-extension.js.map
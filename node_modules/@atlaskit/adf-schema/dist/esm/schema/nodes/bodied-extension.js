export var bodiedExtension = {
    inline: false,
    group: 'block',
    content: '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | mediaSingle | decisionList | taskList | table | blockCard | extension | unsupportedBlock)+',
    defining: true,
    selectable: true,
    isolating: true,
    attrs: {
        extensionType: { default: '' },
        extensionKey: { default: '' },
        parameters: { default: null },
        text: { default: null },
        layout: { default: 'default' },
    },
    parseDOM: [
        {
            context: 'bodiedExtension//',
            tag: '[data-node-type="bodied-extension"]',
            skip: true,
        },
        {
            tag: '[data-node-type="bodied-extension"]',
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
            'data-node-type': 'bodied-extension',
            'data-extension-type': node.attrs.extensionType,
            'data-extension-key': node.attrs.extensionKey,
            'data-text': node.attrs.text,
            'data-parameters': JSON.stringify(node.attrs.parameters),
            'data-layout': node.attrs.layout,
        };
        return ['div', attrs, 0];
    },
};
//# sourceMappingURL=bodied-extension.js.map
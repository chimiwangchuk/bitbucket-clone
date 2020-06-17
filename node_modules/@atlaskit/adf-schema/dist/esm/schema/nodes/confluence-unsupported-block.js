var name = 'confluenceUnsupportedBlock';
export var confluenceUnsupportedBlock = {
    group: 'block',
    attrs: { cxhtml: { default: null } },
    toDOM: function (node) {
        // NOTE: This node cannot be "contenteditable: false". If it's the only node in a document, PM throws an error because there's nowhere to put the cursor.
        var attrs = {
            'data-node-type': name,
            'data-confluence-unsupported': 'block',
            'data-confluence-unsupported-block-cxhtml': node.attrs['cxhtml'],
        };
        return ['div', attrs, 'Unsupported content'];
    },
    parseDOM: [
        {
            tag: "div[data-node-type=\"" + name + "\"]",
            getAttrs: function (dom) {
                return {
                    cxhtml: dom.getAttribute('data-confluence-unsupported-block-cxhtml'),
                };
            },
        },
    ],
};
//# sourceMappingURL=confluence-unsupported-block.js.map
var name = 'confluenceUnsupportedInline';
export var confluenceUnsupportedInline = {
    group: 'inline',
    inline: true,
    atom: true,
    attrs: { cxhtml: { default: null } },
    toDOM: function (node) {
        var attrs = {
            'data-node-type': name,
            'data-confluence-unsupported': 'inline',
            'data-confluence-unsupported-inline-cxhtml': node.attrs['cxhtml'],
        };
        return ['div', attrs, 'Unsupported content'];
    },
    parseDOM: [
        {
            tag: "div[data-node-type=\"" + name + "\"]",
            getAttrs: function (dom) {
                return {
                    cxhtml: dom.getAttribute('data-confluence-unsupported-inline-cxhtml'),
                };
            },
        },
    ],
};
//# sourceMappingURL=confluence-unsupported-inline.js.map
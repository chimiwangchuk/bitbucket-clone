export var date = {
    inline: true,
    group: 'inline',
    selectable: true,
    attrs: {
        timestamp: { default: '' },
    },
    parseDOM: [
        {
            tag: 'span[data-node-type="date"]',
            getAttrs: function (dom) { return ({
                timestamp: dom.getAttribute('data-timestamp'),
            }); },
        },
    ],
    toDOM: function (node) {
        var attrs = {
            'data-node-type': 'date',
            'data-timestamp': node.attrs.timestamp,
        };
        return ['span', attrs];
    },
};
//# sourceMappingURL=date.js.map
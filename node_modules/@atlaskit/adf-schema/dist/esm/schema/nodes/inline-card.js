export var inlineCard = {
    inline: true,
    group: 'inline',
    selectable: true,
    draggable: true,
    attrs: {
        url: { default: null },
        data: { default: null },
    },
    parseDOM: [
        {
            tag: 'a[data-inline-card]',
            // bump priority higher than hyperlink
            priority: 100,
            getAttrs: function (dom) {
                var anchor = dom;
                var data = anchor.getAttribute('data-card-data');
                return {
                    url: anchor.getAttribute('href') || null,
                    data: data ? JSON.parse(data) : null,
                };
            },
        },
        // for renderer
        {
            tag: 'div[data-inline-card]',
            getAttrs: function (dom) {
                var anchor = dom;
                var data = anchor.getAttribute('data-card-data');
                return {
                    url: anchor.getAttribute('data-card-url'),
                    data: data ? JSON.parse(data) : null,
                };
            },
        },
    ],
    toDOM: function (node) {
        var attrs = {
            'data-inline-card': '',
            href: node.attrs.url || '',
            'data-card-data': node.attrs.data ? JSON.stringify(node.attrs.data) : '',
        };
        if (node.attrs.url) {
            return ['a', attrs, node.attrs.url];
        }
        else {
            return ['a', attrs];
        }
    },
};
//# sourceMappingURL=inline-card.js.map
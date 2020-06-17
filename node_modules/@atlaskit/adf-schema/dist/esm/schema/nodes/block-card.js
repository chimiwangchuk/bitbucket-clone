export var blockCard = {
    inline: false,
    group: 'block',
    draggable: true,
    selectable: true,
    attrs: {
        url: { default: null },
        data: { default: null },
    },
    parseDOM: [
        {
            tag: 'a[data-block-card]',
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
        {
            tag: 'div[data-block-card]',
            getAttrs: function (dom) {
                var anchor = dom;
                var data = anchor.getAttribute('data-card-data');
                return {
                    url: anchor.getAttribute('data-card-url') || null,
                    data: data ? JSON.parse(data) : null,
                };
            },
        },
    ],
    toDOM: function (node) {
        var attrs = {
            'data-block-card': '',
            href: node.attrs.url || '',
            'data-card-data': node.attrs.data ? JSON.stringify(node.attrs.data) : '',
        };
        return ['a', attrs];
    },
};
//# sourceMappingURL=block-card.js.map
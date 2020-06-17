export var image = {
    group: 'inline',
    inline: true,
    attrs: {
        src: { default: '' },
        alt: { default: null },
        title: { default: null },
    },
    draggable: true,
    parseDOM: [
        {
            tag: 'img[src^="data:image/"]',
            ignore: true,
        },
        {
            tag: 'img[src]',
            getAttrs: function (domNode) {
                var dom = domNode;
                return {
                    src: dom.getAttribute('src'),
                    alt: dom.getAttribute('alt'),
                    title: dom.getAttribute('title'),
                };
            },
        },
    ],
    toDOM: function (node) {
        return ['img', node.attrs];
    },
};
//# sourceMappingURL=image.js.map
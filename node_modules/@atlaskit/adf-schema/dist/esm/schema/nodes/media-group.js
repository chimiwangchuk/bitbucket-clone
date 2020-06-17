export var mediaGroup = {
    inline: false,
    group: 'block',
    content: 'media+',
    attrs: {},
    parseDOM: [
        {
            tag: 'div[data-node-type="mediaGroup"]',
        },
        {
            tag: 'div[class="MediaGroup"]',
        },
    ],
    toDOM: function () {
        return [
            'div',
            {
                'data-node-type': 'mediaGroup',
            },
            0,
        ];
    },
};
//# sourceMappingURL=media-group.js.map
export var orderedListSelector = '.ak-ol';
export var orderedList = {
    group: 'block',
    content: 'listItem+',
    parseDOM: [{ tag: 'ol' }],
    toDOM: function () {
        var attrs = {
            class: orderedListSelector.substr(1),
        };
        return ['ol', attrs, 0];
    },
};
//# sourceMappingURL=ordered-list.js.map
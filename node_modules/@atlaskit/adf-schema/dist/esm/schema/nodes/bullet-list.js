export var bulletListSelector = '.ak-ul';
export var bulletList = {
    group: 'block',
    content: 'listItem+',
    parseDOM: [{ tag: 'ul' }],
    toDOM: function () {
        var attrs = {
            class: bulletListSelector.substr(1),
        };
        return ['ul', attrs, 0];
    },
};
//# sourceMappingURL=bullet-list.js.map
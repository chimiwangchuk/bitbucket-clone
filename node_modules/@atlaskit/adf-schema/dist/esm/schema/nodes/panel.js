export var panel = {
    group: 'block',
    content: '(paragraph | heading | bulletList | orderedList)+',
    attrs: {
        panelType: { default: 'info' },
    },
    parseDOM: [
        {
            tag: 'div[data-panel-type]',
            getAttrs: function (dom) { return ({
                panelType: dom.getAttribute('data-panel-type'),
            }); },
        },
    ],
    toDOM: function (node) {
        var panelType = node.attrs['panelType'];
        var attrs = {
            'data-panel-type': panelType,
        };
        return ['div', attrs, ['div', {}, 0]];
    },
};
//# sourceMappingURL=panel.js.map
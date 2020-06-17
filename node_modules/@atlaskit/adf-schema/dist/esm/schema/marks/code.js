import { COLOR, FONT_STYLE, LINK, SEARCH_QUERY } from '../groups';
export var code = {
    excludes: FONT_STYLE + " " + LINK + " " + SEARCH_QUERY + " " + COLOR,
    inclusive: true,
    parseDOM: [
        { tag: 'span.code', preserveWhitespace: true },
        { tag: 'code', preserveWhitespace: true },
        { tag: 'tt', preserveWhitespace: true },
        {
            tag: 'span',
            preserveWhitespace: true,
            getAttrs: function (domNode) {
                var dom = domNode;
                if (dom.style.whiteSpace === 'pre') {
                    return {};
                }
                if (dom.style.fontFamily &&
                    dom.style.fontFamily.toLowerCase().indexOf('monospace') >= 0) {
                    return {};
                }
                return false;
            },
        },
    ],
    toDOM: function () {
        return [
            'span',
            {
                style: 'white-space: pre-wrap;',
                class: 'code',
            },
        ];
    },
};
//# sourceMappingURL=code.js.map
import { ALIGNMENT, INDENTATION } from '../groups';
export var indentation = {
    excludes: "indentation " + ALIGNMENT,
    group: INDENTATION,
    attrs: {
        level: {},
    },
    parseDOM: [
        {
            tag: 'div.fabric-editor-indentation-mark',
            getAttrs: function (dom) {
                var level = +(dom.getAttribute('data-level') || '0');
                return {
                    level: level > 6 ? 6 : level < 1 ? false : level,
                };
            },
        },
    ],
    toDOM: function (mark) {
        return [
            'div',
            {
                class: 'fabric-editor-block-mark fabric-editor-indentation-mark',
                'data-level': mark.attrs.level,
            },
            0,
        ];
    },
};
//# sourceMappingURL=indentation.js.map
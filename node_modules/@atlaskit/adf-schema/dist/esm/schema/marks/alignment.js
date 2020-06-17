import { ALIGNMENT, INDENTATION } from '../groups';
/** TODO: Flip these positions for RTL */
export var alignmentPositionMap = {
    end: 'right',
    right: 'end',
    center: 'center',
};
export var alignment = {
    excludes: "alignment " + INDENTATION,
    group: ALIGNMENT,
    attrs: {
        align: {},
    },
    parseDOM: [
        {
            tag: 'div.fabric-editor-block-mark',
            getAttrs: function (dom) {
                var align = dom.getAttribute('data-align');
                return align ? { align: align } : false;
            },
        },
    ],
    toDOM: function (mark) {
        return [
            'div',
            {
                class: "fabric-editor-block-mark fabric-editor-align-" + mark.attrs.align,
                'data-align': mark.attrs.align,
            },
            0,
        ];
    },
};
//# sourceMappingURL=alignment.js.map
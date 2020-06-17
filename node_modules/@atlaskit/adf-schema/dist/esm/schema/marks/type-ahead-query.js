import { SEARCH_QUERY } from '../groups';
import { B400 } from '../../utils/colors';
export var typeAheadQuery = {
    inclusive: true,
    group: SEARCH_QUERY,
    parseDOM: [{ tag: 'span[data-type-ahead-query]' }],
    toDOM: function (node) {
        return [
            'span',
            {
                'data-type-ahead-query': 'true',
                'data-trigger': node.attrs.trigger,
                style: "color: " + B400,
            },
        ];
    },
    attrs: {
        trigger: { default: '' },
    },
};
//# sourceMappingURL=type-ahead-query.js.map
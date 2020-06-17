import { uuid } from '../../utils/uuid';
export var decisionItem = {
    content: 'inline*',
    defining: true,
    marks: '_',
    attrs: {
        localId: { default: '' },
        state: { default: 'DECIDED' },
    },
    parseDOM: [
        {
            tag: 'li[data-decision-local-id]',
            // Default priority is 50. We normally don't change this but since this node type is
            // also used by list-item we need to make sure that we run this parser first.
            priority: 100,
            getAttrs: function (dom) { return ({
                localId: uuid.generate(),
                state: dom.getAttribute('data-decision-state'),
            }); },
        },
    ],
    toDOM: function (node) {
        var _a = node.attrs, localId = _a.localId, state = _a.state;
        var attrs = {
            'data-decision-local-id': localId || 'local-decision',
            'data-decision-state': state,
        };
        return ['li', attrs, 0];
    },
};
//# sourceMappingURL=decision-item.js.map
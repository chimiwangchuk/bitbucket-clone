import { uuid } from '../../utils/uuid';
export var taskItem = {
    content: 'inline*',
    defining: true,
    marks: '_',
    attrs: {
        localId: { default: '' },
        state: { default: 'TODO' },
    },
    parseDOM: [
        {
            tag: 'div[data-task-local-id]',
            // Default priority is 50. We normally don't change this but since this node type is
            // also used by list-item we need to make sure that we run this parser first.
            priority: 100,
            getAttrs: function (dom) { return ({
                localId: uuid.generate(),
                state: dom.getAttribute('data-task-state') || 'TODO',
            }); },
        },
    ],
    toDOM: function (node) {
        var _a = node.attrs, localId = _a.localId, state = _a.state;
        var attrs = {
            'data-task-local-id': localId || 'local-task',
            'data-task-state': state || 'TODO',
        };
        return ['div', attrs, 0];
    },
};
//# sourceMappingURL=task-item.js.map
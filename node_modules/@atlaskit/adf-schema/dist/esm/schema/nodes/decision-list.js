import { uuid } from '../../utils/uuid';
var name = 'decisionList';
export var decisionListSelector = "[data-node-type=\"" + name + "\"]";
export var decisionList = {
    group: 'block',
    defining: true,
    content: 'decisionItem+',
    attrs: {
        localId: { default: '' },
    },
    parseDOM: [
        {
            tag: "ol" + decisionListSelector,
            // Default priority is 50. We normally don't change this but since this node type is
            // also used by ordered-list we need to make sure that we run this parser first.
            priority: 100,
            getAttrs: function () { return ({
                localId: uuid.generate(),
            }); },
        },
    ],
    toDOM: function (node) {
        var localId = node.attrs.localId;
        var attrs = {
            'data-node-type': name,
            'data-decision-list-local-id': localId || 'local-decision-list',
            style: 'list-style: none; padding-left: 0',
        };
        return ['ol', attrs, 0];
    },
};
//# sourceMappingURL=decision-list.js.map
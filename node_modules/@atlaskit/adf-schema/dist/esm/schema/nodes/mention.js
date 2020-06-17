export var USER_TYPES;
(function (USER_TYPES) {
    USER_TYPES["DEFAULT"] = "DEFAULT";
    USER_TYPES["SPECIAL"] = "SPECIAL";
    USER_TYPES["APP"] = "APP";
})(USER_TYPES || (USER_TYPES = {}));
export var mention = {
    inline: true,
    group: 'inline',
    selectable: false,
    attrs: {
        id: { default: '' },
        text: { default: '' },
        accessLevel: { default: '' },
        userType: { default: null },
    },
    parseDOM: [
        {
            tag: 'span[data-mention-id]',
            getAttrs: function (domNode) {
                var dom = domNode;
                var attrs = {
                    id: dom.getAttribute('data-mention-id') || mention.attrs.id.default,
                    text: dom.textContent || mention.attrs.text.default,
                    accessLevel: dom.getAttribute('data-access-level') ||
                        mention.attrs.accessLevel.default,
                };
                var userType = dom.getAttribute('data-user-type');
                if (USER_TYPES[userType]) {
                    attrs.userType = userType;
                }
                return attrs;
            },
        },
    ],
    toDOM: function (node) {
        var _a = node.attrs, id = _a.id, accessLevel = _a.accessLevel, text = _a.text, userType = _a.userType;
        var attrs = {
            'data-mention-id': id,
            'data-access-level': accessLevel,
            contenteditable: 'false',
        };
        if (userType) {
            attrs['data-user-type'] = userType;
        }
        return ['span', attrs, text];
    },
};
var isOptional = function (key) {
    return ['userType'].indexOf(key) > -1;
};
export var toJSON = function (node) { return ({
    attrs: Object.keys(node.attrs).reduce(function (obj, key) {
        if (isOptional(key) && !node.attrs[key]) {
            return obj;
        }
        obj[key] = node.attrs[key];
        return obj;
    }, {}),
}); };
//# sourceMappingURL=mention.js.map
import { acNameToEmoji, acShortcutToEmoji } from '../../utils/confluence/emoji';
export var emoji = {
    inline: true,
    group: 'inline',
    selectable: false,
    attrs: {
        shortName: { default: '' },
        id: { default: '' },
        text: { default: '' },
    },
    parseDOM: [
        {
            tag: 'span[data-emoji-short-name]',
            getAttrs: function (domNode) {
                var dom = domNode;
                return {
                    shortName: dom.getAttribute('data-emoji-short-name') ||
                        emoji.attrs.shortName.default,
                    id: dom.getAttribute('data-emoji-id') || emoji.attrs.id.default,
                    text: dom.getAttribute('data-emoji-text') || emoji.attrs.text.default,
                };
            },
        },
        // Handle copy/paste from old <ac:emoticon />
        {
            tag: 'img[data-emoticon-name]',
            getAttrs: function (dom) {
                return acNameToEmoji(dom.getAttribute('data-emoticon-name'));
            },
        },
        // Handle copy/paste from old <ac:hipchat-emoticons />
        {
            tag: 'img[data-hipchat-emoticon]',
            getAttrs: function (dom) {
                return acShortcutToEmoji(dom.getAttribute('data-hipchat-emoticon'));
            },
        },
        // Handle copy/paste from bitbucket's <img class="emoji" />
        {
            tag: 'img.emoji[data-emoji-short-name]',
            getAttrs: function (domNode) {
                var dom = domNode;
                return {
                    shortName: dom.getAttribute('data-emoji-short-name') ||
                        emoji.attrs.shortName.default,
                    id: dom.getAttribute('data-emoji-id') || emoji.attrs.id.default,
                    text: dom.getAttribute('data-emoji-text') || emoji.attrs.text.default,
                };
            },
        },
    ],
    toDOM: function (node) {
        var _a = node.attrs, shortName = _a.shortName, id = _a.id, text = _a.text;
        var attrs = {
            'data-emoji-short-name': shortName,
            'data-emoji-id': id,
            'data-emoji-text': text,
            contenteditable: 'false',
        };
        return ['span', attrs, text];
    },
};
//# sourceMappingURL=emoji.js.map
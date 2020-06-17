var name = 'unknownBlock';
export default {
    group: 'block',
    content: 'inline+',
    marks: '_',
    toDOM: function () {
        return ['div', { 'data-node-type': name }, 0];
    },
    parseDOM: [{ tag: "div[data-node-type=\"" + name + "\"]" }],
};
//# sourceMappingURL=unknown-block.js.map
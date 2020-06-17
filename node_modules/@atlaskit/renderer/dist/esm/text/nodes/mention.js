var mention = function (node, schema) {
    if (['all', 'here'].indexOf(node.attrs.id) !== -1) {
        return "@" + node.attrs.id;
    }
    return "" + (node.attrs.text || '@unknown');
};
export default mention;
//# sourceMappingURL=mention.js.map
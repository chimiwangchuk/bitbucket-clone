import * as nodes from './nodes';
var typedNodes = nodes;
export var inlineNodes = new Set(Object.keys(typedNodes).filter(function (key) { return typedNodes[key] && typedNodes[key].group === 'inline'; }));
//# sourceMappingURL=inline-nodes.js.map
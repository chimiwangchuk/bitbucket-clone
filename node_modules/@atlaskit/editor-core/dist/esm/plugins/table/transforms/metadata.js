import { pluginKey } from '../pm-plugins/main';
import { fireAnalytics } from './fix-tables';
export var setMeta = function (meta) { return function (tr) {
    if ('problem' in meta) {
        // Send analytics event whenever we encounter with a problem
        fireAnalytics(meta);
    }
    return tr.setMeta(pluginKey, meta);
}; };
//# sourceMappingURL=metadata.js.map
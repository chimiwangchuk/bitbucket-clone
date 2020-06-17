import { __assign, __values } from "tslib";
export function omit(obj) {
    var e_1, _a;
    var keysToOmit = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keysToOmit[_i - 1] = arguments[_i];
    }
    var newObj = __assign({}, obj);
    try {
        for (var keysToOmit_1 = __values(keysToOmit), keysToOmit_1_1 = keysToOmit_1.next(); !keysToOmit_1_1.done; keysToOmit_1_1 = keysToOmit_1.next()) {
            var key = keysToOmit_1_1.value;
            delete newObj[key];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (keysToOmit_1_1 && !keysToOmit_1_1.done && (_a = keysToOmit_1.return)) _a.call(keysToOmit_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return newObj;
}
export function getDisplayName(prefix, Component) {
    var componentName = Component.displayName || Component.name;
    return componentName ? prefix + "(" + componentName + ")" : prefix;
}
//# sourceMappingURL=utils.js.map
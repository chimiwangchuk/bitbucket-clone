import { __values } from "tslib";
import { nextMajorVersion } from '../version-wrapper';
var deprecationWarnings = function (className, props, deprecations) {
    var e_1, _a;
    var nextVersion = nextMajorVersion();
    try {
        for (var deprecations_1 = __values(deprecations), deprecations_1_1 = deprecations_1.next(); !deprecations_1_1.done; deprecations_1_1 = deprecations_1.next()) {
            var deprecation = deprecations_1_1.value;
            var property = deprecation.property, _b = deprecation.type, type = _b === void 0 ? 'enabled by default' : _b, _c = deprecation.description, description = _c === void 0 ? '' : _c, _d = deprecation.condition, condition = _d === void 0 ? function () { return true; } : _d;
            if (props.hasOwnProperty(property)) {
                if (condition(props)) {
                    // eslint-disable-next-line no-console
                    console.warn(property + " property for " + className + " is deprecated. " + description + " [Will be " + type + " in editor-core@" + nextVersion + "]");
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (deprecations_1_1 && !deprecations_1_1.done && (_a = deprecations_1.return)) _a.call(deprecations_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
export default deprecationWarnings;
//# sourceMappingURL=deprecation-warnings.js.map
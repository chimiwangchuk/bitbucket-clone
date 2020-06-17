import { __assign } from "tslib";
var pickBy = function (test, object) {
    return Object.keys(object).reduce(function (obj, key) {
        var _a;
        return test(String(key), object[key]) ? __assign(__assign({}, obj), (_a = {}, _a[key] = object[key], _a)) : obj;
    }, {});
};
export default pickBy;
//# sourceMappingURL=pick-by.js.map
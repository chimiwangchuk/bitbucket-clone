import { __read, __spread } from "tslib";
/**
 * Compose 1 to n functions.
 * @param func first function
 * @param funcs additional functions
 */
export function compose(func) {
    var funcs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        funcs[_i - 1] = arguments[_i];
    }
    var allFuncs = __spread([func], funcs);
    return function composed(raw) {
        return allFuncs.reduceRight(function (memo, func) { return func(memo); }, raw);
    };
}
//# sourceMappingURL=compose.js.map
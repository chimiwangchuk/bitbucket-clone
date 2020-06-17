export var defaultAttributesFn = function (p) { return ({}); };
export var createExtender = function createExtender(defaults, 
/** We're defaulting to an Object.create call here to circumvent
 *  the fact that {} can't be reconciled
 *  with a type that extends Record<string, any>
 *
 *  By doing this, we are intentionally disallowing users
 *  from nullifying a particular component in the tree.
 *  This can be reverted with additional logic,
 *  at such a time as this nullification becomes an actual usecase.
 * */
overrides) {
    if (overrides === void 0) { overrides = Object.create(Object.prototype); }
    if (!defaults) {
        throw new Error('a default set of overrides *must* be passed in as the first argument');
    }
    return function getOverrides(key) {
        var _a = defaults[key], defaultCssFn = _a.cssFn, defaultAttributesFn = _a.attributesFn, defaultComponent = _a.component;
        if (!overrides[key]) {
            return {
                cssFn: defaultCssFn,
                attributesFn: defaultAttributesFn,
                component: defaultComponent,
            };
        }
        var _b = overrides[key], customCssFn = _b.cssFn, customAttributesFn = _b.attributesFn, customComponent = _b.component;
        var composedCssFn = function (state) {
            return customCssFn(defaultCssFn(state), state);
        };
        return {
            cssFn: customCssFn ? composedCssFn : defaultCssFn,
            attributesFn: customAttributesFn || defaultAttributesFn,
            component: customComponent || defaultComponent,
        };
    };
};
//# sourceMappingURL=utils.js.map
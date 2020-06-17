var filterActions = function (actions, data) {
    if (actions === void 0) { actions = []; }
    return actions.filter(function (action) {
        if (!action.shouldRender) {
            return true;
        }
        else if (typeof action.shouldRender !== 'function') {
            return Boolean(action.shouldRender);
        }
        return action.shouldRender(data);
    });
};
export default filterActions;
//# sourceMappingURL=filterActions.js.map
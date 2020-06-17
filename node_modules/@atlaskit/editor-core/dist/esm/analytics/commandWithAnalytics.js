import analyticsService from './service';
export function commandWithAnalytics(analyticsEventName, properties) {
    return function (command) { return function (state, dispatch, view) {
        return command(state, function (tr) {
            if (dispatch) {
                analyticsService.trackEvent(analyticsEventName, properties);
                dispatch(tr);
            }
        }, view);
    }; };
}
//# sourceMappingURL=commandWithAnalytics.js.map
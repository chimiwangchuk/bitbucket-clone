import { __assign } from "tslib";
var AnalyticsEvent = /** @class */ (function () {
    function AnalyticsEvent(props) {
        var _this = this;
        this.clone = function () {
            // We stringify and parse here to get a hacky "deep clone" of the object.
            // This has some limitations in that it wont support functions, regexs, Maps, Sets, etc,
            // but none of those need to be represented in our payload, so we consider this fine
            var payload = JSON.parse(JSON.stringify(_this.payload));
            return new AnalyticsEvent({ payload: payload });
        };
        this.payload = props.payload;
    }
    AnalyticsEvent.prototype.update = function (updater) {
        if (typeof updater === 'function') {
            this.payload = updater(this.payload);
        }
        if (typeof updater === 'object') {
            this.payload = __assign(__assign({}, this.payload), updater);
        }
        return this;
    };
    return AnalyticsEvent;
}());
export default AnalyticsEvent;
//# sourceMappingURL=AnalyticsEvent.js.map
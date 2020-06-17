import { __extends } from "tslib";
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(status, message) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        switch (status) {
            case 400:
            case 403:
            case 404:
                _this.canRetry = false;
                break;
            default:
                _this.canRetry = true;
                break;
        }
        return _this;
    }
    return HttpError;
}(Error));
export { HttpError };
//# sourceMappingURL=HttpError.js.map
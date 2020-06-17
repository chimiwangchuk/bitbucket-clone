import { __assign, __awaiter, __generator } from "tslib";
var ALLOWED_RESPONSE_STATUS_CODES = [200, 401, 404];
export function request(method, url, data) {
    return __awaiter(this, void 0, void 0, function () {
        var requestConfig, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestConfig = __assign({ method: method, credentials: 'include', headers: {
                            Accept: 'application/json',
                            'Cache-Control': 'no-cache',
                            'Content-Type': 'application/json',
                        } }, (data ? { body: JSON.stringify(data) } : {}));
                    return [4 /*yield*/, fetch(url, requestConfig)];
                case 1:
                    response = _a.sent();
                    if (!(response.ok || ALLOWED_RESPONSE_STATUS_CODES.includes(response.status))) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3: throw response;
            }
        });
    });
}
//# sourceMappingURL=api.js.map
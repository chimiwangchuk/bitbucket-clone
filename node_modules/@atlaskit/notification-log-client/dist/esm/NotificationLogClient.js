import { __assign, __awaiter, __generator } from "tslib";
import { utils, } from '@atlaskit/util-service-support';
import { version as npmPackageVersion } from './version.json';
export var DEFAULT_SOURCE = 'atlaskitNotificationLogClient';
var NotificationLogClient = /** @class */ (function () {
    function NotificationLogClient(baseUrl, cloudId, source) {
        if (source === void 0) { source = DEFAULT_SOURCE; }
        this.serviceConfig = { url: baseUrl };
        this.cloudId = cloudId;
        this.source = source;
    }
    NotificationLogClient.prototype.countUnseenNotifications = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var mergedOptions;
            return __generator(this, function (_a) {
                mergedOptions = __assign(__assign({ path: 'api/2/notifications/count/unseen' }, options), { queryParams: __assign({ cloudId: this.cloudId, source: this.source }, (options.queryParams || {})), requestInit: __assign({ mode: 'cors', headers: {
                            'x-app-version': npmPackageVersion + "-" + DEFAULT_SOURCE,
                        } }, (options.requestInit || {})) });
                return [2 /*return*/, utils.requestService(this.serviceConfig, mergedOptions)];
            });
        });
    };
    return NotificationLogClient;
}());
export default NotificationLogClient;
//# sourceMappingURL=NotificationLogClient.js.map
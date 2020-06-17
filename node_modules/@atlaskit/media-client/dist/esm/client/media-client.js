import { __awaiter, __generator } from "tslib";
import { EventEmitter2 } from 'eventemitter2';
import { MediaStore, } from './media-store';
import { CollectionFetcher } from './collection-fetcher';
import { FileFetcherImpl } from './file-fetcher';
var MediaClient = /** @class */ (function () {
    function MediaClient(mediaClientConfig) {
        this.mediaClientConfig = mediaClientConfig;
        this.mediaStore = new MediaStore({
            authProvider: mediaClientConfig.authProvider,
        });
        this.config = mediaClientConfig;
        this.collection = new CollectionFetcher(this.mediaStore);
        this.file = new FileFetcherImpl(this.mediaStore);
        this.eventEmitter = new EventEmitter2();
    }
    MediaClient.prototype.getImage = function (id, params, controller, fetchMaxRes) {
        return this.mediaStore.getImage(id, params, controller, fetchMaxRes);
    };
    MediaClient.prototype.getImageUrl = function (id, params) {
        return this.mediaStore.getFileImageURL(id, params);
    };
    MediaClient.prototype.getImageMetadata = function (id, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mediaStore.getImageMetadata(id, params)];
                    case 1: return [2 /*return*/, (_a.sent()).metadata];
                }
            });
        });
    };
    MediaClient.prototype.on = function (event, listener) {
        this.eventEmitter.on(event, listener);
    };
    MediaClient.prototype.off = function (event, listener) {
        this.eventEmitter.off(event, listener);
    };
    MediaClient.prototype.emit = function (event, payload) {
        return this.eventEmitter.emit(event, payload);
    };
    return MediaClient;
}());
export { MediaClient };
//# sourceMappingURL=media-client.js.map
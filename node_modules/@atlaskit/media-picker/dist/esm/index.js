import { __awaiter, __generator, __read } from "tslib";
export { isImagePreview } from './domain/preview';
export function MediaPicker(mediaClientConfig, pickerConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, PopupImpl, getMediaClient, mediaClient;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        import(
                        /* webpackChunkName:"@atlaskit-internal_media-picker-popup" */ './components/popup'),
                        import(
                        /* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
                    ])];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), PopupImpl = _a[0].PopupImpl, getMediaClient = _a[1].getMediaClient;
                    mediaClient = getMediaClient(mediaClientConfig);
                    return [2 /*return*/, new PopupImpl(mediaClient, pickerConfig)];
            }
        });
    });
}
// REACT COMPONENTS
export { DropzoneLoader as Dropzone } from './components/dropzone';
export { ClipboardLoader as Clipboard } from './components/clipboard';
export { BrowserLoader as Browser } from './components/browser';
//# sourceMappingURL=index.js.map
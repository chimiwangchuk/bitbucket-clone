import { __assign, __awaiter, __extends, __generator, __read } from "tslib";
import React from 'react';
var DropzoneLoader = /** @class */ (function (_super) {
    __extends(DropzoneLoader, _super);
    function DropzoneLoader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            Dropzone: DropzoneLoader.Dropzone,
            MediaPickerErrorBoundary: DropzoneLoader.MediaPickerErrorBoundary,
        };
        return _this;
    }
    DropzoneLoader.prototype.UNSAFE_componentWillMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mediaClient, dropzoneModule, mediaPickerErrorBoundaryModule, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(!this.state.Dropzone || !this.state.MediaPickerErrorBoundary)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                import(
                                /* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
                                import(
                                /* webpackChunkName:"@atlaskit-internal_Dropzone" */ './dropzone'),
                                import(
                                /* webpackChunkName:"@atlaskit-internal_MediaPickerErrorBoundary" */ '../media-picker-analytics-error-boundary'),
                            ])];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 3]), mediaClient = _a[0], dropzoneModule = _a[1], mediaPickerErrorBoundaryModule = _a[2];
                        DropzoneLoader.Dropzone = mediaClient.withMediaClient(dropzoneModule.Dropzone);
                        DropzoneLoader.MediaPickerErrorBoundary =
                            mediaPickerErrorBoundaryModule.default;
                        this.setState({
                            Dropzone: DropzoneLoader.Dropzone,
                            MediaPickerErrorBoundary: DropzoneLoader.MediaPickerErrorBoundary,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DropzoneLoader.prototype.render = function () {
        var _a = this.state, Dropzone = _a.Dropzone, MediaPickerErrorBoundary = _a.MediaPickerErrorBoundary;
        if (!Dropzone || !MediaPickerErrorBoundary) {
            return null;
        }
        return (React.createElement(MediaPickerErrorBoundary, null,
            React.createElement(Dropzone, __assign({}, this.props))));
    };
    DropzoneLoader.displayName = 'AsyncDropzone';
    return DropzoneLoader;
}(React.PureComponent));
export { DropzoneLoader };
//# sourceMappingURL=index.js.map
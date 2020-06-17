import { __assign, __awaiter, __extends, __generator, __read } from "tslib";
import React from 'react';
var ClipboardLoader = /** @class */ (function (_super) {
    __extends(ClipboardLoader, _super);
    function ClipboardLoader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            Clipboard: ClipboardLoader.Clipboard,
        };
        return _this;
    }
    ClipboardLoader.prototype.UNSAFE_componentWillMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mediaClient, clipboardModule;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.state.Clipboard) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all([
                                import(
                                /* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
                                import(
                                /* webpackChunkName:"@atlaskit-internal_Clipboard" */ './clipboard'),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), mediaClient = _a[0], clipboardModule = _a[1];
                        ClipboardLoader.Clipboard = mediaClient.withMediaClient(clipboardModule.Clipboard);
                        this.setState({
                            Clipboard: ClipboardLoader.Clipboard,
                        });
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ClipboardLoader.prototype.render = function () {
        if (!this.state.Clipboard) {
            return null;
        }
        return React.createElement(this.state.Clipboard, __assign({}, this.props));
    };
    ClipboardLoader.displayName = 'AsyncClipboard';
    return ClipboardLoader;
}(React.PureComponent));
export { ClipboardLoader };
//# sourceMappingURL=index.js.map
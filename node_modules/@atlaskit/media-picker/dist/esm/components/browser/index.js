import { __assign, __awaiter, __extends, __generator, __read } from "tslib";
import React from 'react';
var BrowserLoader = /** @class */ (function (_super) {
    __extends(BrowserLoader, _super);
    function BrowserLoader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mounted = false;
        _this.state = {
            Browser: BrowserLoader.Browser,
        };
        return _this;
    }
    BrowserLoader.prototype.componentDidMount = function () {
        this.mounted = true;
    };
    BrowserLoader.prototype.componentWillUnmount = function () {
        this.mounted = false;
    };
    BrowserLoader.prototype.UNSAFE_componentWillMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mediaClient, browserModule;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.state.Browser) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all([
                                import(
                                /* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
                                import(/* webpackChunkName:"@atlaskit-internal_Browser" */ './browser'),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), mediaClient = _a[0], browserModule = _a[1];
                        BrowserLoader.Browser = mediaClient.withMediaClient(browserModule.Browser);
                        if (this.mounted) {
                            this.setState({
                                Browser: BrowserLoader.Browser,
                            });
                        }
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    BrowserLoader.prototype.render = function () {
        if (!this.state.Browser) {
            return null;
        }
        return React.createElement(this.state.Browser, __assign({}, this.props));
    };
    BrowserLoader.displayName = 'AsyncBrowser';
    return BrowserLoader;
}(React.PureComponent));
export { BrowserLoader };
//# sourceMappingURL=index.js.map
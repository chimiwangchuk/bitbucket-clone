import { __assign, __extends } from "tslib";
import React, { Component } from 'react';
import { getDisplayName } from '../utils';
export default function mapProps(mapping) {
    return function (DecoratedComponent) { var _a; return _a = /** @class */ (function (_super) {
            __extends(MapProps, _super);
            function MapProps() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                // expose blur/focus to consumers via ref
                _this.blur = function () {
                    // @ts-ignore accessing component internals
                    if (_this.component && _this.component.blur)
                        _this.component.blur();
                };
                _this.focus = function () {
                    // @ts-ignore accessing component internals
                    if (_this.component && _this.component.focus)
                        _this.component.focus();
                };
                _this.setComponent = function (component) {
                    _this.component = component;
                };
                return _this;
            }
            MapProps.prototype.render = function () {
                var _this = this;
                var mapped = __assign(__assign({}, this.props), Object.keys(mapping).reduce(function (acc, key) {
                    var _a;
                    return (__assign(__assign({}, acc), (_a = {}, _a[key] = mapping[key](_this.props), _a)));
                }, {}));
                return React.createElement(DecoratedComponent, __assign({ ref: this.setComponent }, mapped));
            };
            return MapProps;
        }(Component)),
        _a.displayName = getDisplayName('mapProps', DecoratedComponent),
        _a.DecoratedComponent = DecoratedComponent,
        _a; };
}
//# sourceMappingURL=mapProps.js.map
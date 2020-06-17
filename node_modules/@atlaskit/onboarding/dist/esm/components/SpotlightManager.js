import { __assign, __extends } from "tslib";
import React, { PureComponent, createContext, } from 'react';
import memoizeOne from 'memoize-one';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';
import { Fade } from './Animation';
import Blanket from '../styled/Blanket';
var noop = function () { };
var _a = createContext(undefined), TargetConsumer = _a.Consumer, TargetProvider = _a.Provider;
var _b = createContext({
    opened: noop,
    closed: noop,
    targets: {},
}), SpotlightStateConsumer = _b.Consumer, SpotlightStateProvider = _b.Provider;
export { TargetConsumer };
export { SpotlightStateConsumer as SpotlightConsumer };
var Container = function (_a) {
    var Wrapper = _a.component, children = _a.children;
    return React.createElement(Wrapper, null, children);
};
var SpotlightManager = /** @class */ (function (_super) {
    __extends(SpotlightManager, _super);
    function SpotlightManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            spotlightCount: 0,
            targets: {},
        };
        _this.targetRef = function (name) { return function (element) {
            _this.setState(function (state) {
                var _a;
                return ({
                    targets: __assign(__assign({}, state.targets), (_a = {}, _a[name] = element || undefined, _a)),
                });
            });
        }; };
        _this.spotlightOpen = function () {
            _this.setState(function (state) { return ({ spotlightCount: state.spotlightCount + 1 }); });
        };
        _this.spotlightClose = function () {
            _this.setState(function (state) { return ({ spotlightCount: state.spotlightCount - 1 }); });
        };
        _this.getStateProviderValue = memoizeOne(function (targets) { return ({
            opened: _this.spotlightOpen,
            closed: _this.spotlightClose,
            targets: targets,
        }); });
        return _this;
    }
    SpotlightManager.prototype.componentDidMount = function () {
        if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
            if (this.props.component) {
                // eslint-disable-next-line no-console
                console.warn("Atlaskit: The SpotlightManager 'component' prop is deprecated. Please wrap the SpotlightManager in the component instead.");
            }
        }
    };
    SpotlightManager.prototype.render = function () {
        var _a = this.props, blanketIsTinted = _a.blanketIsTinted, children = _a.children, Tag = _a.component;
        return (React.createElement(SpotlightStateProvider, { value: this.getStateProviderValue(this.state.targets) },
            React.createElement(TargetProvider, { value: this.targetRef },
                React.createElement(Container, { component: Tag || React.Fragment },
                    React.createElement(Fade, { in: this.state.spotlightCount > 0 }, function (animationStyles) { return (React.createElement(Portal, { zIndex: layers.spotlight() },
                        React.createElement(Blanket, { style: animationStyles, isTinted: blanketIsTinted }))); }),
                    children))));
    };
    SpotlightManager.defaultProps = {
        blanketIsTinted: true,
    };
    return SpotlightManager;
}(PureComponent));
export default SpotlightManager;
//# sourceMappingURL=SpotlightManager.js.map
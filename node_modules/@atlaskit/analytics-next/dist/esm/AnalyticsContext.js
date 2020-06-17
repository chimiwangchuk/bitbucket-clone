import { __extends, __read, __spread } from "tslib";
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { AnalyticsReactContext } from './AnalyticsReactContext';
var ContextTypes = {
    getAtlaskitAnalyticsContext: PropTypes.func,
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
};
var AnalyticsContext = /** @class */ (function (_super) {
    __extends(AnalyticsContext, _super);
    function AnalyticsContext(props) {
        var _this = _super.call(this, props) || this;
        _this.getChildContext = function () { return ({
            getAtlaskitAnalyticsContext: _this.getAnalyticsContext,
        }); };
        _this.getAnalyticsContext = function () {
            var data = _this.props.data;
            var getAtlaskitAnalyticsContext = _this.context.getAtlaskitAnalyticsContext;
            var ancestorData = (typeof getAtlaskitAnalyticsContext === 'function' &&
                getAtlaskitAnalyticsContext()) ||
                [];
            return __spread(ancestorData, [data]);
        };
        _this.getAnalyticsEventHandlers = function () {
            var getAtlaskitAnalyticsEventHandlers = _this.context.getAtlaskitAnalyticsEventHandlers;
            var ancestorHandlers = (typeof getAtlaskitAnalyticsEventHandlers === 'function' &&
                getAtlaskitAnalyticsEventHandlers()) ||
                [];
            return ancestorHandlers;
        };
        _this.state = {
            getAtlaskitAnalyticsContext: _this.getAnalyticsContext,
            getAtlaskitAnalyticsEventHandlers: _this.getAnalyticsEventHandlers,
        };
        return _this;
    }
    AnalyticsContext.prototype.render = function () {
        var children = this.props.children;
        return (React.createElement(AnalyticsReactContext.Provider, { value: this.state }, Children.only(children)));
    };
    AnalyticsContext.contextTypes = ContextTypes;
    AnalyticsContext.childContextTypes = ContextTypes;
    return AnalyticsContext;
}(Component));
export default AnalyticsContext;
//# sourceMappingURL=AnalyticsContext.js.map
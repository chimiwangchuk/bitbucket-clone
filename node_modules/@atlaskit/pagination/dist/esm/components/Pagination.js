import { __assign, __extends } from "tslib";
import React, { Component, Fragment } from 'react';
import { withAnalyticsEvents, withAnalyticsContext, createAndFireEvent, } from '@atlaskit/analytics-next';
import PageComponent from './Page';
import { LeftNavigator, RightNavigator } from './Navigators';
import renderDefaultEllipsis from './renderEllipsis';
import collapseRangeHelper from '../util/collapseRange';
import { name as packageName, version as packageVersion, } from '../version.json';
var Pagination = /** @class */ (function (_super) {
    __extends(Pagination, _super);
    function Pagination() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            selectedIndex: _this.props.defaultSelectedIndex || 0,
        };
        _this.createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
        _this.onChangeAnalyticsCaller = function () {
            var createAnalyticsEvent = _this.props.createAnalyticsEvent;
            if (createAnalyticsEvent) {
                return _this.createAndFireEventOnAtlaskit({
                    action: 'changed',
                    actionSubject: 'pageNumber',
                    attributes: {
                        componentName: 'pagination',
                        packageName: packageName,
                        packageVersion: packageVersion,
                    },
                })(createAnalyticsEvent);
            }
            return undefined;
        };
        _this.onChange = function (event, newSelectedPage) {
            if (_this.props.selectedIndex === undefined) {
                _this.setState({
                    selectedIndex: newSelectedPage,
                });
            }
            var analyticsEvent = _this.onChangeAnalyticsCaller();
            if (_this.props.onChange) {
                _this.props.onChange(event, _this.props.pages[newSelectedPage], analyticsEvent);
            }
        };
        _this.pagesToComponents = function (pages) {
            var selectedIndex = _this.state.selectedIndex;
            var _a = _this.props, components = _a.components, getPageLabel = _a.getPageLabel;
            return pages.map(function (page, index) {
                return (React.createElement(PageComponent, { key: "page-" + (getPageLabel ? getPageLabel(page, index) : index), component: components.Page, onClick: function (event) { return _this.onChange(event, index); }, isSelected: selectedIndex === index, page: page }, getPageLabel ? getPageLabel(page, index) : page));
            });
        };
        _this.renderPages = function () {
            var selectedIndex = _this.state.selectedIndex;
            var _a = _this.props, pages = _a.pages, max = _a.max, collapseRange = _a.collapseRange, renderEllipsis = _a.renderEllipsis;
            var pagesComponents = _this.pagesToComponents(pages);
            // @ts-ignore
            return collapseRange(pagesComponents, selectedIndex, {
                max: max,
                ellipsis: renderEllipsis,
            });
        };
        _this.renderLeftNavigator = function () {
            var _a = _this.props, components = _a.components, pages = _a.pages, i18n = _a.i18n;
            var selectedIndex = _this.state.selectedIndex;
            var props = {
                'aria-label': i18n.prev,
                pages: pages,
            };
            return (React.createElement(LeftNavigator, __assign({ key: "left-navigator", component: components.Previous, onClick: function (event) { return _this.onChange(event, selectedIndex - 1); }, isDisabled: selectedIndex === 0 }, props)));
        };
        _this.renderRightNavigator = function () {
            var _a = _this.props, components = _a.components, pages = _a.pages, i18n = _a.i18n;
            var selectedIndex = _this.state.selectedIndex;
            var props = {
                'aria-label': i18n.next,
                pages: pages,
            };
            return (React.createElement(RightNavigator, __assign({ key: "right-navigator", component: components.Next, onClick: function (event) { return _this.onChange(event, selectedIndex + 1); }, isDisabled: selectedIndex === pages.length - 1 }, props)));
        };
        return _this;
    }
    Pagination.getDerivedStateFromProps = function (props) {
        // selectedIndex is controlled
        if (props.selectedIndex != null) {
            return {
                selectedIndex: props.selectedIndex,
            };
        }
        return null;
    };
    Pagination.prototype.render = function () {
        var innerStyles = this.props.innerStyles;
        return (React.createElement("div", { style: __assign({ display: 'flex' }, innerStyles) },
            React.createElement(Fragment, null,
                this.renderLeftNavigator(),
                this.renderPages(),
                this.renderRightNavigator())));
    };
    Pagination.defaultProps = {
        collapseRange: collapseRangeHelper,
        components: {},
        defaultSelectedIndex: 0,
        i18n: {
            prev: 'previous',
            next: 'next',
        },
        innerStyles: {},
        max: 7,
        onChange: function () { },
        renderEllipsis: renderDefaultEllipsis,
    };
    return Pagination;
}(Component));
export default withAnalyticsContext({
    componentName: 'pagination',
    packageName: packageName,
    packageVersion: packageVersion,
})(withAnalyticsEvents()(Pagination));
//# sourceMappingURL=Pagination.js.map
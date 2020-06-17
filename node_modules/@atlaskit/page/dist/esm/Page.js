import { __extends, __makeTemplateObject } from "tslib";
import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  min-height: 100%;\n  width: 100%;\n"], ["\n  display: flex;\n  flex-direction: column;\n  min-height: 100%;\n  width: 100%;\n"])));
var NavigationAndContent = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex: 1 1 auto;\n"], ["\n  display: flex;\n  flex: 1 1 auto;\n"])));
var BannerContainer = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  flex: 1 0 auto;\n  transition: height 0.25s ease-in-out;\n  height: ", "px;\n  position: relative;\n  width: 100%;\n  z-index: 3;\n"], ["\n  flex: 1 0 auto;\n  transition: height 0.25s ease-in-out;\n  height: ", "px;\n  position: relative;\n  width: 100%;\n  z-index: 3;\n"])), function (props) { return (props.isBannerOpen ? props.bannerHeight : 0); });
var Banner = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: fixed;\n  width: 100%;\n"], ["\n  position: fixed;\n  width: 100%;\n"])));
var Navigation = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n  z-index: 2;\n"], ["\n  position: relative;\n  z-index: 2;\n"])));
var PageContent = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  flex: 1 1 auto;\n  position: relative;\n  z-index: 1;\n  min-width: 0;\n"], ["\n  flex: 1 1 auto;\n  position: relative;\n  z-index: 1;\n  min-width: 0;\n"])));
var emptyTheme = {};
var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Page.prototype.render = function () {
        var _a = this.props, isBannerOpen = _a.isBannerOpen, banner = _a.banner, navigation = _a.navigation, children = _a.children, bannerHeight = _a.bannerHeight;
        return (React.createElement(ThemeProvider, { theme: emptyTheme },
            React.createElement(Wrapper, null,
                this.props.banner ? (React.createElement(BannerContainer, { "aria-hidden": !isBannerOpen, isBannerOpen: isBannerOpen, bannerHeight: bannerHeight },
                    React.createElement(Banner, null, banner))) : null,
                React.createElement(NavigationAndContent, null,
                    React.createElement(Navigation, null, navigation),
                    React.createElement(PageContent, null, children)))));
    };
    Page.displayName = 'AkPage';
    Page.defaultProps = {
        isBannerOpen: false,
        bannerHeight: 52,
    };
    return Page;
}(Component));
export default Page;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=Page.js.map
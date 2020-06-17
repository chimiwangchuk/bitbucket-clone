import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { jsx as ___EmotionJSX } from "@emotion/core";

/**
 * NOTE: 'GlobalNav' is the layout primitive, which will be wrapped by the more
 * opinionated 'GlobalNavigation' component.
 */
import React, { Component, Fragment } from 'react';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { FirstPrimaryItemWrapper, PrimaryItemsList, SecondaryItemsList } from './primitives';

var GlobalNavigation =
/*#__PURE__*/
function (_Component) {
  _inherits(GlobalNavigation, _Component);

  function GlobalNavigation() {
    _classCallCheck(this, GlobalNavigation);

    return _possibleConstructorReturn(this, _getPrototypeOf(GlobalNavigation).apply(this, arguments));
  }

  _createClass(GlobalNavigation, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          ItemComponent = _this$props.itemComponent,
          primaryItems = _this$props.primaryItems,
          secondaryItems = _this$props.secondaryItems,
          theme = _this$props.theme;
      var wrapperStyles = theme.mode.globalNav({
        topOffset: theme.topOffset
      });
      return ___EmotionJSX(NavigationAnalyticsContext, {
        data: {
          attributes: {
            navigationLayer: 'global'
          },
          componentName: 'globalNav'
        }
      }, ___EmotionJSX("div", {
        css: wrapperStyles
      }, ___EmotionJSX(PrimaryItemsList, null, ___EmotionJSX(NavigationAnalyticsContext, {
        data: {
          attributes: {
            navigationIconGrouping: 'primary'
          }
        }
      }, ___EmotionJSX(Fragment, null, primaryItems.map(function (props, index) {
        // Render the first item with a margin beneath it and a large icon
        if (!index) {
          var Icon = props.icon,
              rest = _objectWithoutProperties(props, ["icon"]);

          return ___EmotionJSX(FirstPrimaryItemWrapper, {
            key: props.id
          }, ___EmotionJSX(ItemComponent, _extends({}, rest, {
            icon: function icon(provided) {
              return ___EmotionJSX(Icon, _extends({}, provided, {
                size: "large"
              }));
            },
            size: "large",
            index: index
          })));
        }

        return ___EmotionJSX(ItemComponent, _extends({}, props, {
          key: props.id,
          size: "small",
          index: index
        }));
      })))), ___EmotionJSX(SecondaryItemsList, null, ___EmotionJSX(NavigationAnalyticsContext, {
        data: {
          attributes: {
            navigationIconGrouping: 'secondary'
          }
        }
      }, ___EmotionJSX(Fragment, null, secondaryItems.map(function (props, index) {
        return ___EmotionJSX(ItemComponent, _extends({}, props, {
          key: props.id,
          size: "small",
          index: index
        }));
      }))))));
    }
  }]);

  return GlobalNavigation;
}(Component);

export { GlobalNavigation as default };
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import { jsx as ___EmotionJSX } from "@emotion/core";
import React, { Component, Fragment } from 'react';
import deepEqual from 'react-fast-compare';
import Transition from 'react-transition-group/Transition';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { transitionDurationMs } from '../../../common/constants';
import { ContainerNavigation, ProductNavigation } from './primitives';

var ToggleContent = function ToggleContent(_ref) {
  var isVisible = _ref.isVisible,
      EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE = _ref.experimental_hideNavVisuallyOnCollapse,
      rest = _objectWithoutProperties(_ref, ["isVisible", "experimental_hideNavVisuallyOnCollapse"]);

  // If FF is false, retain the old behaviour of
  // un-mounting navigation components on collapse
  if (!EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE && !isVisible) {
    return null;
  }

  return ___EmotionJSX(Fragment, rest);
};

var productNavigationAnalytics = {
  attributes: {
    navigationLayer: 'product'
  }
};
var containerNavigationAnalytics = {
  attributes: {
    navigationLayer: 'container'
  }
};

var ContentNavigation =
/*#__PURE__*/
function (_Component) {
  _inherits(ContentNavigation, _Component);

  function ContentNavigation() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ContentNavigation);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ContentNavigation)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "isMounted", false);

    _defineProperty(_assertThisInitialized(_this), "state", {
      cachedContainer: null
    });

    return _this;
  }

  _createClass(ContentNavigation, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.isMounted = true;
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var props = this.props;
      return !deepEqual(props, nextProps);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          container = _this$props.container,
          isVisible = _this$props.isVisible,
          Product = _this$props.product,
          EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE = _this$props.experimental_hideNavVisuallyOnCollapse;
      var CachedContainer = this.state.cachedContainer;
      var shouldRenderContainer = Boolean(container);
      var ContainerComponent = CachedContainer || Fragment;
      return ___EmotionJSX(Fragment, null, ___EmotionJSX(ProductNavigation, {
        isVisible: isVisible
      }, ___EmotionJSX(ToggleContent, {
        experimental_hideNavVisuallyOnCollapse: EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE,
        isVisible: isVisible
      }, ___EmotionJSX(NavigationAnalyticsContext, {
        data: productNavigationAnalytics
      }, ___EmotionJSX(Product, null)))), ___EmotionJSX(Transition, {
        in: shouldRenderContainer,
        timeout: this.isMounted ? transitionDurationMs : 0,
        mountOnEnter: true,
        unmountOnExit: true
      }, function (state) {
        return ___EmotionJSX(ContainerNavigation, {
          isEntering: state === 'entering',
          isExiting: state === 'exiting',
          isVisible: isVisible
        }, ___EmotionJSX(ToggleContent, {
          experimental_hideNavVisuallyOnCollapse: EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE,
          isVisible: isVisible
        }, ___EmotionJSX(NavigationAnalyticsContext, {
          data: containerNavigationAnalytics
        }, ___EmotionJSX(ContainerComponent, null))));
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(_ref2, state) {
      var container = _ref2.container;

      if (container && container !== state.cachedContainer) {
        // We cache the most recent container component in state so that we can
        // render it while the container layer is transitioning out, which is
        // triggered by setting the container prop to null.
        return _objectSpread({}, state, {
          cachedContainer: container
        });
      }

      return null;
    }
  }]);

  return ContentNavigation;
}(Component);

export { ContentNavigation as default };
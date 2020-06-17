import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { jsx as ___EmotionJSX } from "@emotion/core";
import React, { Component } from 'react';
import { withNavigationUIController } from '../../../ui-controller';
import LayoutManager from './LayoutManager';

function defaultTooltipContent(isCollapsed) {
  return isCollapsed ? {
    text: 'Expand',
    char: '['
  } : {
    text: 'Collapse',
    char: '['
  };
}

var LayoutManagerWithNavigationUIController = withNavigationUIController(LayoutManager);

var ConnectedLayoutManager =
/*#__PURE__*/
function (_Component) {
  _inherits(ConnectedLayoutManager, _Component);

  function ConnectedLayoutManager() {
    _classCallCheck(this, ConnectedLayoutManager);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectedLayoutManager).apply(this, arguments));
  }

  _createClass(ConnectedLayoutManager, [{
    key: "render",
    value: function render() {
      return ___EmotionJSX(LayoutManagerWithNavigationUIController, this.props);
    }
  }]);

  return ConnectedLayoutManager;
}(Component);

_defineProperty(ConnectedLayoutManager, "defaultProps", {
  collapseToggleTooltipContent: defaultTooltipContent,
  experimental_alternateFlyoutBehaviour: false,
  experimental_flyoutOnHover: false,
  experimental_fullWidthFlyout: false,
  experimental_hideNavVisuallyOnCollapse: false,
  experimental_horizontalGlobalNav: false,
  topOffset: 0
});

export { ConnectedLayoutManager as default };
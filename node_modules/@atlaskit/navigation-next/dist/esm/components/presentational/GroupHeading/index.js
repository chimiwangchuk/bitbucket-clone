import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { jsx as ___EmotionJSX } from "@emotion/core";
import React, { Component } from 'react';
import { withContentTheme } from '../../../theme';

var GroupHeadingPrimitive = function GroupHeadingPrimitive(_ref) {
  var After = _ref.after,
      children = _ref.children,
      theme = _ref.theme;
  var mode = theme.mode,
      context = theme.context;
  var styles = mode.heading()[context];
  return ___EmotionJSX("div", {
    css: styles.headingBase
  }, ___EmotionJSX("div", {
    css: styles.textWrapper
  }, children), !!After && ___EmotionJSX("div", {
    css: styles.afterWrapper
  }, ___EmotionJSX(After, null)));
};

var GroupHeadingPrimitiveWithTheme = withContentTheme(GroupHeadingPrimitive); // TODO: This component is only defined to pass correct props to our prop docs
// as we require classes for them. Remove once we fix this on the prop doc level.

var GroupHeading =
/*#__PURE__*/
function (_Component) {
  _inherits(GroupHeading, _Component);

  function GroupHeading() {
    _classCallCheck(this, GroupHeading);

    return _possibleConstructorReturn(this, _getPrototypeOf(GroupHeading).apply(this, arguments));
  }

  _createClass(GroupHeading, [{
    key: "render",
    value: function render() {
      return ___EmotionJSX(GroupHeadingPrimitiveWithTheme, this.props);
    }
  }]);

  return GroupHeading;
}(Component);

export { GroupHeading as default };
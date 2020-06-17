import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { jsx as ___EmotionJSX } from "@emotion/core";
import React, { Component } from 'react';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { ClassNames } from '@emotion/core';
import Section from '../Section';
var gridSize = gridSizeFn();

var MenuSection =
/*#__PURE__*/
function (_Component) {
  _inherits(MenuSection, _Component);

  function MenuSection() {
    _classCallCheck(this, MenuSection);

    return _possibleConstructorReturn(this, _getPrototypeOf(MenuSection).apply(this, arguments));
  }

  _createClass(MenuSection, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          alwaysShowScrollHint = _this$props.alwaysShowScrollHint,
          id = _this$props.id,
          children = _this$props.children,
          parentId = _this$props.parentId;
      return ___EmotionJSX(Section, {
        id: id,
        parentId: parentId,
        alwaysShowScrollHint: alwaysShowScrollHint,
        shouldGrow: true
      }, function (_ref) {
        var css = _ref.css;

        var menuCss = _objectSpread({}, css, {
          paddingBottom: gridSize * 1.5
        });

        return ___EmotionJSX(ClassNames, null, function (_ref2) {
          var getClassName = _ref2.css;
          return children({
            css: menuCss,
            className: getClassName(menuCss)
          });
        });
      });
    }
  }]);

  return MenuSection;
}(Component);

_defineProperty(MenuSection, "defaultProps", {
  alwaysShowScrollHint: false
});

export { MenuSection as default };
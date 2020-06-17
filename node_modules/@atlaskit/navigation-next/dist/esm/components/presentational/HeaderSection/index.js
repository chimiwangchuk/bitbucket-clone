import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { jsx as ___EmotionJSX } from "@emotion/core";
import React, { Component } from 'react';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { ClassNames } from '@emotion/core';
import Section from '../Section';
var gridSize = gridSizeFn();

var HeaderSection =
/*#__PURE__*/
function (_Component) {
  _inherits(HeaderSection, _Component);

  function HeaderSection() {
    _classCallCheck(this, HeaderSection);

    return _possibleConstructorReturn(this, _getPrototypeOf(HeaderSection).apply(this, arguments));
  }

  _createClass(HeaderSection, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          id = _this$props.id,
          parentId = _this$props.parentId;
      return ___EmotionJSX(Section, {
        id: id,
        key: id,
        parentId: parentId
      }, function (_ref) {
        var css = _ref.css;

        var headerCss = _objectSpread({}, css, {
          paddingTop: gridSize * 2.5
        });

        return ___EmotionJSX(ClassNames, null, function (_ref2) {
          var getClassName = _ref2.css;
          return children({
            css: headerCss,
            className: getClassName(headerCss)
          });
        });
      });
    }
  }]);

  return HeaderSection;
}(Component);

export { HeaderSection as default };
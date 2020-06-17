import _extends from "@babel/runtime/helpers/extends";
import { jsx as ___EmotionJSX } from "@emotion/core";
import React from 'react';
import UIControllerSubscriber from './UIControllerSubscriber';
export default (function (WrappedComponent) {
  var withNavigationUIController = function withNavigationUIController(props) {
    return ___EmotionJSX(UIControllerSubscriber, null, function (navigationUIController) {
      return ___EmotionJSX(WrappedComponent, _extends({
        navigationUIController: navigationUIController
      }, props));
    });
  };

  withNavigationUIController.displayName = "WithNavigationUIController(".concat(WrappedComponent.displayName || WrappedComponent.name, ")");
  return withNavigationUIController;
});
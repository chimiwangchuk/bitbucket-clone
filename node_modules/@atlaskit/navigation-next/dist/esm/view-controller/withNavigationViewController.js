import _extends from "@babel/runtime/helpers/extends";
import { jsx as ___EmotionJSX } from "@emotion/core";
import React from 'react';
import ViewControllerSubscriber from './ViewControllerSubscriber';
export default (function (WrappedComponent) {
  var WithNavigationViewController = function WithNavigationViewController(props) {
    return ___EmotionJSX(ViewControllerSubscriber, null, function (navigationViewController) {
      return ___EmotionJSX(WrappedComponent, _extends({
        navigationViewController: navigationViewController
      }, props));
    });
  };

  WithNavigationViewController.displayName = "WithNavigationViewController(".concat(WrappedComponent.displayName || WrappedComponent.name, ")");
  return WithNavigationViewController;
});
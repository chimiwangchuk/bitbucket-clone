import { jsx as ___EmotionJSX } from "@emotion/core";
import React from 'react';
import { Subscribe } from 'unstated';
import UIController from './UIController';
var to = [UIController];

var UIControllerSubscriber = function UIControllerSubscriber(_ref) {
  var children = _ref.children;
  return ___EmotionJSX(Subscribe, {
    to: to
  }, children);
};

export default UIControllerSubscriber;
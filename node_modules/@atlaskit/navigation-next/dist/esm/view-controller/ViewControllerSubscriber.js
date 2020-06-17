import _extends from "@babel/runtime/helpers/extends";
import { jsx as ___EmotionJSX } from "@emotion/core";
import React from 'react';
import { Subscribe } from 'unstated';
import ViewController from './ViewController';
var to = [ViewController];

var ViewControllerSubscriber = function ViewControllerSubscriber(props) {
  return ___EmotionJSX(Subscribe, _extends({
    to: to
  }, props));
};

export default ViewControllerSubscriber;
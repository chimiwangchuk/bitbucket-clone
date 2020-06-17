import _objectSpread from "@babel/runtime/helpers/objectSpread";
import { applyDisabledProperties } from '../../../common/helpers';
export var pageContainerCSS = function pageContainerCSS(_ref) {
  var disableInteraction = _ref.disableInteraction,
      leftOffset = _ref.leftOffset,
      topOffset = _ref.topOffset;
  return _objectSpread({
    flex: '1 1 auto',
    marginLeft: leftOffset,
    marginTop: topOffset,
    width: 0
  }, applyDisabledProperties(!!disableInteraction));
};
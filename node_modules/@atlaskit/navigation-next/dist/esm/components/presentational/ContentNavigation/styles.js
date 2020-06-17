import _objectSpread from "@babel/runtime/helpers/objectSpread";
import { N20, N500 } from '@atlaskit/theme/colors';
import { CONTENT_NAV_WIDTH } from '../../../common/constants';
var baseStyles = {
  boxSizing: 'border-box',
  height: '100%',
  left: 0,
  minWidth: CONTENT_NAV_WIDTH,
  overflowX: 'hidden',
  position: 'absolute',
  top: 0,
  width: '100%'
};
export default (function (_ref) {
  var product = _ref.product;
  return function () {
    return {
      container: _objectSpread({}, baseStyles, {
        backgroundColor: N20,
        color: N500
      }),
      product: _objectSpread({}, baseStyles, {
        backgroundColor: product.background.default,
        color: product.text.default
      })
    };
  };
});
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { N40 } from '@atlaskit/theme/colors';
var gridSize = gridSizeFn(); // These are the styles which are consistent regardless of theme

var baseStyles = {
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    height: "".concat(gridSize * 5, "px"),
    paddingLeft: "".concat(gridSize * 1.5, "px"),
    paddingRight: "".concat(gridSize * 1.5, "px"),
    opacity: 0.5
  },
  before: {
    backgroundColor: 'red',
    borderRadius: '50%',
    flexShrink: 0,
    height: "".concat(gridSize * 3, "px"),
    marginRight: "".concat(gridSize * 2, "px"),
    width: "".concat(gridSize * 3, "px")
  },
  content: {
    borderRadius: "".concat(gridSize / 2, "px"),
    flexGrow: 1,
    height: "".concat(gridSize * 2.5, "px")
  }
}; // Light theme

export default (function (_ref) {
  var product = _ref.product;
  return function () {
    return {
      container: {
        wrapper: baseStyles.wrapper,
        before: _objectSpread({}, baseStyles.before, {
          backgroundColor: N40
        }),
        content: _objectSpread({}, baseStyles.content, {
          backgroundColor: N40
        })
      },
      product: {
        wrapper: baseStyles.wrapper,
        before: _objectSpread({}, baseStyles.before, {
          backgroundColor: product.background.static
        }),
        content: _objectSpread({}, baseStyles.content, {
          backgroundColor: product.background.static
        })
      }
    };
  };
});
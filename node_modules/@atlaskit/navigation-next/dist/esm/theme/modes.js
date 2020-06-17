import { N0, B500, DN500, DN10, N800 } from '@atlaskit/theme/colors';
import modeGenerator from './modeGenerator';
export var light = modeGenerator({
  product: {
    text: N0,
    background: B500
  }
});
export var dark = modeGenerator({
  product: {
    text: DN500,
    background: DN10
  }
});
export var settings = modeGenerator({
  product: {
    text: N0,
    background: N800
  }
});
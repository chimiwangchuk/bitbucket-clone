import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import { B100, B75 } from '@atlaskit/theme/colors';
export var focusRingColor = themed({ light: B100, dark: B75 });
export var tagHeightUnitless = 2.5 * gridSize();
export var tagHeight = tagHeightUnitless + "px";
export var buttonWidthUnitless = tagHeightUnitless; // button should be square
export var buttonWidth = tagHeight; // button should be square
export var maxWidthUnitless = 25 * gridSize();
export var maxWidth = maxWidthUnitless + "px";
export var maxTextWidthUnitless = maxWidthUnitless - tagHeightUnitless;
export var maxTextWidth = maxTextWidthUnitless + "px";
//# sourceMappingURL=constants.js.map
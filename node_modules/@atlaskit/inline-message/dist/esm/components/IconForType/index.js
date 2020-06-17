import { __extends } from "tslib";
import React from 'react';
import IconWrapper from './styledIconForType';
import { typesMapping } from '../../constants';
var SelectedIconForType = /** @class */ (function (_super) {
    __extends(SelectedIconForType, _super);
    function SelectedIconForType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectedIconForType.prototype.render = function () {
        var _a = this.props, type = _a.type, isHovered = _a.isHovered, isOpen = _a.isOpen;
        var _b = type, _c = typesMapping[_b], SelectedIcon = _c.icon, iconSize = _c.iconSize;
        return (React.createElement(IconWrapper, { appearance: type, isHovered: isHovered, isOpen: isOpen },
            React.createElement(SelectedIcon, { label: "Inline message icon", size: iconSize })));
    };
    return SelectedIconForType;
}(React.Component));
export default SelectedIconForType;
//# sourceMappingURL=index.js.map
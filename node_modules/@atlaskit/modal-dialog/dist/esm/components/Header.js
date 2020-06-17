import { __extends } from "tslib";
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Header, Title, TitleText, titleIconWrapperStyles, } from '../styled/Content';
var TitleIcon = function (_a) {
    var appearance = _a.appearance;
    if (!appearance)
        return null;
    var Icon = appearance === 'danger' ? ErrorIcon : WarningIcon;
    return (jsx("span", { css: titleIconWrapperStyles(appearance) },
        jsx(Icon, { label: appearance + " icon" })));
};
var ModalHeader = /** @class */ (function (_super) {
    __extends(ModalHeader, _super);
    function ModalHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModalHeader.prototype.render = function () {
        var _a = this.props, appearance = _a.appearance, component = _a.component, heading = _a.heading, onClose = _a.onClose, showKeyline = _a.showKeyline, isHeadingMultiline = _a.isHeadingMultiline;
        var warning = 'You can provide `component` OR `heading`, not both.';
        if (!component && !heading)
            return null;
        if (component && heading) {
            console.warn(warning); // eslint-disable-line no-console
            return null;
        }
        if (component) {
            return React.createElement(component, {
                appearance: appearance,
                onClose: onClose,
                showKeyline: showKeyline,
                isHeadingMultiline: isHeadingMultiline,
            });
        }
        return (jsx(Header, { showKeyline: showKeyline },
            jsx(Title, null,
                jsx(TitleIcon, { appearance: appearance }),
                jsx(TitleText, { isHeadingMultiline: isHeadingMultiline }, heading))));
    };
    ModalHeader.defaultProps = {
        isHeadingMultiline: true,
    };
    return ModalHeader;
}(React.Component));
export default ModalHeader;
//# sourceMappingURL=Header.js.map
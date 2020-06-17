import { __extends } from "tslib";
import React, { Component } from 'react';
import { Anchor, Span } from '../styled/FieldStyles';
var CommentField = /** @class */ (function (_super) {
    __extends(CommentField, _super);
    function CommentField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommentField.prototype.render = function () {
        var _a = this.props, children = _a.children, hasAuthor = _a.hasAuthor, href = _a.href, onClick = _a.onClick, onFocus = _a.onFocus, onMouseOver = _a.onMouseOver;
        /* eslint-disable jsx-a11y/no-static-element-interactions */
        return href ? (React.createElement(Anchor, { href: href, hasAuthor: hasAuthor, onClick: onClick, onFocus: onFocus, onMouseOver: onMouseOver }, children)) : (React.createElement(Span, { hasAuthor: hasAuthor, onClick: onClick, onFocus: onFocus, onMouseOver: onMouseOver }, children));
        /* eslint-enable jsx-a11y/no-static-element-interactions */
    };
    return CommentField;
}(Component));
export default CommentField;
//# sourceMappingURL=Field.js.map
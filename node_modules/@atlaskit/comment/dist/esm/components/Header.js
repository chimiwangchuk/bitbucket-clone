import React from 'react';
import Lozenge from '@atlaskit/lozenge';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import { BulletSpacer, Restricted, RestrictedIconWrapper, TopItem, TopItemsContainer, } from '../styled/HeaderStyles';
var HeaderItems = function (_a) {
    var author = _a.author, edited = _a.edited, isError = _a.isError, isSaving = _a.isSaving, restrictedTo = _a.restrictedTo, savingText = _a.savingText, time = _a.time, type = _a.type;
    var restrictedElement = restrictedTo ? (React.createElement(Restricted, null,
        React.createElement(BulletSpacer, null, "\u2022"),
        React.createElement(RestrictedIconWrapper, null,
            React.createElement(LockFilledIcon, { label: "", size: "small" })),
        ' ',
        restrictedTo)) : null;
    var items = [
        author || null,
        type ? React.createElement(Lozenge, null, type) : null,
        time && !isSaving && !isError ? time : null,
        edited || null,
        isSaving ? savingText : null,
        restrictedElement,
    ]
        .filter(function (item) { return !!item; })
        .map(function (item, index) { return React.createElement(TopItem, { key: index }, item); }); // eslint-disable-line react/no-array-index-key
    return items.length ? React.createElement(TopItemsContainer, null, items) : null;
};
export default HeaderItems;
//# sourceMappingURL=Header.js.map
import React from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { ActionsContainer, ActionsItem, ErrorIcon, } from '../styled/FooterStyles';
var mapActions = function (items) {
    return items.map(function (item, index) { return (
    // eslint-disable-next-line react/no-array-index-key
    React.createElement(ActionsItem, { key: index }, item)); });
};
var FooterItems = function (_a) {
    var actions = _a.actions, errorActions = _a.errorActions, errorIconLabel = _a.errorIconLabel, isError = _a.isError, isSaving = _a.isSaving;
    if (isSaving || (!actions && !errorActions))
        return null;
    var items = isError
        ? errorActions && mapActions(errorActions)
        : actions && mapActions(actions);
    return (React.createElement(ActionsContainer, null,
        isError ? (React.createElement(ErrorIcon, null,
            React.createElement(WarningIcon, { label: errorIconLabel ? errorIconLabel : '' }))) : null,
        items));
};
export default FooterItems;
//# sourceMappingURL=Footer.js.map
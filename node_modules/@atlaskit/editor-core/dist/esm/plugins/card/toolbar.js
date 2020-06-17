import { __assign } from "tslib";
import { defineMessages } from 'react-intl';
import { NodeSelection } from 'prosemirror-state';
import { removeSelectedNode } from 'prosemirror-utils';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { analyticsService } from '../../analytics';
import { ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, addAnalytics, } from '../analytics';
import { linkToolbarMessages } from '../../messages';
import commonMessages from '../../messages';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { changeSelectedCardToText } from './pm-plugins/doc';
import { pluginKey } from './pm-plugins/main';
import { buildEditLinkToolbar, editLink, editLinkToolbarConfig, } from './ui/EditLinkToolbar';
import { displayInfoForCard, findCardInfo, titleUrlPairFromNode, } from './utils';
import { isSafeUrl } from '@atlaskit/adf-schema';
export var messages = defineMessages({
    block: {
        id: 'fabric.editor.displayBlock',
        defaultMessage: 'Display as card',
        description: 'Display link as a card with a rich preview similar to in a Facebook feed with page title, description, and potentially an image.',
    },
    inline: {
        id: 'fabric.editor.displayInline',
        defaultMessage: 'Display as link',
        description: 'Display link with the title only.',
    },
    link: {
        id: 'fabric.editor.displayLink',
        defaultMessage: 'Display as text',
        description: 'Convert the card to become a regular text-based hyperlink.',
    },
});
export var removeCard = function (state, dispatch) {
    if (!(state.selection instanceof NodeSelection)) {
        return false;
    }
    var type = state.selection.node.type.name;
    var payload = {
        action: ACTION.DELETED,
        actionSubject: ACTION_SUBJECT.SMART_LINK,
        actionSubjectId: type,
        attributes: {
            inputMethod: INPUT_METHOD.TOOLBAR,
            displayMode: type,
        },
        eventType: EVENT_TYPE.TRACK,
    };
    if (dispatch) {
        dispatch(addAnalytics(state, removeSelectedNode(state.tr), payload));
    }
    analyticsService.trackEvent('atlassian.editor.format.card.delete.button');
    return true;
};
export var visitCardLink = function (state, dispatch) {
    if (!(state.selection instanceof NodeSelection)) {
        return false;
    }
    var type = state.selection.node.type;
    var url = titleUrlPairFromNode(state.selection.node).url;
    var payload = {
        action: ACTION.VISITED,
        actionSubject: ACTION_SUBJECT.SMART_LINK,
        actionSubjectId: type.name,
        attributes: {
            inputMethod: INPUT_METHOD.TOOLBAR,
        },
        eventType: EVENT_TYPE.TRACK,
    };
    // All card links should open in the same tab per https://product-fabric.atlassian.net/browse/MS-1583.
    analyticsService.trackEvent('atlassian.editor.format.card.visit.button');
    // We are in edit mode here, open the smart card URL in a new window.
    window.open(url);
    if (dispatch) {
        dispatch(addAnalytics(state, state.tr, payload));
    }
    return true;
};
var unlinkCard = function (node, state) {
    var displayInfo = displayInfoForCard(node, findCardInfo(state));
    var text = displayInfo.title || displayInfo.url;
    if (text) {
        return changeSelectedCardToText(text);
    }
    return function () { return false; };
};
var generateDeleteButton = function (node, state, intl) {
    var inlineCard = state.schema.nodes.inlineCard;
    if (node.type === inlineCard) {
        return {
            type: 'button',
            title: intl.formatMessage(linkToolbarMessages.unlink),
            icon: UnlinkIcon,
            onClick: unlinkCard(node, state),
        };
    }
    return {
        type: 'button',
        appearance: 'danger',
        icon: RemoveIcon,
        onMouseEnter: hoverDecoration(node.type, true),
        onMouseLeave: hoverDecoration(node.type, false),
        title: intl.formatMessage(commonMessages.remove),
        onClick: removeCard,
    };
};
var generateToolbarItems = function (state, intl, providerFactory) { return function (node) {
    var url = titleUrlPairFromNode(node).url;
    if (url && !isSafeUrl(url)) {
        return [];
    }
    var pluginState = pluginKey.getState(state);
    if (pluginState.showLinkingToolbar) {
        return [
            buildEditLinkToolbar({
                providerFactory: providerFactory,
                node: node,
            }),
        ];
    }
    else {
        return [
            {
                type: 'button',
                selected: false,
                title: intl.formatMessage(linkToolbarMessages.editLink),
                showTitle: true,
                onClick: editLink,
            },
            { type: 'separator' },
            {
                type: 'button',
                icon: OpenIcon,
                className: 'hyperlink-open-link',
                title: intl.formatMessage(linkToolbarMessages.openLink),
                onClick: visitCardLink,
            },
            { type: 'separator' },
            generateDeleteButton(node, state, intl),
        ];
    }
}; };
export var floatingToolbar = function (state, intl, providerFactory) {
    var _a = state.schema.nodes, inlineCard = _a.inlineCard, blockCard = _a.blockCard;
    var nodeType = [inlineCard, blockCard];
    var pluginState = pluginKey.getState(state);
    return __assign({ title: 'Card floating controls', nodeType: nodeType, items: generateToolbarItems(state, intl, providerFactory) }, (pluginState.showLinkingToolbar ? editLinkToolbarConfig : {}));
};
//# sourceMappingURL=toolbar.js.map
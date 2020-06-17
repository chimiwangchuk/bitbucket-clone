import { __read, __spread } from "tslib";
import { defineMessages } from 'react-intl';
import { findDomRefAtPos } from 'prosemirror-utils';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import LayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import LayoutTwoLeftSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-left-sidebar';
import LayoutTwoRightSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-right-sidebar';
import LayoutThreeWithSidebarsIcon from '@atlaskit/icon/glyph/editor/layout-three-with-sidebars';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import commonMessages from '../../messages';
import { setPresetLayout, deleteActiveLayoutNode, getPresetLayout, } from './actions';
import { hoverDecoration } from '../base/pm-plugins/decoration';
export var messages = defineMessages({
    twoColumns: {
        id: 'fabric.editor.twoColumns',
        defaultMessage: 'Two columns',
        description: 'Layout with two columns of equal width',
    },
    threeColumns: {
        id: 'fabric.editor.threeColumns',
        defaultMessage: 'Three columns',
        description: 'Layout with three columns of equal width',
    },
    rightSidebar: {
        id: 'fabric.editor.rightSidebar',
        defaultMessage: 'Right sidebar',
        description: 'Layout with two columns, left column is 2/3 and right is 1/3 of page',
    },
    leftSidebar: {
        id: 'fabric.editor.leftSidebar',
        defaultMessage: 'Left sidebar',
        description: 'Layout with two columns, left column is 1/3 and right is 2/3 of page',
    },
    threeColumnsWithSidebars: {
        id: 'fabric.editor.threeColumnsWithSidebars',
        defaultMessage: 'Three columns with sidebars',
        description: 'Layout with 3 columns laid out as 25% - 50% - 25%',
    },
});
var LAYOUT_TYPES = [
    { type: 'two_equal', title: messages.twoColumns, icon: LayoutTwoEqualIcon },
    {
        type: 'three_equal',
        title: messages.threeColumns,
        icon: LayoutThreeEqualIcon,
    },
];
var SIDEBAR_LAYOUT_TYPES = [
    {
        type: 'two_right_sidebar',
        title: messages.rightSidebar,
        icon: LayoutTwoRightSidebarIcon,
    },
    {
        type: 'two_left_sidebar',
        title: messages.leftSidebar,
        icon: LayoutTwoLeftSidebarIcon,
    },
    {
        type: 'three_with_sidebars',
        title: messages.threeColumnsWithSidebars,
        icon: LayoutThreeWithSidebarsIcon,
    },
];
var buildLayoutButton = function (intl, item, currentLayout) { return ({
    type: 'button',
    icon: item.icon,
    title: intl.formatMessage(item.title),
    onClick: setPresetLayout(item.type),
    selected: !!currentLayout && currentLayout === item.type,
}); };
export var buildToolbar = function (state, intl, pos, _allowBreakout, addSidebarLayouts) {
    var node = state.doc.nodeAt(pos);
    if (node) {
        var currentLayout_1 = getPresetLayout(node);
        var separator = {
            type: 'separator',
        };
        var nodeType = state.schema.nodes.layoutSection;
        var deleteButton = {
            type: 'button',
            appearance: 'danger',
            icon: RemoveIcon,
            title: intl.formatMessage(commonMessages.remove),
            onClick: deleteActiveLayoutNode,
            onMouseEnter: hoverDecoration(nodeType, true),
            onMouseLeave: hoverDecoration(nodeType, false),
        };
        return {
            title: 'Layout floating controls',
            getDomRef: function (view) {
                return findDomRefAtPos(pos, view.domAtPos.bind(view));
            },
            nodeType: nodeType,
            items: __spread(LAYOUT_TYPES.map(function (i) { return buildLayoutButton(intl, i, currentLayout_1); }), (addSidebarLayouts
                ? SIDEBAR_LAYOUT_TYPES.map(function (i) {
                    return buildLayoutButton(intl, i, currentLayout_1);
                })
                : []), [
                separator,
                deleteButton,
            ]),
        };
    }
    return;
};
//# sourceMappingURL=toolbar.js.map
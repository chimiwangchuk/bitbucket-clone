import { defineMessages } from 'react-intl';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { createLanguageList, DEFAULT_LANGUAGES, getLanguageIdentifier, } from '@atlaskit/adf-schema';
import { findParentNodeOfType } from 'prosemirror-utils';
import { removeCodeBlock, changeLanguage } from './actions';
import commonMessages from '../../messages';
import { pluginKey } from './pm-plugins/main';
import { hoverDecoration } from '../base/pm-plugins/decoration';
export var messages = defineMessages({
    selectLanguage: {
        id: 'fabric.editor.selectLanguage',
        defaultMessage: 'Select language',
        description: 'Code blocks display software code. A prompt to select the software language the code is written in.',
    },
});
var languageList = createLanguageList(DEFAULT_LANGUAGES);
export var getToolbarConfig = function (state, _a) {
    var formatMessage = _a.formatMessage;
    var codeBlockState = pluginKey.getState(state);
    if (codeBlockState &&
        codeBlockState.toolbarVisible &&
        codeBlockState.element) {
        var parent_1 = findParentNodeOfType(state.schema.nodes.codeBlock)(state.selection);
        var language_1 = parent_1 && parent_1.node.attrs ? parent_1.node.attrs.language : undefined;
        var options = languageList.map(function (lang) { return ({
            label: lang.name,
            value: getLanguageIdentifier(lang),
        }); });
        var languageSelect = {
            type: 'select',
            onChange: function (option) { return changeLanguage(option.value); },
            defaultValue: language_1
                ? options.find(function (option) { return option.value === language_1; })
                : undefined,
            placeholder: formatMessage(messages.selectLanguage),
            options: options,
        };
        var separator = {
            type: 'separator',
        };
        var nodeType = state.schema.nodes.codeBlock;
        var deleteButton = {
            type: 'button',
            appearance: 'danger',
            icon: RemoveIcon,
            onMouseEnter: hoverDecoration(nodeType, true),
            onMouseLeave: hoverDecoration(nodeType, false),
            onClick: removeCodeBlock,
            title: formatMessage(commonMessages.remove),
        };
        return {
            title: 'CodeBlock floating controls',
            getDomRef: function () { return codeBlockState.element; },
            nodeType: nodeType,
            items: [languageSelect, separator, deleteButton],
        };
    }
    return;
};
//# sourceMappingURL=toolbar.js.map
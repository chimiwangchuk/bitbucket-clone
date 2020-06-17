import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl, FormattedMessage } from 'react-intl';
import KeyboardShortcuts from 'src/components/keyboard-shortcut-handler';

export type ListKeyboardShortcutMessages = {
  shortcutGroupTitle: FormattedMessage.MessageDescriptor;
  nextRowShortcut: FormattedMessage.MessageDescriptor;
  previousRowShortcut: FormattedMessage.MessageDescriptor;
  openRowShortcut: FormattedMessage.MessageDescriptor;
  unselectRowShortcut: FormattedMessage.MessageDescriptor;
};

type Props = {
  isDisabled: boolean;
  intl: InjectedIntl;
  onFocusNextRow: () => void;
  onFocusPreviousRow: () => void;
  onOpenSelectedRow: () => void;
  onUnfocusRow: () => void;
  messages: ListKeyboardShortcutMessages;
};

const throttleWait = 25;

class ListKeyboardShortcuts extends PureComponent<Props> {
  getShortcuts() {
    const { messages } = this.props;
    return [
      {
        id: `list-focus-next-row`,
        description: this.props.intl.formatMessage(messages.nextRowShortcut),
        handler: this.props.onFocusNextRow,
        throttleWait,
        keys: ['j'],
      },
      {
        id: `list-focus-previous-row`,
        description: this.props.intl.formatMessage(
          messages.previousRowShortcut
        ),
        handler: this.props.onFocusPreviousRow,
        throttleWait,
        keys: ['k'],
      },
      {
        id: `list-open`,
        description: this.props.intl.formatMessage(messages.openRowShortcut),
        handler: this.props.onOpenSelectedRow,
        throttleWait,
        keys: 'o',
      },
      {
        id: `list-unfocus`,
        description: this.props.intl.formatMessage(
          messages.unselectRowShortcut
        ),
        handler: this.props.onUnfocusRow,
        throttleWait,
        keys: 'esc',
      },
    ];
  }

  render() {
    const { isDisabled, intl, messages } = this.props;
    // children are required for KeyboardShortcuts component
    // we can not put actual content there because it causes errors
    return (
      <KeyboardShortcuts
        isDisabled={isDisabled || false}
        groupId="generic-list"
        groupTitle={intl.formatMessage(messages.shortcutGroupTitle)}
        shortcuts={this.getShortcuts()}
      >
        <div />
      </KeyboardShortcuts>
    );
  }
}

export default injectIntl(ListKeyboardShortcuts);

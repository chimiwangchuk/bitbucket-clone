import React, { PureComponent, ReactNode } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import KeyboardShortcuts from 'src/components/keyboard-shortcut-handler';
import { SidebarType } from 'src/redux/sidebar';
import messages from './sidebar-keyboard-shortcuts.i18n';

type Props = {
  children: ReactNode;
  intl: InjectedIntl;
  sidebarType: SidebarType;
  toggleSidebar: () => void;
};

class SidebarKeyboardShortcuts extends PureComponent<Props> {
  shortcuts = [
    {
      id: `toggle-${this.props.sidebarType}-sidebar`,
      description: this.props.intl.formatMessage(
        messages.toggleSidebarShortcut
      ),
      handler: () => {
        this.props.toggleSidebar();
      },
      keys: ']',
    },
  ];

  render() {
    const { children, intl, sidebarType } = this.props;

    return (
      <KeyboardShortcuts
        groupId={`${sidebarType}-sidebar`}
        groupTitle={intl.formatMessage(messages.shortcutGroupTitle)}
        shortcuts={this.shortcuts}
      >
        {children}
      </KeyboardShortcuts>
    );
  }
}

export default injectIntl(SidebarKeyboardShortcuts);

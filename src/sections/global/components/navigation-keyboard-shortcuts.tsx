import React, { PureComponent, ReactNode } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
// @ts-ignore TODO: fix noImplicitAny error here
import { UIControllerSubscriber } from '@atlaskit/navigation-next';

import KeyboardShortcuts from 'src/components/keyboard-shortcut-handler';
import messages from './keyboard-shortcuts.i18n';

const GROUP_ID = 'global';

type Props = {
  children: ReactNode;
  intl: InjectedIntl;
  toggleKeyboardShortcutMenu: (isOpen?: boolean) => void;
  toggleNavigation: (isOpen?: boolean) => void;
  toggleSearchDrawer: (isOpen?: boolean) => void;
};

class GlobalKeyboardShortcuts extends PureComponent<Props> {
  // @ts-ignore TODO: fix noImplicitAny error here
  shortcuts = (navigationUIController?) => [
    {
      id: 'toggle-nav',
      description: this.props.intl.formatMessage(
        messages.toggleNavigationShortcut
      ),
      handler: navigationUIController.toggleCollapse,
      keys: '[',
    },
    {
      id: 'toggle-search',
      description: this.props.intl.formatMessage(messages.toggleSearchShortcut),
      // @ts-ignore TODO: fix noImplicitAny error here
      handler: e => {
        // prevent the "/" key input from being entered in the search input
        e.preventDefault();
        this.props.toggleSearchDrawer();
      },
      keys: '/',
    },
    {
      id: 'toggle-keyboard-shortcut-menu',
      description: this.props.intl.formatMessage(
        messages.toggleKeyboardShortcutMenuShortcut
      ),
      handler: () => {
        this.props.toggleKeyboardShortcutMenu();
      },
      keys: '?',
    },
  ];

  render() {
    const { children, intl } = this.props;

    return (
      <UIControllerSubscriber>
        {(navigationUIController: any) => {
          return (
            <KeyboardShortcuts
              groupId={GROUP_ID}
              groupTitle={intl.formatMessage(messages.shortcutGroupTitle)}
              groupWeight={-100}
              shortcuts={this.shortcuts(navigationUIController)}
            >
              {children}
            </KeyboardShortcuts>
          );
        }}
      </UIControllerSubscriber>
    );
  }
}

export default injectIntl(GlobalKeyboardShortcuts);

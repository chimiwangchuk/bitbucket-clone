import Modal from '@atlaskit/modal-dialog';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';

import { BucketState } from 'src/types/state';
import { KeyboardShortcuts } from 'src/redux/keyboard-shortcuts';
import toggleMenu from 'src/redux/global/actions/toggle-keyboard-shortcut-menu';
import messages from './keyboard-shortcut-dialog.i18n';
import KeyboardShortcutMenu from './keyboard-shortcut-menu';

type Props = {
  intl: InjectedIntl;
  isOpen: boolean;
  shortcuts: KeyboardShortcuts;
  toggleMenu: (isOpen?: boolean) => void;
};

class KeyboardShortcutDialog extends PureComponent<Props> {
  static defaultProps = {
    shortcuts: {},
    toggleMenu: () => {},
  };

  actions = [
    {
      onClick: () => this.close(),
      text: this.props.intl.formatMessage(messages.closeButton),
    },
  ];

  close = () => {
    this.props.toggleMenu(false);
  };

  render() {
    const { intl, isOpen, shortcuts } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        actions={this.actions}
        heading={intl.formatMessage(messages.heading)}
        onClose={this.close}
        width="small"
      >
        <KeyboardShortcutMenu shortcuts={shortcuts} />
      </Modal>
    );
  }
}

const mapDispatchToProps = { toggleMenu };
const mapStateToProps = (state: BucketState) => ({
  isOpen: state.global.isKeyboardShortcutMenuOpen,
  shortcuts: state.keyboardShortcuts,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(KeyboardShortcutDialog));

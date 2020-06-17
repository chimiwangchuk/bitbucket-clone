import React, { PureComponent, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';

import messages from '../i18n';
import * as styles from '../styles';
import { CloneProtocol, CloneClientEvent } from '../types';

import DialogContent from './dialog-content';
import Header from './dialog-header';

type CloneModalDialogProps = {
  children: ReactNode;
  defaultProtocol: CloneProtocol;
  isOpen: boolean;
  onCloneClient?: CloneClientEvent;
  onDialogDismissed: () => void;
  onProtocolSelected: (c: CloneProtocol) => void;
  repository?: BB.Repository;
  sourcetree?: boolean;
  user?: BB.User;
  xcode?: boolean;
};

type CloneModalDialogState = {
  protocol: CloneProtocol;
};

export default class CloneModalDialog extends PureComponent<
  CloneModalDialogProps,
  CloneModalDialogState
> {
  static defaultProps = {
    children: [],
    defaultProtocol: 'https',
    onDialogDismissed: () => {},
    onProtocolSelected: () => {},
  };

  state = {
    protocol: this.props.defaultProtocol,
  };

  onProtocolSelected = (protocol: CloneProtocol) => {
    this.setState({ protocol });
    if (this.props.onProtocolSelected) {
      this.props.onProtocolSelected(protocol);
    }
  };

  render() {
    const { protocol } = this.state;
    const {
      isOpen,
      onCloneClient,
      onDialogDismissed,
      repository,
      sourcetree,
      user,
      xcode,
    } = this.props;

    return (
      <ModalTransition>
        {isOpen && (
          <ModalDialog
            components={{
              Header: () => (
                <Header
                  onProtocolSelected={this.onProtocolSelected}
                  protocol={protocol}
                />
              ),
              Footer: () => (
                <styles.ModalFooter>
                  <Button onClick={onDialogDismissed} appearance="subtle">
                    <FormattedMessage {...messages.dialogCloseAction} />
                  </Button>
                </styles.ModalFooter>
              ),
            }}
            onClose={onDialogDismissed}
          >
            <DialogContent
              onCloneClient={onCloneClient}
              protocol={protocol}
              repository={repository}
              sourcetree={sourcetree}
              user={user}
              xcode={xcode}
            />
            {React.Children.map(
              this.props.children,
              child =>
                React.isValidElement(child) &&
                React.cloneElement(child, {
                  // @ts-ignore
                  protocol,
                })
            )}
          </ModalDialog>
        )}
      </ModalTransition>
    );
  }
}

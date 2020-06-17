import React, { PureComponent } from 'react';
import InlineDialog, { Placement } from '@atlaskit/inline-dialog';

import * as styles from '../styles';
import { CloneProtocol } from '../types';

import DialogContent from './dialog-content';
import Header from './dialog-header';

type CloneInlineDialogProps = {
  children: any;
  defaultProtocol: CloneProtocol;
  isOpen: boolean;
  onDialogDismissed: () => void;
  onProtocolSelected: (c: CloneProtocol) => void;
  placement: Placement;
  repository?: BB.Repository;
  sourcetree?: boolean;
  user?: BB.User;
  xcode?: boolean;
};

type CloneInlineDialogState = {
  protocol: CloneProtocol;
};

export default class CloneInlineDialog extends PureComponent<
  CloneInlineDialogProps,
  CloneInlineDialogState
> {
  static defaultProps = {
    placement: 'bottom',
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
    return (
      <InlineDialog
        content={
          <styles.InlineContent>
            <Header
              onProtocolSelected={this.onProtocolSelected}
              protocol={this.state.protocol}
            />
            <DialogContent
              protocol={this.state.protocol}
              repository={this.props.repository}
              user={this.props.user}
              sourcetree={this.props.sourcetree}
              xcode={this.props.xcode}
            />
          </styles.InlineContent>
        }
        isOpen={this.props.isOpen}
        onClose={this.props.onDialogDismissed}
        placement={this.props.placement}
      >
        {this.props.children}
      </InlineDialog>
    );
  }
}

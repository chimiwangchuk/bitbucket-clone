import * as React from 'react';
import AkInlineDialog from '@atlaskit/inline-dialog';
import { translatePosition } from './utils'; // for backwards compatibility

export interface InlineDialogProps {
  provider: any;
  children: any;
  content: React.ReactNode;
  position?: string;
  isOpen?: boolean;
  onClose?: (args: { isOpen: boolean; event: any }) => void;
}

export interface InlineDialogState {
  isOpen: boolean;
}

export default class InlineDialog extends React.PureComponent<
  InlineDialogProps,
  InlineDialogState
> {
  static defaultProps = {
    position: 'bottom left',
  };

  state = {
    isOpen: !!this.props.isOpen,
  };

  componentWillMount() {
    this.props.provider.register(this);
  }

  componentWillUnmount() {
    this.props.provider.unregister(this);
  }

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  isOpen = () => this.state.isOpen;

  render() {
    const {
      children,
      content,
      position,
      onClose = this.props.provider.close,
    } = this.props;
    const { isOpen } = this.state;

    return (
      <AkInlineDialog
        content={content}
        placement={position ? translatePosition(position) : undefined}
        isOpen={isOpen}
        onClose={onClose}
      >
        {children}
      </AkInlineDialog>
    );
  }
}

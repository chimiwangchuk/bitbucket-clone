import React, { PureComponent, ComponentType } from 'react';
import { ConnectModule } from '@atlassian/bitbucket-connect-js';
import { getObjectValue } from '../../main/utils';
import InlineDialog from './inlineDialog';
import InlineDialogIframeWrapper from './inlineDialogIframeWrapper';

export type InlineDialogIframeProps = {
  children?: any;
  connectHost: any;
  provider: any;
  IframeComponent: ComponentType<any>;
  module?: ConnectModule;
  isOpen?: boolean;
};

export default class InlineDialogIframe extends PureComponent<
  InlineDialogIframeProps
> {
  timeout: NodeJS.Timeout;
  static defaultProps = {
    IframeComponent: InlineDialogIframeWrapper,
  };
  clearTimeout = () => {
    clearTimeout(this.timeout);
    delete this.timeout;
  };
  onMouseEnter = () => {
    if (this.timeout) {
      this.clearTimeout();
    } else {
      this.props.provider.open();
    }
  };
  onMouseLeave = () => {
    this.clearTimeout();
    this.timeout = setTimeout(() => {
      this.props.provider.close();
      this.clearTimeout();
    }, 200);
  };
  handleHideInlineDialog = () => {
    this.clearTimeout();
    this.props.provider.close();
  };
  render() {
    const {
      IframeComponent,
      children,
      connectHost,
      provider,
      module: mod,
      isOpen,
    } = this.props;
    const options = getObjectValue(mod, 'descriptor.target.options', {});
    const { position, onHover } = options;
    const content = (
      <InlineDialog
        provider={provider}
        position={position}
        isOpen={isOpen}
        onClose={this.handleHideInlineDialog}
        content={
          <IframeComponent
            connectHost={connectHost}
            inlineDialogOptions={options}
            module={mod}
            handleHideInlineDialog={this.handleHideInlineDialog}
          />
        }
      >
        {children}
      </InlineDialog>
    );
    if (onHover) {
      return (
        <span onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          {content}
        </span>
      );
    }
    return content;
  }
}

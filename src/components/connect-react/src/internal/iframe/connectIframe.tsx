import React, { PureComponent } from 'react';
import Connect from '../../main/connect';
import { ConnectModulesProps } from '../modules';
import {
  ConnectIframes,
  ConnectIframeContainerComponent,
} from './connectIframes';
import { ConnectModuleIframeProps } from './connectModuleIframe';

export type ConnectIframeProps = ConnectIframeContainerComponent &
  ConnectModuleIframeProps &
  ConnectModulesProps;

export class ConnectIframe extends PureComponent<ConnectIframeProps> {
  render() {
    return (
      <ConnectIframes {...this.props}>
        {iframes => {
          if (iframes.length > 0) {
            const { Component: Iframe } = iframes[0];
            return <Iframe />;
          }
          return false;
        }}
      </ConnectIframes>
    );
  }
}

export default Connect(ConnectIframe);

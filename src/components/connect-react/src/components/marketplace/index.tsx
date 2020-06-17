import React from 'react';
import { ConnectHost, ConnectUser } from '@atlassian/bitbucket-connect-js';
import {
  ConnectModuleIframe,
  ConnectModuleIframeProps,
} from '../../internal/iframe/connectModuleIframe';
import { isObject, isFunction } from '../../main/utils';

export interface ConnectMaketplaceSPIOptions {
  product: string;
  cloudId: string;
  baseUrl: string;
  environment: string;
  getAuthToken: () => string;
  getCurrentContext: () => string;
}

export type ConnectMaketplaceProps = ConnectModuleIframeProps & {
  spi: (options: ConnectMaketplaceSPIOptions) => any;
  getCurrentUser?: () => ConnectUser;
  connectHost?: ConnectHost;
};

export class ConnectMarketplace extends React.Component<
  ConnectMaketplaceProps
> {
  static defaultProps = {
    defaultStyles: { width: '100%', height: '100vh', border: 'none' },
  };
  componentWillMount() {
    const { connectHost, spi, getCurrentUser } = this.props;
    if (connectHost && connectHost.defineModule) {
      connectHost.defineModule(
        'marketplace',
        spi({
          cloudId: Array(40).join('x'),
          product: 'bitbucket',
          environment: 'staging',
          baseUrl: '',
          getAuthToken: () => '',
          getCurrentContext: () => '',
        })
      );
      connectHost.defineModule('user', {
        // @ts-ignore TODO: fix noImplicitAny error here
        getCurrentUser: fn => {
          const currentUser = isFunction(getCurrentUser)
            ? getCurrentUser()
            : '';
          fn({
            atlassianAccountId: isObject<ConnectUser>(currentUser)
              ? currentUser.uuid || currentUser.username
              : currentUser,
          });
        },
      });
    }
  }
  componentWillUnmount() {
    const { connectHost } = this.props;
    if (connectHost && connectHost.defineModule) {
      connectHost.defineModule('marketplace', {});
    }
  }
  render() {
    let { connectHost } = this.props;
    if (!connectHost) {
      connectHost =
        typeof (window as any).connectHost !== 'undefined' &&
        (window as any).connectHost
          ? (window as any).connectHost
          : ConnectHost;
    }
    return <ConnectModuleIframe {...this.props} connectHost={connectHost} />;
  }
}

export default ConnectMarketplace;

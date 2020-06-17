import React, { PureComponent } from 'react';
import { ConnectHost, ConnectModule } from '@atlassian/bitbucket-connect-js';
import { applyUrlFragment } from '../../internal/iframe/utils';
import Connect from '../../main/connect';
import { IframeProps, UrlIframe } from './iframe';

type ModuleIframeOwnProps = {
  module?: ConnectModule;
};

export type ConnectModuleIframeProps = ModuleIframeOwnProps & IframeProps;

export class ConnectModuleIframe extends PureComponent<
  ConnectModuleIframeProps & { connectHost: ConnectHost }
> {
  render() {
    const { module: m, ...props } = this.props;

    if (!m) {
      return null;
    }

    const {
      id: moduleId,
      app_key: appKey,
      module_type: moduleType,
      source: { url },
      descriptor: { key: moduleKey, location, params = {} },
      targetHref,
      principalId,
    } = m;
    const moduleOptions = {
      appKey,
      moduleId,
      moduleKey,
      moduleType,
      location,
      targetHref,
      principalId,
    };

    return (
      <UrlIframe
        {...props}
        url={applyUrlFragment(url, moduleType, params.passLocation)}
        moduleId={moduleId}
        moduleKey={moduleKey}
        appKey={appKey}
        moduleOptions={moduleOptions}
      />
    );
  }
}

export default Connect(ConnectModuleIframe);

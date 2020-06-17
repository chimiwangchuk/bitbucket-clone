import React, { PureComponent } from 'react';
import { ConnectModule } from '@atlassian/bitbucket-connect-js';
import * as targets from './targets';
import { ConnectWebItemProps, ConnectWebItemBaseProps } from './';

export type WebItemProps = {
  module: ConnectModule;
} & Pick<
  ConnectWebItemProps,
  Exclude<keyof ConnectWebItemProps, keyof ConnectWebItemBaseProps>
>;

export default class WebItem extends PureComponent<WebItemProps> {
  render() {
    const {
      module: { descriptor: { target: { type = '' } = {} } = {} } = {},
    } = this.props;
    // @ts-ignore TODO: fix noImplicitAny error here
    const Target = targets[type && type.toLowerCase()] || targets.page;
    return <Target {...this.props} />;
  }
}

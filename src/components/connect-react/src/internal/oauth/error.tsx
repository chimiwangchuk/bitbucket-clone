import React, { Component } from 'react';
import { AutoDismissFlag } from '@atlaskit/flag';
import { getIcon } from '../message/utils';

export type OAuthErrorProps = {
  title?: string;
  descritpion?: string;
  dismiss?: () => void;
};

export class OAuthError extends Component<OAuthErrorProps> {
  static defaultProps = {
    title: 'Server error',
    descritpion: 'Unable to complete the request',
  };
  render() {
    const { title, descritpion, dismiss } = this.props;
    return (
      <AutoDismissFlag
        id="oauth-error"
        title={title}
        description={descritpion}
        icon={getIcon('error')}
        isDismissAllowed
        onDismissed={dismiss}
      />
    );
  }
}

export default OAuthError;

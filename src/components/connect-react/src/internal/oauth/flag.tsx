import React, { PureComponent } from 'react';
import Flag, { AutoDismissFlag } from '@atlaskit/flag';
import { getIcon } from '../message/utils';
import OAuthError from './error';
import { OAuthModule, OAuthScope } from './types';

type OAuthFlagProps = {
  module: OAuthModule;
  scopes: OAuthScope[];
  showModalDialog: () => void;
  managePermissionsUrl: string;
};

export class OAuthFlag extends PureComponent<OAuthFlagProps> {
  static defaultProps = {
    module: {},
    scopes: [],
  };
  render() {
    const { moduleId, name, deny, denied, hasError } = this.props.module;

    if (typeof denied === 'boolean') {
      return (
        <AutoDismissFlag
          id={moduleId}
          title={`Access ${denied ? 'denied' : 'granted'}`}
          description={
            <p>
              You{denied ? ' denied ' : ' granted '}
              <strong>{name}</strong> access to your account.
            </p>
          }
          actions={[
            {
              content: 'Manage permissions',
              href: this.props.managePermissionsUrl,
              target: '_blank',
            },
          ]}
          icon={getIcon(denied ? 'error' : 'success')}
          isDismissAllowed
          onDismissed={deny}
        />
      );
    }

    if (hasError) {
      return <OAuthError />;
    }

    return (
      <Flag
        id={moduleId}
        title="Access request"
        description={
          <p>
            <strong>{name}</strong> requests access to your account. Review
            permissions requested to enable.
          </p>
        }
        actions={[
          {
            content: 'Review',
            onClick: this.props.showModalDialog,
          },
          { content: 'Cancel', onClick: deny },
        ]}
        icon={getIcon('info')}
      />
    );
  }
}

export default OAuthFlag;

import React, { PureComponent, Fragment } from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import { OAuthModule, OAuthScope } from './types';

export type OAuthModalProps = {
  module: OAuthModule;
  scopes: OAuthScope[];
};

export class OAuthModal extends PureComponent<OAuthModalProps> {
  static ListItem = ({ name, description, icon }: OAuthScope) => (
    <li key={name} style={{ display: 'flex' }}>
      <span
        className={`aui-icon aui-icon-small ${icon}`}
        style={{ minWidth: '24px' }}
      />
      <span>{description}</span>
    </li>
  );
  static List = ({
    scopes,
    module: mod,
  }: {
    scopes: OAuthScope[];
    module: OAuthModule;
  }) => (
    <Fragment>
      <p>
        <strong>{mod.name}</strong> requests access to:
      </p>
      <ul style={{ listStyleType: 'none', padding: '4px 0 0 0' }}>
        {scopes.reduce(
          (arr, { name, description, icon }) =>
            mod.scopes.includes(name)
              ? [
                  ...arr,
                  <OAuthModal.ListItem
                    key={name}
                    name={name}
                    description={description}
                    icon={icon}
                  />,
                ]
              : arr,
          []
        )}
      </ul>
    </Fragment>
  );
  render() {
    const { accept, deny } = this.props.module;
    return (
      <ModalDialog
        heading="Review permissions"
        actions={[
          {
            text: 'Allow',
            onClick: accept,
          },
          { text: 'Deny', onClick: deny },
        ]}
      >
        <OAuthModal.List {...this.props} />
      </ModalDialog>
    );
  }
}

export default OAuthModal;

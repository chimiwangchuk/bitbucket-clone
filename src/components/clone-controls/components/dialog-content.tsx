import React, { PureComponent } from 'react';

import * as styles from '../styles';
import { CloneProtocol, CloneClientEvent } from '../types';
import { getSourcetreeCloneUrl, getXcodeCloneUrl } from '../utils/clone-urls';

import CloneUrl from './clone-url';
import CloneClient from './clone-client';

const macDisplayName = 'macOS';
const windowsDisplayName = 'Windows';

export type DialogContentProps = {
  user?: BB.User;
  protocol: CloneProtocol;
  repository?: BB.Repository;
  sourcetree?: boolean;
  xcode?: boolean;
  onCloneClient?: CloneClientEvent;
};

export default class DialogContent extends PureComponent<DialogContentProps> {
  static defaultProps = {
    sourcetree: true,
  };
  static getCurrentSupportedOS(): string | undefined {
    const supportedOS = /Mac|Win/.test(navigator.platform);
    if (supportedOS) {
      return /Mac/.test(navigator.platform)
        ? macDisplayName
        : windowsDisplayName;
    }
    return undefined;
  }
  render() {
    const {
      protocol,
      repository,
      user,
      sourcetree,
      xcode,
      onCloneClient,
    } = this.props;
    const currentOS = DialogContent.getCurrentSupportedOS();
    return (
      <styles.Content>
        <CloneUrl
          repository={repository}
          protocol={protocol}
          isCloneCommandSelected
        />
        <styles.CloneClients>
          {sourcetree && currentOS && (
            <CloneClient
              client="Sourcetree"
              clientHref={`http://www.sourcetreeapp.com/?utm_source=internal&utm_medium=link&utm_campaign=clone_repo_${
                currentOS === macDisplayName ? 'mac' : 'win'
              }`}
              cloneHref={getSourcetreeCloneUrl(protocol, repository, user)}
              currentOS={currentOS}
              onCloneClient={onCloneClient}
            />
          )}
          {xcode && currentOS && currentOS === macDisplayName && (
            <CloneClient
              client="Xcode"
              clientHref="https://developer.apple.com/xcode/"
              cloneHref={getXcodeCloneUrl(protocol, repository)}
              currentOS={currentOS}
              onCloneClient={onCloneClient}
            />
          )}
        </styles.CloneClients>
      </styles.Content>
    );
  }
}

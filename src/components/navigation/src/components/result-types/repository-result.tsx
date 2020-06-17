import Avatar from '@atlaskit/avatar';
import { AkNavigationItem } from '@atlaskit/quick-search';
import React, { ComponentType, PureComponent } from 'react';
import { makeRepositoryDrawerLink } from '../with-repository-drawer-link';
import { RepositoryGlobalSearchResult } from '../../types';

type Props = {
  avatarUrl: string;
  fullSlug: string;
  name: string;
  url: string;
  repository: BB.Repository | RepositoryGlobalSearchResult;
  repositoryLinkComponent?: ComponentType<any>;
  onSearchDrawerClose: () => void;
  isSearchDrawerOpen: boolean;
};

export default class RepositoryResult extends PureComponent<Props> {
  render() {
    const {
      avatarUrl,
      fullSlug,
      name,
      repository,
      url,
      isSearchDrawerOpen,
      onSearchDrawerClose,
      repositoryLinkComponent,
      ...props
    } = this.props;

    // This is drawn from repository.full_name rather than repository.owner.username to make it more
    // future-proof for support with Workspaces and the removal of usernames
    const [owner] = fullSlug.split('/');

    return (
      <AkNavigationItem
        icon={<Avatar src={avatarUrl} />}
        subText={owner}
        text={name}
        href={url}
        linkComponent={
          repositoryLinkComponent
            ? makeRepositoryDrawerLink(repository, {
                onSearchDrawerClose,
                isSearchDrawerOpen,
              })(repositoryLinkComponent)
            : undefined
        }
        {...props}
      />
    );
  }
}

import React, { ComponentType } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  MenuItem,
  ContainerNavigationNext,
} from '@atlassian/bitbucket-navigation';
import { BucketState } from 'src/types/state';
import { getIsJiraRepoPageM2Enabled } from 'src/selectors/feature-selectors';
import { getCurrentRepository } from 'src/selectors/repository-selectors';
import { Repository } from 'src/components/types';

type RepositoryNavigationProps = {
  linkComponent: ComponentType<any>;
  menuItems: MenuItem[];
  selectedMenuItem?: MenuItem;
  history: RouteComponentProps['history'];
};

const getPieces = createSelector(
  getCurrentRepository,
  (repository: Repository) => {
    if (!repository) {
      return {};
    }

    return {
      isPrivate: repository.is_private,
      name: repository.name,
      htmlUrl: repository.links.html.href,
      avatarUrl: repository.links.avatar.href,
    };
  }
);

const RepositoryNavigationNext = withRouter(
  ({
    history,
    ...restProps
  }: RepositoryNavigationProps & RouteComponentProps) => {
    const {
      isPrivate = false,
      name = '',
      htmlUrl = '',
      avatarUrl = '',
    } = useSelector(getPieces, shallowEqual);
    const isJiraRepoPageM2Enabled = useSelector<BucketState, boolean>(
      getIsJiraRepoPageM2Enabled
    );

    return (
      <ContainerNavigationNext
        {...restProps}
        history={history} // React router history is required for nested navigation.
        isGlobalContext={false}
        isPrivate={isPrivate}
        containerName={name}
        containerHref={htmlUrl}
        containerLogo={avatarUrl}
        isJiraRepoPageM2Enabled={isJiraRepoPageM2Enabled}
      />
    );
  }
);

export default RepositoryNavigationNext;

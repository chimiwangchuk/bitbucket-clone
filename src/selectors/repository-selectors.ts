import { get } from 'lodash-es';
import { denormalize } from 'normalizr';
import { Selector, createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { findNestedMenuItem } from 'src/components/navigation/src/utils/create-nested-menu';
import { Repository, User, Team } from 'src/components/types';

import { repository as repoSchema } from 'src/sections/repository/schemas';
import { BucketState } from 'src/types/state';
import { Mirror } from 'src/sections/repository/types';

import { getIsLeaveRepositoryEnabled } from 'src/selectors/feature-selectors';
import { MenuItem } from 'src/components/navigation';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { BranchingModelState } from 'src/redux/branches/reducers/branch-list-reducer';

import {
  getEntities,
  getRecentlyViewedRepositoriesKeys as getRecentlyViewedRepositoryKeys,
  getRepository,
} from './state-slicing-selectors';

const getCurrentRepositoryKey: Selector<
  BucketState,
  string | null | undefined
> = createSelector(
  getRepository,
  repository =>
    repository && repository.section && repository.section.currentRepository
);

export const getCurrentRepository: Selector<
  BucketState,
  Repository | undefined
> = createSelector(getCurrentRepositoryKey, getEntities, (key, entities) =>
  denormalize(key, repoSchema, entities)
);

export const getCurrentRepositorySshCloneLink = createSelector(
  getCurrentRepository,
  repo => {
    if (!repo) {
      return null;
    }
    return repo.links.clone[1].href;
  }
);

export const getRepositoryBranchingModel: Selector<
  BucketState,
  BranchingModelState
> = createSelector(
  getRepository,
  repository => repository.branches.branchList.branchingModel
);

export const getCurrentRepositoryMainBranchName: Selector<
  BucketState,
  string | undefined
> = createSelector(getCurrentRepository, currentRepository =>
  currentRepository && currentRepository.mainbranch
    ? currentRepository.mainbranch.name
    : undefined
);

export const getRepositoryMainBranch: Selector<
  BucketState,
  object | null | undefined
> = createSelector(getRepository, repository => repository.details.mainBranch);

export const getMenuItems: Selector<BucketState, MenuItem[]> = createSelector(
  getRepository,
  repository => repository.section.menuItems
);

export const getCurrentRepositoryFullSlug: Selector<
  BucketState,
  string | null | undefined
> = createSelector(getCurrentRepository, currentRepository =>
  currentRepository ? currentRepository.full_name : null
);

export const getCurrentRepositoryOwnerName: Selector<
  BucketState,
  string
> = createSelector(getCurrentRepository, currentRepository =>
  currentRepository ? currentRepository.full_name.split('/')[0] : ''
);

export const getCurrentRepositoryOwner: Selector<
  BucketState,
  User | Team | null | undefined
> = createSelector(getCurrentRepository, currentRepository =>
  currentRepository ? currentRepository.owner : null
);

export const getCurrentRepositorySlug: Selector<
  BucketState,
  string | null | undefined
> = createSelector(getCurrentRepository, currentRepository =>
  currentRepository ? currentRepository.full_name.split('/')[1] : null
);

export const getCurrentRepositoryScm: Selector<
  BucketState,
  'git' | 'hg'
> = createSelector(getCurrentRepository, currentRepository =>
  currentRepository && currentRepository.scm ? currentRepository.scm : 'git'
);

export const getCurrentRepositoryUuid: Selector<
  BucketState,
  string | null | undefined
> = createSelector(getCurrentRepository, currentRepository =>
  currentRepository ? currentRepository.uuid : null
);

export const getRecentlyViewedRepositories: Selector<
  BucketState,
  Repository[]
> = createSelector(
  getRecentlyViewedRepositoryKeys,
  getEntities,
  (keys, entities) =>
    // We might have some UUIDs in redux that map to a model that's pending fetching or that
    // no longer exists, so we filter those results out (that denormalize to `undefined`)
    // @ts-ignore TODO: fix noImplicitAny error here
    denormalize(keys, [repoSchema], entities).filter(entity => !!entity)
);

export const getRecentlyViewedRepositoryCount: Selector<
  BucketState,
  number
> = createSelector(getRecentlyViewedRepositoryKeys, keys => keys.length);

export const getRepositoryDetails = createSelector(
  getRepository,
  getEntities,
  (currentRepository, entities) => ({
    accessLevel: currentRepository.details.accessLevel,
    branchCount: currentRepository.details.branchCount,
    commitsBehindParent: currentRepository.details.commitsBehindParent,
    directAccess: currentRepository.details.directAccess,
    forkCount: currentRepository.details.forkCount,
    groupAccess: currentRepository.details.groupAccess,
    hasError: currentRepository.details.hasError,
    isLoading: currentRepository.details.isLoading,
    isReadOnly: currentRepository.details.isReadOnly,
    language: currentRepository.details.language,
    lastUpdated: currentRepository.details.lastUpdated,
    openPullRequestCount: currentRepository.details.openPullRequestCount,
    parent: denormalize(currentRepository.details.parent, repoSchema, entities),
    size: currentRepository.details.size,
    watcherCount: currentRepository.details.watcherCount,
  })
);

export const getRepositoryAccessLevel = createSelector(
  getRepositoryDetails,
  repositoryDetails =>
    repositoryDetails ? repositoryDetails.accessLevel : undefined
);

export const getHasRepositoryDirectAccess = createSelector(
  getRepositoryDetails,
  repositoryDetails =>
    repositoryDetails ? !!repositoryDetails.directAccess : undefined
);

export const getHasRepositoryGroupAccess = createSelector(
  getRepositoryDetails,
  repositoryDetails =>
    repositoryDetails
      ? !!repositoryDetails.groupAccess &&
        repositoryDetails.groupAccess.length > 0
      : undefined
);

export const getRepositoryMirrors: Selector<
  BucketState,
  Mirror[] | null
> = createSelector(getRepository, repository => repository.section.mirrors);

export const getRepositorySourceTreeHasXcode: Selector<
  BucketState,
  boolean
> = createSelector(getRepository, repository =>
  get(repository, 'source.section.fileTree.tree.contents', []).some(
    // @ts-ignore TODO: fix noImplicitAny error here
    ({ type, name }) =>
      type === 'directory' &&
      (name.endsWith('.xcodeproj') || name.endsWith('.xcworkspace'))
  )
);

export const isSyncDialogOpen: Selector<BucketState, boolean> = createSelector(
  getRepository,
  repository => repository.section.isSyncDialogOpen
);

export const getCanLeaveRepository: Selector<
  BucketState,
  boolean
> = createSelector(
  getCurrentUser,
  getCurrentRepository,
  getRepositoryDetails,
  getIsLeaveRepositoryEnabled,
  (currentUser, currentRepo, repoDetails, isLeaveRepoEnabled) => {
    const hasCurrentUser = !!currentUser;
    const hasCurrentRepo = !!currentRepo;

    if (!hasCurrentUser || !hasCurrentRepo) {
      return false;
    }

    const hasDirectAccess = !!repoDetails.directAccess;
    const hasGroupAccess = !!(
      repoDetails.groupAccess && repoDetails.groupAccess.length > 0
    );

    const isNotRepoOwner = !!(
      currentRepo &&
      currentUser &&
      currentRepo.owner &&
      currentRepo.owner.uuid &&
      currentRepo.owner.uuid !== currentUser.uuid
    );

    return (
      isLeaveRepoEnabled &&
      (hasDirectAccess || hasGroupAccess) &&
      isNotRepoOwner
    );
  }
);

const repoSettingsPathRegex = new RegExp(/^\/\S+\/\S+\/admin/);

export const getSelectedMenuItem = createCachedSelector(
  getMenuItems,
  (_state: BucketState, pathname: string, matchUrl: string) => ({
    pathname,
    matchUrl,
  }),
  (menuItems, { pathname, matchUrl }) =>
    findNestedMenuItem(menuItems, item => {
      const repositorySubpath = pathname.slice(matchUrl.length);
      const prefixes = item.matching_url_prefixes || [];
      const itemUrl = item.url.replace(/\/$/, '');

      if (repoSettingsPathRegex.test(pathname)) {
        // This conditional checks if the current path is under the admin (settings) section of the repo path structure.
        // The pathname and item url comparison is exact because some of the settings menu item urls are subpaths of the others.
        return pathname.replace(/\/$/, '') === itemUrl;
      } else {
        return (
          pathname.indexOf(itemUrl) === 0 ||
          prefixes.some(prefix => repositorySubpath.indexOf(prefix) === 0)
        );
      }
    })
)((_state, pathname, matchUrl) => `${matchUrl}:${pathname}`);

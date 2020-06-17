import { createSelector, Selector } from 'reselect';

import { BucketState } from 'src/types/state';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { ProfileSectionState, isTeam } from './section/types';

// @ts-ignore TODO: fix noImplicitAny error here
const getProfileStateSlice = state => state.profile;

export const getProfileRepositoriesStateSlice = createSelector(
  getProfileStateSlice,
  profile => profile.repositories
);
export const getProfileRepositoriesLanguagesStateSlice = createSelector(
  getProfileStateSlice,
  profile => profile.repositoriesLanguages
);

export const getProfileSectionStateSlice: Selector<
  BucketState,
  ProfileSectionState
> = createSelector(getProfileStateSlice, profile => profile.section);

export const getProfileMenuItems = createSelector(
  getProfileSectionStateSlice,
  section => section.menuItems
);

export const getCurrentProfileUser = createSelector(
  getProfileSectionStateSlice,
  section => section.currentUser
);

export const getActiveMenuItem = createSelector(
  getProfileSectionStateSlice,
  section => section.activeMenuItem
);

export const getRepositoriesLanguages = createSelector(
  getProfileRepositoriesLanguagesStateSlice,
  repositoriesLanguages => repositoriesLanguages.languages
);

export const getCurrentWorkspace = createSelector(
  getProfileSectionStateSlice,
  section => section.currentWorkspace
);

export type ProfileNavigationPieces = {
  avatarUrl: string;
  htmlUrl: string;
  name: string;
};

export const getProfileNavigationPieces: Selector<
  BucketState,
  ProfileNavigationPieces | undefined
> = createSelector(
  getCurrentProfileUser,
  getCurrentWorkspace,
  (currentUser, currentWorkspace) => {
    if (currentWorkspace) {
      return {
        name: currentWorkspace.name,
        htmlUrl: currentWorkspace.links.html.href,
        avatarUrl: currentWorkspace.links.avatar.href,
      };
    }

    if (currentUser) {
      return {
        name: currentUser.display_name,
        htmlUrl: currentUser.links.html ? currentUser.links.html.href : '',
        avatarUrl: currentUser.links.avatar.href,
      };
    }

    return undefined;
  }
);

export type ProfileUpgradeBannerPieces = {
  uuid: string;
  hasPremium: boolean | undefined;
  isAdmin: boolean;
};

export const getProfileUpgradeBannerPieces: Selector<
  BucketState,
  ProfileUpgradeBannerPieces | undefined
> = createSelector(
  getCurrentProfileUser,
  getCurrentWorkspace,
  (currentUser, currentWorkspace) => {
    if (currentWorkspace && currentWorkspace.extra) {
      return {
        uuid: currentWorkspace.uuid,
        hasPremium: currentWorkspace.extra.has_premium,
        isAdmin: currentWorkspace.extra.admin_status === 'admin',
      };
    }

    if (currentUser && isTeam(currentUser) && currentUser.extra) {
      return {
        uuid: currentUser.uuid,
        hasPremium: currentUser.extra.has_premium,
        isAdmin: currentUser.extra.admin_status === 'admin',
      };
    }

    return undefined;
  }
);

export const getIsProfileAdminStatus = createSelector(
  getCurrentProfileUser,
  getCurrentWorkspace,
  getCurrentUser,
  (currentUser, currentWorkspace, globalCurrentUser) => {
    if (currentWorkspace && currentWorkspace.extra) {
      return (
        currentWorkspace.extra.admin_status === 'admin' ||
        currentWorkspace.extra.admin_status === 'collaborator'
      );
    }

    if (
      currentUser &&
      globalCurrentUser &&
      currentUser.uuid === globalCurrentUser.uuid
    ) {
      return true;
    }

    if (currentUser && isTeam(currentUser) && currentUser.extra) {
      return (
        currentUser.extra.admin_status === 'admin' ||
        currentUser.extra.admin_status === 'collaborator'
      );
    }
    return undefined;
  }
);

export const getProfileUuid = createSelector(
  getCurrentWorkspace,
  getCurrentProfileUser,
  (profileWorkspace, profileUser) => {
    if (profileWorkspace) {
      return profileWorkspace.uuid;
    }

    if (profileUser) {
      return profileUser.uuid;
    }

    return null;
  }
);

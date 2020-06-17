import { createSelector } from 'reselect';
import { get } from 'lodash-es';
import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '@atlaskit/atlassian-navigation';

import { BucketState } from 'src/types/state';
import { GlobalState } from 'src/redux/global/reducer';
import { getGlobal } from 'src/selectors/state-slicing-selectors';
import { shouldDisplayFlag } from 'src/sections/global/components/flags/site-message/site-message-store';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { BANNER_HEIGHT } from 'src/constants/navigation';
import { getIsHorizontalNavEnabled } from './feature-selectors';

export const getIsNavigationOpen = createSelector(
  getGlobal,
  (state: GlobalState) => state.isNavigationOpen
);

export const getIsSearchDrawerOpen = createSelector(
  getGlobal,
  (state: GlobalState) => state.isSearchDrawerOpen
);

export const getIsMobileHeaderActive = createSelector(
  getGlobal,
  (state: GlobalState) => state.isMobileHeaderActive
);

export const getMobileHeaderState = createSelector(
  getGlobal,
  (state: GlobalState) => state.mobileHeaderState
);

export const getUpToSmallBreakpointState = createSelector(
  getGlobal,
  (state: GlobalState) => state.isUpToSmallBreakpointActive
);

export const siteMessagesForAppearance = (
  state: BucketState,
  targetAppearance: 'flag' | 'banner'
) => {
  const siteMessage = get(state, 'global.siteMessage');
  const currentUser = getCurrentUser(state);

  if (!siteMessage || !currentUser) {
    return null;
  }

  return (
    !getIsMobileHeaderActive(state) &&
    siteMessage.appearance === targetAppearance &&
    // Banners cannot be dismissed, so we only need to check the "should display" status for Flags.
    (siteMessage.appearance === 'banner' ||
      shouldDisplayFlag(currentUser.uuid, siteMessage.id)) &&
    // Must set this line last, so it returns the siteMessage itself
    siteMessage
  );
};

// Note: Statuspage incident banners will override any Django/manually created Site Messages
export const getSiteMessageBanner = (state: BucketState) => {
  const statuspageIncident = get(
    state,
    'global.siteMessageStatuspageIncident',
    null
  );
  if (statuspageIncident) {
    return statuspageIncident;
  }
  return siteMessagesForAppearance(state, 'banner');
};

export const getSiteMessageFlag = (state: BucketState) =>
  siteMessagesForAppearance(state, 'flag');

export const getCombinedBannerAndHorizontalNavHeight = (
  state: BucketState,
  isBeingRenderedInsideMobileNav: boolean
) => {
  // Note: the HORIZONTAL_GLOBAL_NAV_HEIGHT is only relevant if *not*
  // being rendered *inside* the mobile nav. This means that the calculation
  // is for a component rendered inside the mobile nav panel, it is not
  // always relevant even if the mobile nav is visible.
  const bannerHeight = getSiteMessageBanner(state) ? BANNER_HEIGHT : 0;
  const horizontalNavHeight =
    getIsHorizontalNavEnabled(state) &&
    !getIsMobileHeaderActive(state) &&
    !isBeingRenderedInsideMobileNav
      ? HORIZONTAL_GLOBAL_NAV_HEIGHT
      : 0;
  return bannerHeight + horizontalNavHeight;
};

export const getIsPageVisible = createSelector(
  getGlobal,
  (state: GlobalState) => state.isPageVisible
);

export const getIsOffline = createSelector(
  getGlobal,
  (state: GlobalState) => state.isOffline
);

export const getHasLoadedIssues = createSelector(
  getGlobal,
  (state: GlobalState) => state.hasLoadedIssues
);

export const getIsLoadingIssues = createSelector(
  getGlobal,
  (state: GlobalState) => state.isLoadingIssues
);

export const getHasLoadedPullRequests = createSelector(
  getGlobal,
  (state: GlobalState) => state.hasLoadedPullRequests
);

export const getIsLoadingPullRequests = createSelector(
  getGlobal,
  (state: GlobalState) => state.isLoadingPullRequests
);

export const getHasLoadedRepositories = createSelector(
  getGlobal,
  (state: GlobalState) => state.hasLoadedRepositories
);

export const getIsLoadingRepositories = createSelector(
  getGlobal,
  (state: GlobalState) => state.isLoadingRepositories
);

export const getRepositoryPageLoadingStatus = createSelector(
  getGlobal,
  (state: GlobalState) => state.repositoryPageLoadingStatus
);

export const getCurrentUserEmail = createSelector(
  getGlobal,
  (state: GlobalState) => state.currentUserEmail
);

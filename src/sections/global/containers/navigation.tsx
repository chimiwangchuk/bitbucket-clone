import React, { ComponentType } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as Sentry from '@sentry/browser';
import {
  filterRepositories,
  ResizeEvent,
  MenuItem,
} from '@atlassian/bitbucket-navigation';
import { SearchTargetUserProps } from '@atlassian/bitbucket-navigation/src/components/search';
import { ReposContext } from '@atlassian/bitbucket-navigation/src/components/contexts';
import { GlobalNavigationListenerProps } from '@atlassian/bitbucket-navigation/src/components/global-navigation-next';

import RepositoryLink from 'src/components/repository-link';
import PullRequestLink from 'src/components/pull-request-link';

import { BANNER_HEIGHT } from 'src/constants/navigation';
import toggleCloneDialog from 'src/sections/repository/actions/toggle-clone-dialog';
import {
  getIsHorizontalNavEnabled,
  getIsXFlowIntegrationRolloutEnabled,
  getIsXFlowIntegrationSwitchEnabled,
} from 'src/selectors/feature-selectors';
import {
  getIsNavigationOpen,
  getIsMobileHeaderActive,
  getSiteMessageBanner,
} from 'src/selectors/global-selectors';
import {
  getRecentlyViewedRepositories,
  getCurrentRepository,
} from 'src/selectors/repository-selectors';
import { getRecentlyViewedWorkspacesKeys } from 'src/selectors/workspace-selectors';
import settings from 'src/settings';
import { BucketState, BucketDispatch } from 'src/types/state';
import scoreString from 'src/utils/score-string';
import { getCurrentUser, getTargetUser } from 'src/selectors/user-selectors';
import { SEARCH_DRAWER_INIT } from 'src/redux/global/actions';
import search from 'src/redux/global/actions/search';
import toggleCreateDrawer from 'src/redux/global/actions/toggle-create-drawer';
import toggleAtlassianSwitcher from 'src/redux/global/actions/toggle-atlassian-switcher';
import toggleKeyboardShortcutMenu from 'src/redux/global/actions/toggle-keyboard-shortcut-menu';
import updateNavigationState from 'src/redux/global/actions/update-navigation-state';
import toggleSearchDrawer from 'src/redux/global/actions/toggle-search-drawer';
import {
  publishScreenEvent,
  publishUiEvent,
  publishOperationalEvent,
  publishTrackEvent,
} from 'src/utils/analytics/publish';
import { getBbEnv } from 'src/utils/bb-env';

import NavigationNext, {
  NavigationNextStateProps,
} from '@atlassian/bitbucket-navigation/src/components/index-next';

const MAX_QUICK_RESULTS = 10;

const getSearchResults = createSelector(
  (state: BucketState) => state.global.searchQuery,
  (state: BucketState) => state.global.issues,
  (state: BucketState) => state.global.pullRequests,
  (state: BucketState) => state.global.repositories,
  (query, issues, pullRequests, repositories) => {
    if (!query) {
      return {
        issues,
        pullRequests,
        repositories: repositories.slice(0, MAX_QUICK_RESULTS),
      };
    }

    return {
      issues: issues.filter(i => !!scoreString(i.title, query)),
      pullRequests: pullRequests.filter(p => !!scoreString(p.title, query)),
      repositories: filterRepositories(repositories, query, MAX_QUICK_RESULTS),
    };
  }
);

const mapStateToProps = (state: BucketState): NavContainerStateProps => {
  const currentRepo = getCurrentRepository(state);
  const currentUser = getCurrentUser(state) || undefined;

  // User pieces to avoid rerender thrash from denormalizing
  const userPieces = {
    hasAtlassianAccount:
      currentUser && currentUser.extra
        ? !!currentUser.extra.has_atlassian_account
        : false,
    userAccountStatus: currentUser && currentUser.account_status,
    userDisplayName: currentUser && currentUser.display_name,
    userAvatarUrl: currentUser && currentUser.links.avatar.href,
    userHtmlUrl:
      currentUser && currentUser.links.html && currentUser.links.html.href,
    userUuid: currentUser && currentUser.uuid,
    userWorkspaceId:
      currentUser && currentUser.extra && currentUser.extra.workspace_id,
  };

  const targetUser = getTargetUser(state) || undefined;
  // Target user pieces to avoid rerender trash from denormalizing
  const targetUserPieces: SearchTargetUserProps = {
    targetUserDisplayName: targetUser && targetUser.display_name,
    targetUserUuid: targetUser && targetUser.uuid,
  };

  return {
    aaLogoutUrl: settings.SOCIAL_AUTH_ATLASSIANID_LOGOUT_URL,
    bbEnv: getBbEnv(),
    canonUrl: settings.CANON_URL,
    globalBitbucketActions: state.global.bitbucketActions,
    importBitbucketActions: state.global.importBitbucketActions,
    isGrowthJoinableSitesCalculationEnabled:
      state.global.features['growth-joinable-sites-calculation'],
    isGrowthJoinSectionInAtlassianSwitcherEnabled:
      state.global.features['growth-join-section-in-atlassian-switcher'],
    isHorizontalNavEnabled: getIsHorizontalNavEnabled(state),
    isAtlassianSwitcherOpen: state.global.isAtlassianSwitcherOpen,
    isCreateDrawerOpen: state.global.isCreateDrawerOpen,
    isLoading:
      state.global.isLoadingIssues ||
      state.global.isLoadingPullRequests ||
      state.global.isLoadingRepositories,
    isMobileHeaderActive: getIsMobileHeaderActive(state),
    isNavigationOpen: getIsMobileHeaderActive(state)
      ? true
      : getIsNavigationOpen(state),
    isSearchDrawerOpen: state.global.isSearchDrawerOpen,
    isXFlowIntegrationRolloutEnabled: getIsXFlowIntegrationRolloutEnabled(
      state
    ),
    isXFlowIntegrationSwitchEnabled: getIsXFlowIntegrationSwitchEnabled(state),
    hasLoaded:
      state.global.hasLoadedIssues &&
      state.global.hasLoadedPullRequests &&
      state.global.hasLoadedRepositories,
    hasDarkNavTheme: state.global.features['theme-dark-nav'],
    hasPride: state.global.features['pride-logo'],
    hasWorkspaceUi: state.global.features['workspace-ui'],
    horizontalNavigationItems: state.global.horizontalNavigationItems,
    recentlyViewed: getRecentlyViewedRepositories(state),
    repoName: currentRepo ? currentRepo.name : undefined,
    repoSlug: currentRepo ? currentRepo.slug : undefined,
    searchQuery: state.global.searchQuery,
    searchResults: getSearchResults(state),
    ...targetUserPieces,
    teams: state.global.teams,
    recentlyViewedWorkspacesKeys: getRecentlyViewedWorkspacesKeys(state),
    topOffset: getSiteMessageBanner(state) ? BANNER_HEIGHT : undefined,
    ...userPieces,
    isWhatsNewEnabled: state.global.features['whats-new'],
    whatsNewUrl: state.global.whatsNewUrl,
  };
};

const mapDispatchToProps = (
  dispatch: BucketDispatch
): NavContainerDispatchProps => ({
  onCloneClick: () => {
    dispatch(toggleCreateDrawer(false));
    dispatch(toggleCloneDialog(true));
  },
  onCreateDrawerClose: () => dispatch(toggleCreateDrawer(false)),
  onCreateDrawerOpen: () => dispatch(toggleCreateDrawer(true)),
  onKeyboardShortcutsActivated: () =>
    dispatch(toggleKeyboardShortcutMenu(true)),
  onResize: (event: ResizeEvent) =>
    dispatch(updateNavigationState(event.isOpen)),
  // @ts-ignore Property 'value' does not exist on type 'EventTarget & Element'
  onSearch: event => dispatch(search(event.target.value)),
  onSearchDrawerClose: () => dispatch(toggleSearchDrawer(false)),
  onSearchDrawerInit: () => dispatch({ type: SEARCH_DRAWER_INIT }),
  onSearchDrawerOpen: () => dispatch(toggleSearchDrawer(true)),
  onToggleAtlassianSwitcher: (isOpen: boolean) =>
    dispatch(toggleAtlassianSwitcher(isOpen)),
});

type NavContainerOwnProps = {
  children?: React.ReactNode;
  containerBitbucketActions?: MenuItem[];
  containerConnectActions?: MenuItem[];
  containerName?: string;
  containerHref?: string;
  containerLogo?: string;
  containerLinkComponent?: ComponentType;
  isBeingRenderedInsideMobileNav: boolean;
  isPrivate?: boolean;
  isGlobalContext: boolean;
  linkComponent?: ComponentType;
  navigationType?: 'container' | 'product';
  renderNavigation?: any;
  onProductClick?: () => void;
};

type NavContainerDispatchProps = Omit<
  GlobalNavigationListenerProps,
  'publishUiEvent' | 'publishScreenEvent' | 'publishTrackEvent'
> & {
  onResize: (event: ResizeEvent) => void;
};

// We try to pass each user piece all through this component to avoid re-render thrash from denormalizing user models
type NavContainerStateProps = Omit<
  NavigationNextStateProps,
  'defaultNavigationOpen' | 'isGlobalContext' | 'isBeingRenderedInsideMobileNav'
> & {
  hasLoaded: boolean;
  isLoading: boolean;
  isNavigationOpen: boolean;
  recentlyViewed: BB.Repository[] | undefined;
};

type Props = NavContainerStateProps &
  NavContainerDispatchProps &
  NavContainerOwnProps;

export default connect<
  NavContainerStateProps,
  NavContainerDispatchProps,
  NavContainerOwnProps
>(
  mapStateToProps,
  mapDispatchToProps
)(
  class NavContainer extends React.Component<Props> {
    render() {
      const {
        recentlyViewed,
        isNavigationOpen,
        isMobileHeaderActive,
        ...otherProps
      } = this.props;

      return (
        <ReposContext.Provider value={recentlyViewed}>
          <NavigationNext
            {...otherProps}
            defaultNavigationOpen={isNavigationOpen}
            isMobileHeaderActive={isMobileHeaderActive}
            bbEnv={getBbEnv()}
            publishScreenEvent={publishScreenEvent}
            publishUiEvent={publishUiEvent}
            publishOperationalEvent={publishOperationalEvent}
            publishTrackEvent={publishTrackEvent}
            captureException={Sentry.captureException}
            repositoryLinkComponent={RepositoryLink}
            pullRequestLinkComponent={PullRequestLink}
          />
        </ReposContext.Provider>
      );
    }
  }
);

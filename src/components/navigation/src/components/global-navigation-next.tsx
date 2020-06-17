import React, {
  ChangeEvent,
  ComponentType,
  PureComponent,
  ReactNode,
} from 'react';
import { BitbucketIcon } from '@atlaskit/logo';
// @ts-ignore TODO: fix noImplicitAny error here
import GlobalNavigation from '@atlaskit/global-navigation';
import { InjectedIntl, injectIntl } from 'react-intl';
// @ts-ignore TODO: fix noImplicitAny error here
import { Mode as ThemeMode } from '@atlaskit/navigation-next';
import { BitbucketPrideIcon, IconSizes } from '@atlassian/bitkit-icon';

import {
  MenuItem,
  BbEnv,
  RepositoryGlobalSearchResult,
  PullRequestGlobalSearchResult,
  AnalyticsEvent,
  UiEvent,
} from '../types';
import messages from './global-navigation-next.i18n';
import Search, { SearchTargetUserProps } from './search';
import CreateDrawer from './create-drawer';
import HelpMenu from './help-menu';
import AccountMenu, { AccountMenuUserProps } from './account-menu';
import AtlassianSwitcher from './atlassian-switcher/atlassian-switcher';
import { BlogFetch } from './blog-fetch';
import * as styles from './global-navigation-next.style';

const CREATE_DRAWER_WIDTH = 'narrow';

type InjectedProps = {
  intl: InjectedIntl;
};

export type GlobalNavigationListenerProps = {
  onCloneClick: () => void;
  onCreateDrawerClose: () => void;
  onCreateDrawerOpen: () => void;
  onKeyboardShortcutsActivated: () => void;
  onProductClick?: () => void;
  onSearch?: (event: ChangeEvent) => void;
  onSearchDrawerClose: () => void;
  onSearchDrawerInit?: () => void;
  onSearchDrawerOpen?: () => void;
  onSearchSubmit?: () => void;
  onToggleAtlassianSwitcher: (isOpen: boolean) => void;
  publishScreenEvent: (name: string, attributes?: object) => void;
  publishTrackEvent: (event: AnalyticsEvent) => void;
  publishUiEvent: (event: UiEvent) => void;
};

export type GlobalNavigationStateProps = AccountMenuUserProps &
  SearchTargetUserProps & {
    aaLogoutUrl: string;
    bbEnv: BbEnv;
    canonUrl: string;
    containerBitbucketActions?: MenuItem[];
    containerConnectActions?: MenuItem[];
    currentProject?: BB.Project;
    repoName?: string;
    repoSlug?: string;
    drawerHeader: ReactNode;
    globalBitbucketActions: MenuItem[];
    themeMode: ThemeMode;
    hasPride: boolean;
    hasWorkspaceUi?: boolean;
    importBitbucketActions: MenuItem[];
    isAtlassianSwitcherOpen: boolean;
    isCreateDrawerOpen: boolean;
    isGrowthJoinableSitesCalculationEnabled: boolean;
    isGrowthJoinSectionInAtlassianSwitcherEnabled: boolean;
    isLoading: boolean;
    isNavigationOpen: boolean;
    isSearchDrawerOpen: boolean;
    isWhatsNewEnabled: boolean;
    isXFlowIntegrationRolloutEnabled: boolean;
    isXFlowIntegrationSwitchEnabled: boolean;
    linkComponent?: ComponentType<any>;
    pullRequestLinkComponent?: ComponentType;
    repositoryLinkComponent?: ComponentType;
    searchQuery?: string;
    searchResults?: {
      issues: BB.Issue[];
      pullRequests: PullRequestGlobalSearchResult[];
      repositories: RepositoryGlobalSearchResult[];
    };
    teams: BB.Team[];
    recentlyViewedWorkspacesKeys?: string[];
    whatsNewUrl?: string;
  };

export type GlobalNavigationNextProps = GlobalNavigationListenerProps &
  GlobalNavigationStateProps & { captureException: (e: Error) => void };

type Props = InjectedProps & GlobalNavigationNextProps;

class GlobalNavigationNext extends PureComponent<Props> {
  static defaultProps = {
    hasWorkspaceUi: false,
  };

  renderCreateDrawerContents = () => {
    const { props } = this;
    return (
      <CreateDrawer
        containerBitbucketActions={props.containerBitbucketActions}
        containerConnectActions={props.containerConnectActions}
        drawerHeader={props.drawerHeader}
        globalBitbucketActions={props.globalBitbucketActions}
        importBitbucketActions={props.importBitbucketActions}
        onCloneClick={props.onCloneClick}
        onCreateDrawerClose={props.onCreateDrawerClose}
        linkComponent={props.linkComponent}
        publishUiEvent={props.publishUiEvent}
      />
    );
  };

  renderSearchDrawerContents = () => {
    const { props } = this;
    return (
      <Search
        repoName={props.repoName}
        repoSlug={props.repoSlug}
        currentProject={props.currentProject}
        isLoading={props.isLoading}
        isLoggedIn={this.isLoggedIn()}
        linkComponent={props.linkComponent}
        onSearch={props.onSearch}
        onSearchDrawerInit={props.onSearchDrawerInit}
        onSearchSubmit={props.onSearchSubmit}
        searchQuery={props.searchQuery}
        searchResults={props.searchResults}
        targetUserDisplayName={props.targetUserDisplayName}
        targetUserUuid={props.targetUserUuid}
        repositoryLinkComponent={props.repositoryLinkComponent}
        pullRequestLinkComponent={props.pullRequestLinkComponent}
        isSearchDrawerOpen={props.isSearchDrawerOpen}
        onSearchDrawerClose={props.onSearchDrawerClose}
        publishUiEvent={props.publishUiEvent}
      />
    );
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  renderHelpMenu = (blogs, newBlogCount: number, storeLastSeenBlog) => {
    const { props } = this;

    return (
      <HelpMenu
        onKeyboardShortcutsActivated={props.onKeyboardShortcutsActivated}
        isWhatsNewEnabled={props.isWhatsNewEnabled}
        key="help-menu"
        blogs={blogs}
        newBlogCount={newBlogCount}
        storeLastSeenBlog={storeLastSeenBlog}
        isAkDropdown
      />
    );
  };

  renderHelpBadge = (isWhatsNewEnabled: boolean, newBlogCount: number) => {
    return isWhatsNewEnabled && newBlogCount ? (
      <styles.HelpBadge parentColor={this.getParentColor()} />
    ) : null;
  };

  renderAccountMenu = () => {
    const { props } = this;
    return (
      <AccountMenu
        aaLogoutUrl={props.aaLogoutUrl}
        canonUrl={props.canonUrl}
        isAkDropdown
        teams={props.teams}
        recentlyViewedWorkspacesKeys={props.recentlyViewedWorkspacesKeys}
        hasWorkspaceUi={props.hasWorkspaceUi}
        hasAtlassianAccount={props.hasAtlassianAccount}
        userAccountStatus={props.userAccountStatus}
        userAvatarUrl={props.userAvatarUrl}
        userDisplayName={props.userDisplayName}
        userHtmlUrl={props.userHtmlUrl}
        userUuid={props.userUuid}
        userWorkspaceId={props.userWorkspaceId}
        key="acct-menu"
      />
    );
  };

  renderAppSwitcher = () => {
    const { props } = this;
    return (
      <AtlassianSwitcher
        key="atlassian-switcher"
        captureException={props.captureException}
        isAtlassianSwitcherOpen={props.isAtlassianSwitcherOpen}
        isGrowthJoinableSitesCalculationEnabled={
          props.isGrowthJoinableSitesCalculationEnabled
        }
        isGrowthJoinSectionInAtlassianSwitcherEnabled={
          props.isGrowthJoinSectionInAtlassianSwitcherEnabled
        }
        isXFlowIntegrationSwitchEnabled={props.isXFlowIntegrationSwitchEnabled}
        isXFlowIntegrationRolloutEnabled={
          props.isXFlowIntegrationRolloutEnabled
        }
        isLoggedIn={this.isLoggedIn()}
        onToggleAtlassianSwitcher={props.onToggleAtlassianSwitcher}
        publishTrackEvent={props.publishTrackEvent}
        userUuid={props.userUuid}
      />
    );
  };

  getParentColor = () => {
    return this.props.themeMode.globalNav().backgroundColor;
  };

  isLoggedIn = () => {
    return Boolean(this.props.userUuid);
  };

  handleProductClick = (e: React.MouseEvent) => {
    const { onProductClick } = this.props;

    // Following checks are for not preventing the "open in tab" action:
    if (e.metaKey) {
      // e.metaKey is 'true' for cmd + click on Mac.
      return;
    }
    if (e.ctrlKey) {
      // e.ctrlKey is 'true' for ctrl + click on Windows.
      return;
    }
    if (e.button === 1) {
      // e.button is '1' when mouse middle button is clicked.
      return;
    }

    if (this.isLoggedIn() && onProductClick) {
      // 'preventDefault' is to avoid full page reload for SPA transitions.
      e.preventDefault();
      onProductClick();
    }
  };

  getBitbucketIcon = () => {
    const { hasPride } = this.props;

    if (hasPride) {
      return <BitbucketPrideIcon label="Bitbucket" size={IconSizes.Large} />;
    } else {
      return <BitbucketIcon label="Bitbucket" size={IconSizes.Large} />;
    }
  };

  render() {
    const { props } = this;
    const { intl, userUuid, userAvatarUrl } = this.props;

    const createDrawerProps = this.isLoggedIn()
      ? {
          createDrawerWidth: CREATE_DRAWER_WIDTH,
          createDrawerContents: this.renderCreateDrawerContents,
          isCreateDrawerOpen: props.isCreateDrawerOpen,
          onCreateClick: props.onCreateDrawerOpen,
          onCreateDrawerClose: props.onCreateDrawerClose,
          createTooltip: intl.formatMessage(messages.createButtonTooltip),
        }
      : {};

    // search drawer will always show
    const searchDrawerProps = {
      isSearchDrawerOpen: props.isSearchDrawerOpen,
      onSearchClick: props.onSearchDrawerOpen,
      onSearchDrawerClose: props.onSearchDrawerClose,
      searchTooltip: intl.formatMessage(messages.searchButtonTooltip),
      searchDrawerContents: this.renderSearchDrawerContents,
    };

    return (
      <BlogFetch
        url={props.isWhatsNewEnabled ? props.whatsNewUrl : undefined}
        // At the moment this UUID is only used directly in the help menu for localStorage,
        // and we want to keep showing the help menu to unauthenticated users.
        currentUserUuid={userUuid || 'anonymous'}
      >
        {({ blogs, newBlogCount, storeLastSeenBlog }) => (
          <GlobalNavigation
            appSwitcherComponent={this.renderAppSwitcher}
            // product
            productIcon={this.getBitbucketIcon}
            productHref="/"
            productTooltip={intl.formatMessage(messages.homeButtonTooltip, {
              Product_Name: 'Bitbucket',
            })}
            onProductClick={this.handleProductClick}
            // create
            {...createDrawerProps}
            // search
            {...searchDrawerProps}
            // help
            helpItems={() =>
              this.renderHelpMenu(blogs, newBlogCount, storeLastSeenBlog)
            }
            helpTooltip={intl.formatMessage(messages.helpButtonTooltip)}
            helpBadge={() =>
              this.renderHelpBadge(props.isWhatsNewEnabled, newBlogCount)
            }
            // profile
            profileItems={this.renderAccountMenu}
            profileIconUrl={userAvatarUrl}
            profileTooltip={
              userUuid
                ? intl.formatMessage(messages.loggedInUserTooltip)
                : intl.formatMessage(messages.anonymousUserTooltip)
            }
          />
        )}
      </BlogFetch>
    );
  }
}

export default injectIntl(GlobalNavigationNext);

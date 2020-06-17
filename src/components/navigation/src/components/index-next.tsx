import keycode from 'keycode';
import memoize from 'memoize-one';
import React, { ComponentType, PureComponent, ReactNode } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Loadable from 'react-loadable';
import {
  LayoutManager,
  NavigationProvider,
  ThemeProvider,
  UIControllerSubscriber,
  UIControllerInterface,
  // @ts-ignore TODO: fix noImplicitAny error here
} from '@atlaskit/navigation-next';
import { ResizeEvent, AnalyticsEvent, Product, MenuItem } from '../types';
import { getJoinableSitesWithRelevance } from '../utils/joinable-sites';
import waitForReactRender from '../utils/wait-for-render';
import messages from './index-next.i18n';
import GlobalNavigationNext, {
  GlobalNavigationStateProps,
  GlobalNavigationListenerProps,
} from './global-navigation-next';
import DrawerHeader from './drawer-header';
import { dark, light, settings, siteSettings } from './theme-modes';

const COLLAPSE_TOGGLE_SHORTCUT = '[';
const OPEN_STATE = {
  EXPANDED: 'expanded',
  COLLAPSED: 'collapsed',
};

type InjectedProps = {
  intl: InjectedIntl;
};

type PassThroughProps = Omit<
  GlobalNavigationStateProps,
  'drawerHeader' | 'themeMode' | 'isNavigationOpen'
>;

const HorizontalNav = Loadable({
  loading: () => null,
  loader: () =>
    import(
      /* webpackChunkName: "horizontal-navigation" */ './horizontal-nav/horizontal-navigation'
    ),
});

export type NavigationNextListenerProps = GlobalNavigationListenerProps & {
  onResize: (event: ResizeEvent) => void;
  publishOperationalEvent: (event: AnalyticsEvent) => void;
  captureException: (e: Error) => void;
};

export type NavigationNextStateProps = PassThroughProps & {
  children?: ReactNode;
  containerHref?: string;
  containerLinkComponent?: ComponentType<any>;
  containerLogo?: string;
  containerName?: string;
  currentProject?: BB.Project;
  defaultNavigationOpen: boolean;
  hasDarkNavTheme: boolean;
  hasSettingsNavTheme?: boolean;
  hasSiteSettingsNavTheme?: boolean;
  horizontalNavigationItems?: MenuItem[];
  isBeingRenderedInsideMobileNav: boolean;
  isCreateDrawerOpen: boolean;
  isGrowthJoinableSitesCalculationEnabled: boolean;
  isGrowthJoinSectionInAtlassianSwitcherEnabled: boolean;
  isGlobalContext: boolean;
  isHorizontalNavEnabled?: boolean;
  isMobileHeaderActive: boolean;
  isPrivate?: boolean;
  isSearchDrawerOpen: boolean;
  isXFlowIntegrationRolloutEnabled: boolean;
  isXFlowIntegrationSwitchEnabled: boolean;
  navigationType?: 'container' | 'product';
  recentlyViewed?: BB.Repository[];
  renderNavigation?: ComponentType;
  topOffset?: number;
};

type Props = InjectedProps &
  NavigationNextListenerProps &
  NavigationNextStateProps;

type State = Partial<{
  spotlightIsVisible: boolean;
  isCollapsed: boolean;
  collapseButtonRef: HTMLElement | undefined;
}>;

const buildUiController = memoize(
  (isMobileHeaderActive: boolean, isInitiallyCollapsed: boolean) => ({
    isResizeDisabled: isMobileHeaderActive,
    isCollapsed: isInitiallyCollapsed,
  })
);

export class NavigationNext extends PureComponent<Props, State> {
  static defaultProps = {
    hasPride: false,
    hasSettingsNavTheme: false,
    hasSiteSettingsNavTheme: false,
    renderNavigation: () => <div />,
    teams: [],
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleGlobalKeyDown);
    waitForReactRender(() => {
      // @ts-ignore documentMode isn't on document normally
      const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

      if (
        this.props.isGrowthJoinableSitesCalculationEnabled &&
        this.props.userUuid &&
        !this.props.isMobileHeaderActive &&
        !isIE11
      ) {
        getJoinableSitesWithRelevance(
          this.props.bbEnv,
          [Product.JiraSoftware],
          this.props.userUuid,
          this.props.publishOperationalEvent,
          this.props.captureException
        );
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleGlobalKeyDown);
  }

  // We want to hide the "global" blue navigation if any of these cases is true:
  // a. we are in mobile nav mode AND this instance of the nav is NOT being rendered inside the mobile nav
  // b. horizontal nav is enabled and we're on the dashboard
  isGlobalNavHidden = () => {
    const { isMobileHeaderActive, isBeingRenderedInsideMobileNav } = this.props;
    return isMobileHeaderActive && !isBeingRenderedInsideMobileNav;
  };

  renderGlobalNavigation = () => {
    if (
      !this.shouldRenderGlobalNavHorizontal() &&
      !this.shouldRenderGlobalNavVertical()
    ) {
      return null;
    }

    const {
      aaLogoutUrl,
      canonUrl,
      containerBitbucketActions,
      containerConnectActions,
      containerHref,
      containerLinkComponent,
      containerLogo,
      containerName,
      currentProject,
      globalBitbucketActions,
      hasAtlassianAccount,
      hasWorkspaceUi,
      horizontalNavigationItems,
      importBitbucketActions,
      isGlobalContext,
      isLoading,
      isPrivate,
      isXFlowIntegrationRolloutEnabled,
      isXFlowIntegrationSwitchEnabled,
      linkComponent,
      onCloneClick,
      onCreateDrawerClose,
      onSearch,
      onSearchDrawerInit,
      onSearchSubmit,
      pullRequestLinkComponent,
      recentlyViewed,
      repoName,
      repositoryLinkComponent,
      repoSlug,
      searchQuery,
      searchResults,
      teams,
      userAccountStatus,
      userAvatarUrl,
      userDisplayName,
      userHtmlUrl,
      userUuid,
      userWorkspaceId,
      isWhatsNewEnabled,
      onKeyboardShortcutsActivated,
      whatsNewUrl,
      onToggleAtlassianSwitcher,
      isAtlassianSwitcherOpen,
      captureException,
      isGrowthJoinableSitesCalculationEnabled,
      isGrowthJoinSectionInAtlassianSwitcherEnabled,
      publishTrackEvent,
      publishUiEvent,
    } = this.props;

    const drawerHeader = (
      <DrawerHeader
        isGlobalContext={isGlobalContext}
        isPrivate={isPrivate}
        href={containerHref}
        name={containerName}
        logo={containerLogo}
        linkComponent={containerLinkComponent}
      />
    );

    if (this.shouldRenderGlobalNavHorizontal()) {
      return (
        <HorizontalNav
          aaLogoutUrl={aaLogoutUrl}
          avatarUrl={userAvatarUrl}
          canonUrl={canonUrl}
          containerBitbucketActions={containerBitbucketActions}
          containerConnectActions={containerConnectActions}
          currentProject={currentProject}
          drawerHeader={drawerHeader}
          globalBitbucketActions={globalBitbucketActions}
          hasAtlassianAccount={hasAtlassianAccount}
          hasWorkspaceUi={hasWorkspaceUi}
          importBitbucketActions={importBitbucketActions}
          menuItems={horizontalNavigationItems || []}
          isLoading={isLoading}
          isLoggedIn={Boolean(userUuid)}
          linkComponent={linkComponent}
          onCloneClick={onCloneClick}
          onCreateDrawerClose={onCreateDrawerClose}
          onSearch={onSearch}
          onSearchDrawerInit={onSearchDrawerInit}
          onSearchSubmit={onSearchSubmit}
          pullRequestLinkComponent={pullRequestLinkComponent}
          recentlyViewed={recentlyViewed}
          repoName={repoName}
          repositoryLinkComponent={repositoryLinkComponent}
          repoSlug={repoSlug}
          searchQuery={searchQuery}
          searchResults={searchResults}
          teams={teams}
          userAccountStatus={userAccountStatus}
          userAvatarUrl={userAvatarUrl}
          userDisplayName={userDisplayName}
          userHtmlUrl={userHtmlUrl}
          userUuid={userUuid}
          userWorkspaceId={userWorkspaceId}
          isWhatsNewEnabled={isWhatsNewEnabled}
          onKeyboardShortcutsActivated={onKeyboardShortcutsActivated}
          whatsNewUrl={whatsNewUrl}
          onToggleAtlassianSwitcher={onToggleAtlassianSwitcher}
          isAtlassianSwitcherOpen={isAtlassianSwitcherOpen}
          captureException={captureException}
          isGrowthJoinableSitesCalculationEnabled={
            isGrowthJoinableSitesCalculationEnabled
          }
          isGrowthJoinSectionInAtlassianSwitcherEnabled={
            isGrowthJoinSectionInAtlassianSwitcherEnabled
          }
          isXFlowIntegrationRolloutEnabled={isXFlowIntegrationRolloutEnabled}
          isXFlowIntegrationSwitchEnabled={isXFlowIntegrationSwitchEnabled}
          publishTrackEvent={publishTrackEvent}
          publishUiEvent={publishUiEvent}
        />
      );
    }

    return (
      <UIControllerSubscriber>
        {(uiController: UIControllerInterface) => (
          <GlobalNavigationNext
            {...this.props}
            drawerHeader={drawerHeader}
            isNavigationOpen={!uiController.state.isCollapsed}
            themeMode={this.getThemeMode()}
          />
        )}
      </UIControllerSubscriber>
    );
  };

  // This is a bit of a hack since Atlaskit doesn't really work with AUI
  // see https://ecosystem.atlassian.net/browse/AK-3456
  // @ts-ignore TODO: fix noImplicitAny error here
  handleGlobalKeyDown = e => {
    const {
      isAtlassianSwitcherOpen,
      isCreateDrawerOpen,
      isSearchDrawerOpen,
      onSearchDrawerClose,
      onCreateDrawerClose,
      onToggleAtlassianSwitcher,
    } = this.props;
    if (keycode(e) === 'esc') {
      if (isCreateDrawerOpen) {
        onCreateDrawerClose();
      } else if (isSearchDrawerOpen) {
        onSearchDrawerClose();
      } else if (isAtlassianSwitcherOpen) {
        onToggleAtlassianSwitcher(false);
      }
    }
  };

  handleResize = (isOpen: boolean) => {
    this.props.onResize({ isOpen });
  };

  getThemeMode = () => {
    let themeMode = light;
    if (this.props.hasSettingsNavTheme) {
      themeMode = settings;
    } else if (this.props.hasSiteSettingsNavTheme) {
      themeMode = siteSettings;
    } else if (this.props.hasDarkNavTheme) {
      themeMode = dark;
    }

    return themeMode;
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  handleRefs = ({ expandCollapseAffordance }, isCollapsed: boolean) => {
    // There is no other way to pass expand/collapse button element a unique
    // selector for the E2E tests.
    if (expandCollapseAffordance.current) {
      const element = expandCollapseAffordance.current as HTMLElement;
      element.setAttribute('data-qa-id', 'expand-collapse-button');
      element.setAttribute(
        'data-qa-open-state',
        isCollapsed ? OPEN_STATE.COLLAPSED : OPEN_STATE.EXPANDED
      );
    }
  };

  getDefaultIsCollapsedState = () => {
    if (this.props.isMobileHeaderActive) {
      return false;
    } else {
      return !this.props.defaultNavigationOpen;
    }
  };

  // When rendering outside of the mobile navigation, the "global" navigation is rendered either
  // vertically (thin blue bar) or horizontally (persistent horizontal white bar).
  // When rendering *inside* the mobile navigation, the "global" navigation is always rendered
  // as a thin blue bar.
  shouldRenderGlobalNavHorizontal = () =>
    this.props.isHorizontalNavEnabled &&
    !this.props.isMobileHeaderActive &&
    !this.props.isBeingRenderedInsideMobileNav;

  shouldRenderGlobalNavVertical = () =>
    this.props.isBeingRenderedInsideMobileNav
      ? true
      : !this.props.isMobileHeaderActive && !this.props.isHorizontalNavEnabled;

  // The "container" navigation is the route-specific navigation i.e. the "gray" nav area.
  // It is always rendered inside the mobile nav.
  // Outside of the mobile nav, it is always rendered unless the horizontal nav feautre is
  // enabled AND the user is on a /dashboard route.
  shouldRenderContainerNav = () => {
    if (this.props.isBeingRenderedInsideMobileNav) {
      return true;
    } else if (
      this.props.isHorizontalNavEnabled &&
      !this.props.isMobileHeaderActive
    ) {
      return window.location.pathname.indexOf('/dashboard/') !== 0;
    }
    return this.shouldRenderGlobalNavVertical();
  };

  renderProductNavigation = () => {
    const { navigationType, renderNavigation } = this.props;

    // "productNavigation" can't be null. So just rendering an empty "div"
    // if the navigationType is not "product".
    const productNavigation =
      navigationType === 'product' ? renderNavigation : () => <div />;

    return this.shouldRenderGlobalNavVertical()
      ? productNavigation
      : () => <div />;
  };

  hideGlobalSideNav = () =>
    this.isGlobalNavHidden() &&
    this.props.isHorizontalNavEnabled &&
    window.location.pathname.indexOf('/dashboard/') === 0;

  render() {
    const {
      intl,
      isMobileHeaderActive,
      navigationType,
      renderNavigation,
      topOffset,
    } = this.props;

    const containerNavigation =
      navigationType === 'container' ? renderNavigation : null;

    const shouldRenderGlobalNavHorizontal = this.shouldRenderGlobalNavHorizontal();
    const shouldRenderGlobalNavVertical = this.shouldRenderGlobalNavVertical();
    const shouldRenderContainerNav = this.shouldRenderContainerNav();

    return (
      <ThemeProvider
        // @ts-ignore TODO: fix noImplicitAny error here
        theme={theme => ({
          ...theme,
          mode: this.getThemeMode(),
        })}
      >
        <NavigationProvider
          initialUIController={buildUiController(
            isMobileHeaderActive,
            this.getDefaultIsCollapsedState()
          )}
        >
          <UIControllerSubscriber>
            {(uiController: UIControllerInterface) => (
              <LayoutManager
                // experimental_horizontalGlobalNav hides all of the left side nav's "global"
                // blue section which is what we want when in mobile mode.
                experimental_horizontalGlobalNav={
                  shouldRenderGlobalNavHorizontal || !shouldRenderContainerNav
                }
                showContextualNavigation={shouldRenderContainerNav}
                topOffset={topOffset}
                productNavigation={this.renderProductNavigation()}
                containerNavigation={
                  shouldRenderContainerNav && containerNavigation
                }
                collapseToggleTooltipContent={() => ({
                  text: intl.formatMessage(messages.resizerButtonLabel),
                  char: COLLAPSE_TOGGLE_SHORTCUT,
                })}
                onExpandStart={() => {
                  this.handleResize(true);
                }}
                onCollapseStart={() => {
                  this.handleResize(false);
                }}
                experimental_flyoutOnHover
                experimental_alternateFlyoutBehaviour
                experimental_fullWidthFlyout
                shouldHideGlobalNavShadow={shouldRenderGlobalNavVertical}
                globalNavigation={this.renderGlobalNavigation}
                // @ts-ignore TODO: fix noImplicitAny error here
                getRefs={refs =>
                  this.handleRefs(refs, uiController.state.isCollapsed)
                }
              >
                {this.props.children}
              </LayoutManager>
            )}
          </UIControllerSubscriber>
        </NavigationProvider>
      </ThemeProvider>
    );
  }
}

export default injectIntl(NavigationNext);

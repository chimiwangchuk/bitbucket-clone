import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Loadable from 'react-loadable';
import { get } from 'lodash-es';
import memoize from 'memoize-one';
import { History } from 'history';

import { MenuItem } from '@atlassian/bitbucket-navigation';

import NavigationLink from 'src/sections/global/components/navigation-link';
import GlobalNavigation from 'src/sections/global/containers/navigation';
import BaseRepositoryLink from 'src/components/repository-link';
import {
  getCurrentRepository,
  getMenuItems,
  getSelectedMenuItem,
} from 'src/selectors/repository-selectors';
import { BucketState } from 'src/types/state';

const RepositoryNavigationNext = Loadable({
  loading: () => null,
  loader: () =>
    import(
      /* webpackChunkName: "navigation-next-repository", webpackPreload: true */ 'src/sections/repository/components/repository-navigation-next'
    ),
});

type RepositoryNavigationProps = RouteComponentProps & {
  avatarUrl?: string;
  containerBitbucketActions: MenuItem[];
  containerConnectActions: MenuItem[];
  fullName?: string;
  htmlUrl?: string;
  isBeingRenderedInsideMobileNav: boolean;
  isPrivate?: boolean;
  landingPage?: string;
  name?: string;
  menuItems: MenuItem[];
  selectedMenuItem: MenuItem | undefined;
};

const mapStateToProps = (
  state: BucketState,
  ownProps: RepositoryNavigationProps
) => {
  const currentRepository = getCurrentRepository(state);

  // Destructure the bits we need so that "freshly" denormalized repository objects don't make EVERYTHING re-render
  const {
    name,
    is_private: isPrivate,
    links,
    landing_page: landingPage,
    full_name: fullName,
  } = currentRepository || {};

  return {
    avatarUrl: get(links, 'avatar.href'),
    containerBitbucketActions: state.repository.section.bitbucketActions,
    containerConnectActions: state.repository.section.connectActions,
    fullName,
    htmlUrl: get(links, 'html.href'),
    isPrivate,
    landingPage,
    name,
    menuItems: getMenuItems(state),
    selectedMenuItem: getSelectedMenuItem(
      state,
      ownProps.location.pathname,
      ownProps.match.url
    ),
  };
};

// Memoized repo link to avoid rerenders
const memoRepoLink = memoize(
  (
    name: string | undefined,
    fullName: string | undefined,
    landingPage: string | undefined,
    htmlUrl: string | undefined
  ) =>
    // Name the render function so it shows up in DevTools as `ForwardRef(RepositoryLink)` instead of just `ForwardRef`
    // @ts-ignore TODO: fix noImplicitAny error here
    React.forwardRef(function RepositoryLink(props, ref: (ReactNode) => void) {
      return (
        <BaseRepositoryLink
          {...props}
          innerRef={ref}
          repository={{
            // @ts-ignore Should always be present
            name,
            landing_page: landingPage,
            // @ts-ignore Should always be present
            full_name: fullName,
            // @ts-ignore Should always be present
            links: { html: { href: htmlUrl } },
          }}
        />
      );
    })
);

const memoOnProductClick = memoize((history: History) => () =>
  history.push('/')
);

const memoRenderNavigation = memoize(
  (menuItems: MenuItem[], selectedMenuItem: MenuItem | undefined) => () => (
    <RepositoryNavigationNext
      menuItems={menuItems}
      selectedMenuItem={selectedMenuItem}
      linkComponent={NavigationLink}
    />
  )
);
export const RepositoryNavigation = connect(mapStateToProps)(
  class extends PureComponent<RepositoryNavigationProps> {
    render() {
      const {
        avatarUrl,
        containerBitbucketActions,
        containerConnectActions,
        fullName,
        htmlUrl,
        isPrivate,
        landingPage,
        name,
        menuItems,
        selectedMenuItem,
        history,
        isBeingRenderedInsideMobileNav,
      } = this.props;

      const hasRepo = !!name && !!fullName && !!htmlUrl;
      const RepoLink: React.FunctionComponent<any> = memoRepoLink(
        name,
        fullName,
        landingPage,
        htmlUrl
      );
      const onProductClick = memoOnProductClick(history);
      const renderNavigation = memoRenderNavigation(
        menuItems,
        selectedMenuItem
      );

      return (
        <GlobalNavigation
          isBeingRenderedInsideMobileNav={isBeingRenderedInsideMobileNav}
          containerBitbucketActions={containerBitbucketActions}
          containerConnectActions={containerConnectActions}
          containerName={name}
          containerHref={htmlUrl}
          containerLogo={avatarUrl}
          containerLinkComponent={hasRepo ? RepoLink : undefined}
          isGlobalContext={false}
          isPrivate={isPrivate}
          linkComponent={NavigationLink}
          navigationType="container"
          onProductClick={onProductClick}
          renderNavigation={renderNavigation}
        >
          {this.props.children}
        </GlobalNavigation>
      );
    }
  }
);

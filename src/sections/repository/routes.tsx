import React from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import PageLoadingErrorGuard from 'src/components/page-loading-error-guard';
import { NavigationWrapper } from 'src/app/navigation-wrapper';
import { Dispatch, BucketState } from 'src/types/state';
import { defaultLoadable } from 'src/utils/loadable-configs';
import { REPO_FULL_SLUG_REGEX } from 'src/utils/validate-repository-path';
import { DEFAULT_TITLE, TITLE_TEMPLATE } from 'src/constants/helmet';
import {
  getCurrentRepository,
  getCurrentRepositoryMainBranchName,
} from 'src/selectors/repository-selectors';
import { FeatureToggle } from 'src/containers/feature-toggle';
import OutdatedJiraConnectorFlagManager from 'src/sections/global/components/flags/outdated-jira-connector-flag/outdated-Jira-connector-flag-manager';
import RepositoryAccessGuard from 'src/sections/repository/components/repository-access-guard';
import CreateBranchPageLoadable from '../create-branch/containers/entry';
import { UNLOAD_REPOSITORY } from './actions';
import loadRepositoryPage from './actions/load-repository-page';
import CloneModalDialog from './containers/clone-modal-dialog';
import SyncDialog from './containers/sync-dialog';
import BranchesListLoadable from './sections/branches';
import CommitListLoadable from './sections/commit-list';
import PullRequestLoadable from './sections/pull-request/containers';
import PullRequestListLoadable from './sections/pull-request-list';
import RepoAdminLoadable from './sections/admin';
import { legacyPath } from './utils/get-legacy-path';
import { RouteProps } from './types';
import RepositoryNavigation from './navigation';

type Props = RouteProps & {
  dispatch: Dispatch;
  hasRepo: boolean;
  isNavNextSettingsEnabled: boolean;
  mainBranchName?: string | null;
  isPageLoadingErrorGuardEnabled: boolean;
};

// passes `repositoryFullSlug` param
// @ts-ignore TODO: fix noImplicitAny error here
const repoPath = path => `/${REPO_FULL_SLUG_REGEX}/${path}`;
const SourceBrowserLoadable = defaultLoadable(() =>
  import(
    /* webpackChunkName: "source-browser" */ './sections/source/containers/source-browser-wrapped'
  )
);
const FileHistoryLoadable = defaultLoadable(() =>
  import(
    /* webpackChunkName: "file-history" */ './sections/source/containers/file-history-wrapped'
  )
);
const SourceDiffLoadable = defaultLoadable(() =>
  import(
    /* webpackChunkName: "source-diff" */ './sections/source/containers/source-diff'
  )
);
const ConnectPageLoadable = defaultLoadable(() =>
  import(/* webpackChunkName: "connect-page" */ './containers/connect-page')
);
const JiraViewLoadable = defaultLoadable(() =>
  import(/* webpackChunkName: "jira-view" */ './sections/jira')
);

class RepositoryRoutes extends React.Component<Props> {
  componentDidMount() {
    this.loadPage();
  }

  componentDidUpdate(prevProps: Props) {
    const { repositoryFullSlug: prevFullSlug } = prevProps.match.params;
    const { repositoryFullSlug } = this.props.match.params;

    if (
      repositoryFullSlug !== prevFullSlug &&
      !this.props.history.location.state?.isRepoNameChange // isRepoNameChange is passed via history.push when updating the name/slug via repo settings.
    ) {
      // Child routes might try to load data based on the repo in redux. To
      // short circuit any race conditions, we need to remove the old repo
      // from redux before we try to load the new one.
      this.unloadPage();
      this.loadPage();
    }
  }

  componentWillUnmount() {
    this.unloadPage();
  }

  loadPage() {
    const { repositoryFullSlug } = this.props.match.params;
    this.props.dispatch(loadRepositoryPage(repositoryFullSlug));
  }

  unloadPage() {
    this.props.dispatch({ type: UNLOAD_REPOSITORY });
  }

  renderTitle() {
    const { repositoryFullSlug } = this.props.match.params;
    const defaultTitle = `${repositoryFullSlug.replace(
      '/',
      ' / '
    )} — ${DEFAULT_TITLE}`;
    const titleTemplate = `${repositoryFullSlug.replace(
      '/',
      ' / '
    )} ${TITLE_TEMPLATE}`;

    return (
      <Helmet
        defer={false}
        defaultTitle={defaultTitle}
        titleTemplate={titleTemplate}
      />
    );
  }

  renderSourceBrowserRedirect() {
    const srcUrl = this.props.match.url.endsWith('/')
      ? `${this.props.match.url}src`
      : `${this.props.match.url}/src`;
    return <Redirect to={srcUrl} />;
  }

  renderOutdatedJiraConnectorFlagManager = () => (
    <FeatureToggle feature="show-outdated-jira-connector-flag">
      <RepositoryAccessGuard requiredLevel="admin">
        <OutdatedJiraConnectorFlagManager />
      </RepositoryAccessGuard>
    </FeatureToggle>
  );

  renderRoutes() {
    const {
      mainBranchName,
      hasRepo,
      match,
      isNavNextSettingsEnabled,
    } = this.props;
    if (hasRepo && !mainBranchName) {
      // no need to render all other routes ('branches', 'commits', etc.)
      // if repository is empty (does not have main branch);
      //
      // we also can not extract this Route and Redirect outside function
      // because Switch plays bad with React.Fragment - redirect does not work
      return (
        <Switch>
          <Route
            path={legacyPath('src/:refOrHash?/:path*')}
            component={SourceBrowserLoadable}
          />
          <Route
            path={legacyPath('addon/:appKey/:moduleKey')}
            component={ConnectPageLoadable}
          />
          <Route path={legacyPath('jira')} component={JiraViewLoadable} />
          {isNavNextSettingsEnabled && (
            <Route path={legacyPath('admin')} component={RepoAdminLoadable} />
          )}
          {this.renderSourceBrowserRedirect()}
        </Switch>
      );
    }

    return (
      <Switch>
        <Route
          path={legacyPath('src/:refOrHash?/:path*')}
          component={SourceBrowserLoadable}
        />
        <Route
          path={legacyPath('branch')}
          component={CreateBranchPageLoadable}
        />
        <Route
          exact
          path={[
            repoPath('commits'),
            repoPath('commits/all'),
            repoPath('commits/(branch|tag)/:refName(.*)'),
          ]}
          component={CommitListLoadable}
        />
        <Redirect
          from={repoPath('commits/history')}
          to={`/${match.params.repositoryFullSlug}/commits/all`}
        />
        <Route path={repoPath('diff/:path+')} component={SourceDiffLoadable} />,
        <Route
          path={[
            legacyPath('history/:path+'),
            legacyPath('history-node/:refOrHash/:path+'),
          ]}
          component={FileHistoryLoadable}
        />
        <Route
          path={legacyPath('addon/:appKey/:moduleKey')}
          component={ConnectPageLoadable}
        />
        <Route
          path={legacyPath('pull-requests/:pullRequestId')}
          component={PullRequestLoadable}
        />
        <Route
          path={legacyPath('pull-requests')}
          component={PullRequestListLoadable}
        />
        <Route path={legacyPath('branches')} component={BranchesListLoadable} />
        <Route path={legacyPath('jira')} component={JiraViewLoadable} />
        {isNavNextSettingsEnabled && (
          <Route path={legacyPath('admin')} component={RepoAdminLoadable} />
        )}
        {this.renderSourceBrowserRedirect()}
      </Switch>
    );
  }
  renderRoute = () => (
    <NavigationWrapper
      Component={RepositoryNavigation}
      mobileHeading={this.props.match.params.repositoryFullSlug}
    >
      <React.Fragment>
        {this.renderOutdatedJiraConnectorFlagManager()}
        {this.renderTitle()}
        <CloneModalDialog />
        <SyncDialog />
        {this.renderRoutes()}
      </React.Fragment>
    </NavigationWrapper>
  );

  render() {
    return (
      <FeatureToggle
        fallback={this.renderRoute()}
        feature="fd-repository-page-loading-error-guard"
      >
        <PageLoadingErrorGuard>{this.renderRoute()}</PageLoadingErrorGuard>
      </FeatureToggle>
    );
  }
}

const mapStateToProps = (state: BucketState) => ({
  hasRepo: !!getCurrentRepository(state),
  mainBranchName: getCurrentRepositoryMainBranchName(state),
  isNavNextSettingsEnabled: !!state.global.features['nav-next-settings'],
});

export default connect(mapStateToProps)(RepositoryRoutes);

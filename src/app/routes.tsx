import React, { Component } from 'react';
import { compose } from 'redux';
import {
  withRouter,
  Redirect,
  Route,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
import { defaultLoadable } from 'src/utils/loadable-configs';
import { REPO_FULL_SLUG_REGEX } from 'src/utils/validate-repository-path';

const DashboardRoutes = defaultLoadable(() =>
  import(
    /* webpackChunkName: "dashboard-routes" */ 'src/sections/dashboard/routes'
  )
);
const Search = defaultLoadable(() =>
  import(/* webpackChunkName: "search" */ 'src/sections/search/containers/page')
);
const WelcomeSurvey = defaultLoadable(() =>
  import(
    /* webpackChunkName: "welcome-survey" */ 'src/sections/global/components/welcome-survey'
  )
);
const RepositoryRoutes = defaultLoadable(() =>
  import(
    /* webpackChunkName: "repository-routes" */ 'src/sections/repository/routes'
  )
);
const GlobalCreateBranchPage = defaultLoadable(() =>
  import(
    /* webpackChunkName: "create-branch" */ 'src/sections/create-branch/containers/global-page'
  )
);

const CreateWorkspacePage = defaultLoadable(() =>
  import(
    /* webpackChunkName: "create-workspace" */ 'src/sections/workspace/sections/create/containers/create-workspace-page'
  )
);

const ProfileRoutes = defaultLoadable(() =>
  import(/* webpackChunkName: "profile-page" */ 'src/sections/profile/routes')
);

const AccountRoutes = defaultLoadable(() =>
  import(/* webpackChunkName: "account-page" */ 'src/sections/account/routes')
);

class AppRoutes extends Component<RouteComponentProps> {
  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/dashboard/overview" />
        <Route path="/search" component={Search} />
        <Route path="/dashboard" component={DashboardRoutes} />
        <Route path="/account/survey" component={WelcomeSurvey} />
        <Route path="/account" component={AccountRoutes} />
        <Route path="/branch/create" component={GlobalCreateBranchPage} />
        <Route path="/workspace/create" component={CreateWorkspacePage} />
        <Route path="/:workspaceSlug" exact component={ProfileRoutes} />
        {/* TODO: Since most account urls are going away, workspace urls should eventually have their own routes.tsx */}
        <Route path="/workspaces/plans" component={AccountRoutes} />
        <Route
          path="/:workspaceSlug/workspace/settings/plans"
          component={AccountRoutes}
        />
        <Route
          path={[
            '/:workspaceSlug/workspace/repositories',
            '/:workspaceSlug/profile/repositories',
          ]}
          component={ProfileRoutes}
        />
        <Route path={`/${REPO_FULL_SLUG_REGEX}`} component={RepositoryRoutes} />
        <Redirect to="/dashboard/overview" />
      </Switch>
    );
  }
}

// passing withRouter instead of rendering this inside a <Route />
export default compose(withRouter)(AppRoutes);

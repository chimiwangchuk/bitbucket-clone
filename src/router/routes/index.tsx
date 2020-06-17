import Loadable from 'react-loadable';
import React, { useMemo, useEffect } from 'react';
import { Router as ReactRouter } from 'react-router-dom';
import { Redirect, withRouter, Routes } from '@atlaskit/router';
import ReactRouterRoutes from 'src/app/routes';
import HistoryWatcher from 'src/components/performance-metrics/history-watcher';
import LoadingPage from 'src/sections/global/components/loading-page';
import { getSsrFeatures } from 'src/utils/ssr-features';
import { createSafeHistory } from '../history';
import { getLoadDashboardResource } from '../../redux/dashboard/resources/load-dashboard';
import { getLoadDashboardOverviewResource } from '../../redux/dashboard/resources/load-dashboard-overview';
import { loadDashboardRepositoriesResource } from '../../redux/dashboard/resources/load-dashboard-repositories';
import { loadGlobalResource } from '../../redux/global/resources/load-global';

const DashboardOverview = Loadable({
  loading: () => <LoadingPage />,
  loader: () =>
    import(
      /* webpackChunkName: "dashboard-overview" */ 'src/sections/dashboard/sections/overview/containers'
    ),
});

const DashboardRepositories = Loadable({
  loading: () => <LoadingPage />,
  loader: () =>
    import(
      /* webpackChunkName: "dashboard-repositories" */ 'src/sections/dashboard/sections/repositories/containers'
    ),
});

export const getRoutes = (): Routes => {
  const { isAtlaskitRouterResourcesForDashboardEnabled } = getSsrFeatures();
  const routes = [
    {
      name: 'ROOT',
      path: '/',
      component: () => {
        import(
          /* webpackChunkName: "dashboard-overview", webpackPreload: true */ 'src/sections/dashboard/sections/overview/containers'
        );

        return <Redirect to="/dashboard/overview" />;
      },
      navigation: null,
      exact: true,
      isRedirect: true,
      ...(isAtlaskitRouterResourcesForDashboardEnabled
        ? {
            resources: [
              loadGlobalResource,
              getLoadDashboardResource(2 * 1000),
              getLoadDashboardOverviewResource(2 * 1000),
            ],
          }
        : {
            resources: [loadGlobalResource],
          }),
    },
    {
      name: 'DASHBOARD_OVERVIEW',
      path: '/dashboard/overview',
      component: DashboardOverview,
      navigation: null,
      exact: true,
      ...(isAtlaskitRouterResourcesForDashboardEnabled
        ? {
            resources: [
              loadGlobalResource,
              getLoadDashboardResource(),
              getLoadDashboardOverviewResource(),
            ],
          }
        : {
            resources: [loadGlobalResource],
          }),
    },
    {
      name: 'DASHBOARD_REPOSITORIES',
      path: '/dashboard/repositories',
      component: DashboardRepositories,
      navigation: null,
      exact: true,
      ...(isAtlaskitRouterResourcesForDashboardEnabled
        ? {
            resources: [
              loadGlobalResource,
              getLoadDashboardResource(),
              loadDashboardRepositoriesResource,
            ],
          }
        : {
            resources: [loadGlobalResource],
          }),
    },
    {
      name: 'REACT_ROUTER',
      path: '/:any',
      // @ts-ignore - history prop is not typed
      component: withRouter(({ history }) => {
        const safeHistory = useMemo(() => createSafeHistory(history), [
          history,
        ]);

        // eslint-disable-next-line
        useEffect(() => () => safeHistory.destroy(), []);

        return (
          // @ts-ignore - monkey patched history
          <ReactRouter history={safeHistory}>
            <HistoryWatcher />
            <ReactRouterRoutes />
          </ReactRouter>
        );
      }),
      navigation: null,
      resources: [loadGlobalResource],
    },
  ];

  return routes;
};

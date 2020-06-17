import Loadable from 'react-loadable';
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { RouteComponent, withRouter, Location, Route } from '@atlaskit/router';
import HistoryWatcher from 'src/components/performance-metrics/history-watcher';
import i18n from 'src/sections/dashboard/sections/overview/components/index.i18n';
import loadDashboard from 'src/redux/dashboard/actions/load-dashboard';
import LoadingPage from 'src/sections/global/components/loading-page';
import { getSsrFeatures } from 'src/utils/ssr-features';
import { Dispatch } from 'src/types/state';
import { NavigationWrapper } from './navigation-wrapper';

const DashboardNavigation = Loadable({
  loading: () => <LoadingPage />,
  loader: () =>
    import(
      /* webpackChunkName: "dashboard-navigation" */ 'src/sections/dashboard/navigation'
    ),
});

type UniversalRoutesProps = {
  dispatch: Dispatch;
  location: Location;
  route: Route;
};

let hasDispatchedLoadDashboardAction = false;

/**
 * Interim method before we have resources.
 */
const dispatchLoadDashboardAction = (dispatch: Dispatch) => {
  const { isAtlaskitRouterResourcesForDashboardEnabled } = getSsrFeatures();

  if (
    !isAtlaskitRouterResourcesForDashboardEnabled &&
    !hasDispatchedLoadDashboardAction
  ) {
    hasDispatchedLoadDashboardAction = true;

    dispatch(loadDashboard());
  }
};

class UniversalRoutes extends Component<UniversalRoutesProps> {
  componentDidMount() {
    const { dispatch } = this.props;

    if (this.isRoute('dashboard') || this.isExactRoute('/')) {
      dispatchLoadDashboardAction(dispatch);
    }
  }

  componentWillUpdate() {
    if (this.isRoute('dashboard') || this.isExactRoute('/')) {
      dispatchLoadDashboardAction(this.props.dispatch);
    }
  }

  componentWillUnmount() {
    hasDispatchedLoadDashboardAction = false;
  }

  isRoute(route: string) {
    return this.props.location.pathname.includes(route);
  }

  isExactRoute(route: string) {
    return this.props.location.pathname === route;
  }

  getNavigationComponent() {
    if (this.isRoute('dashboard')) {
      return DashboardNavigation;
    }

    return DashboardNavigation;
  }

  render() {
    const { route } = this.props;

    if (route.name === 'REACT_ROUTER') {
      return <RouteComponent />;
    }

    const { shouldCurrentRouteUseAtlaskitRouter } = getSsrFeatures();

    if (shouldCurrentRouteUseAtlaskitRouter && route.isRedirect) {
      return <RouteComponent />;
    }

    return (
      shouldCurrentRouteUseAtlaskitRouter && (
        <>
          <HistoryWatcher />
          <NavigationWrapper
            Component={this.getNavigationComponent()}
            mobileHeading={<FormattedMessage {...i18n.header} />}
          >
            <RouteComponent />
          </NavigationWrapper>
        </>
      )
    );
  }
}

export default compose<React.ElementType>(
  withRouter,
  connect()
)(UniversalRoutes);

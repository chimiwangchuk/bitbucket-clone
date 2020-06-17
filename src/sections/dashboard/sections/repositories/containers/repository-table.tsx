import React from 'react';
import { connect } from 'react-redux';

import { compose } from 'redux';
import {
  getIsAtlaskitRouterEnabled,
  getIsParcelBundlesEnabled,
} from 'src/selectors/feature-selectors';
import {
  IS_ATLASKIT_ROUTER_ENABLED,
  IS_PARCEL_BUNDLES_ENABLED,
} from 'src/constants/features';
import { RepositoryTableProps as BaseRepositoryTableProps } from 'src/components/repository-table';
import {
  getRepositories,
  getRepositoryListSlice,
} from 'src/redux/dashboard/selectors/repositories';
import { getSsrPageLoadMarkEntryName } from 'src/ssr/services/metrics';
import { withApdexAndFeatureFlags } from 'src/components/apdex/with-apdex';
import { withStatsdAndFeatureFlags } from 'src/components/performance-metrics/with-statsd';
import { ApdexTask } from 'src/types/apdex';
import { BucketState } from 'src/types/state';
import RepositoryTable from '../components/repository-table-with-keyboard-shortcuts';
import { RepositoryTableProps } from '../components/repository-table';

type ContainerProps = {
  isPreRequestState: boolean;
  isLoading: boolean;
};

const featureFlagNamesToSelectors = [
  {
    name: IS_ATLASKIT_ROUTER_ENABLED,
    selector: getIsAtlaskitRouterEnabled,
  },
  {
    name: IS_PARCEL_BUNDLES_ENABLED,
    selector: getIsParcelBundlesEnabled,
  },
];

const ssrPerformanceMarkEntryName = getSsrPageLoadMarkEntryName();
const statsdMetricName = 'performance.repository-table.rendered';

const InstrumentedRepositoryTable = compose(
  withApdexAndFeatureFlags({
    eventName: ApdexTask.DashboardRepositories,
    featureFlagNamesToSelectors,
    stopTimePerformanceMarkEntryName: ssrPerformanceMarkEntryName,
  }),
  withStatsdAndFeatureFlags({
    metricName: statsdMetricName,
    featureFlagNamesToSelectors,
    customEndEvent: ssrPerformanceMarkEntryName,
  })
)(RepositoryTable);

class ApdexMeasuredRepositoryTable extends React.PureComponent<
  ContainerProps & BaseRepositoryTableProps & RepositoryTableProps
> {
  render() {
    const { isPreRequestState, isLoading } = this.props;

    return isPreRequestState || isLoading ? (
      <RepositoryTable {...this.props} />
    ) : (
      <InstrumentedRepositoryTable {...this.props} />
    );
  }
}

const mapStateToProps = (state: BucketState) => {
  const { isLoading, isPreRequestState } = getRepositoryListSlice(state);

  return {
    isLoading,
    isPreRequestState,
    repositories: getRepositories(state),
  };
};

export default connect(mapStateToProps)(ApdexMeasuredRepositoryTable);

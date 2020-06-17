import { takeLatest, all, takeEvery } from 'redux-saga/effects';

import {
  FetchRepositories,
  LoadDashboardOverview,
  CLEAR_PULL_REQUEST_FILTERS,
  FILTER_PULL_REQUESTS,
  SORT_OVERVIEW_REPOSITORIES,
} from 'src/redux/dashboard/actions';

import {
  getDashboardOverviewRepositoriesBuildStatuses,
  getDashboardRepositoryListBuildStatuses,
} from './get-repository-build-statuses';
import filterPullRequestSaga from './filter-pull-requests-saga';
import sortDashboardOverviewRepositoriesSaga from './sort-repositories-saga';

export default function* commitListSagas() {
  yield all([
    takeLatest(
      [LoadDashboardOverview.SUCCESS],
      getDashboardOverviewRepositoriesBuildStatuses
    ),
    takeLatest(
      [FetchRepositories.SUCCESS],
      getDashboardRepositoryListBuildStatuses
    ),
    takeLatest(
      [CLEAR_PULL_REQUEST_FILTERS, FILTER_PULL_REQUESTS],
      filterPullRequestSaga
    ),
    takeEvery(
      SORT_OVERVIEW_REPOSITORIES,
      sortDashboardOverviewRepositoriesSaga
    ),
  ]);
}

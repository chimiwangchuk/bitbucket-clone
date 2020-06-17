import { all, takeLatest } from 'redux-saga/effects';

import { LoadRepositoryPage } from 'src/sections/repository/actions';
import { LoadPullRequests } from '../actions';
import loadPullRequestsStatuses from './load-pr-statuses-saga';

export default function* pullRequestListSagas() {
  yield all([
    takeLatest(
      [LoadPullRequests.SUCCESS, LoadRepositoryPage.SUCCESS],
      loadPullRequestsStatuses
    ),
  ]);
}

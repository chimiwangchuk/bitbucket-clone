import { put, call, select } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import { FETCH_STACKED_PULL_REQUESTS_COUNT } from 'src/redux/pull-request/merge-reducer';
import { getPullRequestApis } from 'src/sagas/helpers';

import {
  getCurrentPullRequestUrlPieces,
  getPullRequestBranchName,
} from '../selectors';

export function* fetchStackedPullRequestsCountSaga() {
  const api = yield* getPullRequestApis();
  const { owner, slug } = yield select(getCurrentPullRequestUrlPieces);
  const branch = yield select(getPullRequestBranchName);
  try {
    yield put({ type: FETCH_STACKED_PULL_REQUESTS_COUNT.REQUEST });
    const stackedPrCount = yield call(
      api.getStackedPullRequestsCount,
      owner,
      slug,
      branch
    );
    yield put({
      type: FETCH_STACKED_PULL_REQUESTS_COUNT.SUCCESS,
      payload: stackedPrCount,
    });
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_STACKED_PULL_REQUESTS_COUNT.ERROR,
      payload: e.message,
    });
  }
}

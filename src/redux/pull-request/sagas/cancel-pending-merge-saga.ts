import { call, put, select } from 'redux-saga/effects';
import authRequest from 'src/utils/fetch';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import {
  CANCEL_PENDING_MERGE,
  FETCH_PENDING_MERGE_STATUS,
} from 'src/redux/pull-request/merge-reducer';

export function* cancelPendingMergeSaga() {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const url = urls.api.internal.pendingMerge(owner, slug, id);
  const authUrl = authRequest(url);

  try {
    const response = yield call(fetch, authUrl, { method: 'DELETE' });

    if (!response.ok) {
      const error = yield response.text();
      throw new Error(error);
    }

    yield put({
      type: CANCEL_PENDING_MERGE.SUCCESS,
    });

    yield put({
      type: FETCH_PENDING_MERGE_STATUS.REQUEST,
    });
  } catch (e) {
    yield put({
      type: CANCEL_PENDING_MERGE.ERROR,
      payload: e.message,
      error: true,
    });
  }
}

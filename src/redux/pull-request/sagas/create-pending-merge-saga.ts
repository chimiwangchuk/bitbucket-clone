import { call, put, select } from 'redux-saga/effects';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';

import { Action } from 'src/types/state';
import urls from 'src/redux/pull-request/urls';
import { CREATE_PENDING_MERGE } from 'src/redux/pull-request/merge-reducer';
import { MergeInfo } from 'src/types/pull-request';

export function* createPendingMergeSaga(action: Action) {
  // eslint-disable-next-line prefer-destructuring
  const payload: MergeInfo = action.payload;
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const url = urls.api.internal.pendingMerge(owner, slug, id);

  const authWrapped = authRequest(url, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      close_source_branch: payload.closeSourceBranch,
      message: payload.message,
      merge_strategy: payload.mergeStrategy,
      newstatus: 'fulfilled',
    }),
  });

  try {
    const response = yield call(fetch, authWrapped);

    if (!response.ok) {
      const error = yield response.text();
      throw new Error(error);
    }

    yield put({
      type: CREATE_PENDING_MERGE.SUCCESS,
      payload,
    });
  } catch (e) {
    yield put({
      type: CREATE_PENDING_MERGE.ERROR,
      payload: e.message,
      error: true,
    });
  }
}

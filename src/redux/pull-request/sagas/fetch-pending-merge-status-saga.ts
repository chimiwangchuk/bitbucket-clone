import { put, select, call } from 'redux-saga/effects';
import authRequest from 'src/utils/fetch';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';

import urls from 'src/redux/pull-request/urls';
import { FETCH_PENDING_MERGE_STATUS } from 'src/redux/pull-request/merge-reducer';

export function* fetchPendingMergeStatusSaga() {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const url = urls.api.internal.pendingMerge(owner, slug, id);

  try {
    const response = yield call(fetch, authRequest(url));

    if (!response.ok) {
      const error = yield response.text();
      throw new Error(error);
    }

    const json = yield response.json();

    const {
      can_create_pending_merge: canCreatePendingMerge = false,
      pullrequest,
      commit_message: message,
      merge_strategy: mergeStrategy,
      close_anchor_branch: closeSourceBranch,
    } = json;

    yield put({
      type: FETCH_PENDING_MERGE_STATUS.SUCCESS,
      payload: {
        canCreatePendingMerge,
        isMergePending: !!pullrequest,
        mergeInfo: { message, mergeStrategy, closeSourceBranch },
      },
    });
  } catch (e) {
    yield put({
      type: FETCH_PENDING_MERGE_STATUS.ERROR,
      payload: e.message,
      error: true,
    });
  }
}

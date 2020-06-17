import qs from 'qs';
import { put, call, select, delay } from 'redux-saga/effects';

import { showFlagComponent } from 'src/redux/flags';
import authRequest from 'src/utils/fetch';
import urls from 'src/sections/repository/urls';

import { getCompareBranchesDialogSlice } from '../selectors';
import { CompareBranchesDialogState } from '../reducers/compare-branches-reducer';

import {
  COMPARE_BRANCHES,
  COMPARE_BRANCHES_POLL_STATUS,
  COMPARE_BRANCHES_POLL_STATUS_TIMEOUT,
  compareBranchesPollStatus,
  CompareBranchesAction,
  CompareBranchesPollStatusAction,
  closeCompareBranchesDialog,
} from '../actions';

export default function* compareBranchesSaga(action: CompareBranchesAction) {
  const {
    isMerge,
    sourceBranchName,
    destinationBranchName,
    sourceRepositoryFullName,
    destinationRepositoryFullName,
  }: CompareBranchesDialogState = yield select(getCompareBranchesDialogSlice);

  const { commitMessage, mergeStrategy } = action.payload;

  const body = {
    commit_message: commitMessage,
    source: `${sourceRepositoryFullName}::${sourceBranchName}`,
    dest: `${destinationRepositoryFullName}::${destinationBranchName}`,
    event: isMerge && mergeStrategy ? 'list:merge' : 'list:sync',
    merge_strategy: isMerge && mergeStrategy ? mergeStrategy : null,
  };

  const url = urls.api.internal.compare(
    destinationRepositoryFullName as string
  );
  const request = {
    method: 'POST',
    body: qs.stringify(body, { skipNulls: true }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  };

  try {
    const res = yield call(fetch, authRequest(url, request));
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data = yield call([res, 'json']);
    yield put({
      type: COMPARE_BRANCHES.SUCCESS,
      payload: data,
    });
  } catch (e) {
    yield put({
      type: COMPARE_BRANCHES.ERROR,
      payload: e,
    });
  }
}

type PollStatus = {
  error?: string;
  complete?: boolean;
  task?: string;
  url?: string;
};

export const MAX_POLL_STATUS_CHECKS = 60;
export const POLL_STATUS_DELAY = 1000;

export function* compareBranchesPollStatusSaga(
  action: CompareBranchesPollStatusAction
) {
  try {
    let status: PollStatus = {};
    let i = 0;
    while (!status.complete && i < MAX_POLL_STATUS_CHECKS) {
      const res = yield call(fetch, authRequest(action.payload.url));
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      status = yield call([res, 'json']);
      i++;
      yield delay(POLL_STATUS_DELAY);
    }
    if (status.error) {
      yield put({
        type: COMPARE_BRANCHES_POLL_STATUS.ERROR,
        payload: status.error,
      });
      return;
    }
    if (!status.complete) {
      yield put({
        type: COMPARE_BRANCHES_POLL_STATUS_TIMEOUT,
      });
      return;
    }
    yield put({
      type: COMPARE_BRANCHES_POLL_STATUS.SUCCESS,
      payload: status,
    });
  } catch (e) {
    yield put({
      type: COMPARE_BRANCHES_POLL_STATUS.ERROR,
    });
  }
}

export function* handleCompareSuccessSaga(
  action: CompareBranchesPollStatusAction
) {
  yield put(compareBranchesPollStatus(action.payload));
}

export function* handlePollSuccessSaga() {
  yield put(closeCompareBranchesDialog());
  const { reloadAction } = yield select(getCompareBranchesDialogSlice);
  if (reloadAction) {
    yield put(reloadAction);
  }
  yield put(showFlagComponent('compare-branches-success'));
}

export function* handlePollTimeoutSaga() {
  yield put(closeCompareBranchesDialog());
  yield put(showFlagComponent('compare-branches-timeout'));
}

export function* handleCompareErrorSaga() {
  yield put(closeCompareBranchesDialog());
  yield put(showFlagComponent('compare-branches-error'));
}

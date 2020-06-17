import { put, call, select } from 'redux-saga/effects';

import authRequest from 'src/utils/fetch';
import urls from 'src/sections/repository/urls';

import { getCurrentRepositoryFullSlug } from 'src/selectors/repository-selectors';

import {
  FETCH_DEFAULT_COMMIT_MESSAGE,
  FetchDefaultCommitMessageAction,
} from '../actions';

export default function* fetchDefaultCommitMessageSaga(
  action: FetchDefaultCommitMessageAction
) {
  const repositoryFullName = yield select(getCurrentRepositoryFullSlug);

  const {
    sourceBranchName,
    destinationBranchName,
    mergeStrategy,
  } = action.payload;

  try {
    const url = urls.api.internal.defaultCommitMsg(
      repositoryFullName,
      mergeStrategy,
      sourceBranchName,
      destinationBranchName
    );
    const res = yield call(fetch, authRequest(url));
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data = yield call([res, 'json']);
    yield put({
      type: FETCH_DEFAULT_COMMIT_MESSAGE.SUCCESS,
      payload: data,
    });
  } catch (e) {
    yield put({
      type: FETCH_DEFAULT_COMMIT_MESSAGE.ERROR,
      payload: e,
    });
  }
}

import { put, call, select } from 'redux-saga/effects';

import urls from 'src/sections/repository/urls';
import authRequest from 'src/utils/fetch';
import { encodeBranchName } from 'src/urls/utils';
import { showFlagComponent } from 'src/redux/flags';
import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
} from 'src/selectors/repository-selectors';

import { DeleteBranchErrorTypes } from '../reducers/delete-branch-reducer';
import reloadBranchesSaga from './reload-branches-saga';
import { DELETE_BRANCH, getDeleteBranchDialogSlice } from '..';

export const getErrorType = (status: number) => {
  switch (status) {
    case 404:
      return DeleteBranchErrorTypes.BRANCH_NOT_FOUND;
    case 403:
      return DeleteBranchErrorTypes.ACCESS_DENIED;
    default:
      return DeleteBranchErrorTypes.GENERIC;
  }
};

export default function* deleteBranchSaga() {
  const { branch } = yield select(getDeleteBranchDialogSlice);
  const slug = yield select(getCurrentRepositorySlug);
  const owner = yield select(getCurrentRepositoryOwnerName);
  const url = `${urls.api.v20.branches(owner, slug)}/${encodeBranchName(
    branch.name
  )}`;
  const request = authRequest(url, { method: 'DELETE' });

  try {
    const response = yield call(fetch, request);
    if (response.ok) {
      yield put({
        type: DELETE_BRANCH.SUCCESS,
        payload: branch,
      });
    } else {
      const errorType = getErrorType(response.status);
      yield put({
        type: DELETE_BRANCH.ERROR,
        payload: {
          branch,
          errorType,
        },
      });
    }
  } catch (error) {
    yield put({
      type: DELETE_BRANCH.ERROR,
      payload: {
        branch,
        errorType: DeleteBranchErrorTypes.GENERIC,
      },
    });
  }
}

export function* handleDeleteBranchSuccessSaga() {
  yield put(showFlagComponent('delete-branch-success'));
  yield* reloadBranchesSaga();
}

export function* handleDeleteBranchErrorSaga() {
  yield put(showFlagComponent('delete-branch-error'));
}

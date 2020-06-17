import { all, takeLatest } from 'redux-saga/effects';
import {
  DELETE_BRANCH,
  COMPARE_BRANCHES,
  COMPARE_BRANCHES_POLL_STATUS,
  COMPARE_BRANCHES_POLL_STATUS_TIMEOUT,
  FETCH_DEFAULT_COMMIT_MESSAGE,
  RELOAD_BRANCHES,
  TOGGLE_BRANCH_SELECT,
  BULK_DELETE_BRANCHES,
} from '../actions';

import deleteBranchSaga, {
  handleDeleteBranchSuccessSaga,
  handleDeleteBranchErrorSaga,
} from './delete-branch-saga';

import compareBranchesSaga, {
  compareBranchesPollStatusSaga,
  handleCompareSuccessSaga,
  handleCompareErrorSaga,
  handlePollSuccessSaga,
  handlePollTimeoutSaga,
} from './compare-branches-saga';

import reloadBranchesSaga from './reload-branches-saga';
import { loadBranchesStatusWatcher } from './branches-build-status-saga';
import fetchDefaultCommitMessageSaga from './fetch-commit-message-saga';
import {
  toggleSelectAllSaga,
  toggleSelectOneSaga,
  bulkDeleteBranchesSaga,
  handleBulkDeleteBranchesSuccessSaga,
  handleBulkDeleteBranchesErrorSaga,
} from './bulk-delete-branches-saga';

export default function*() {
  yield all([
    takeLatest(DELETE_BRANCH.REQUEST, deleteBranchSaga),
    takeLatest(DELETE_BRANCH.SUCCESS, handleDeleteBranchSuccessSaga),
    takeLatest(DELETE_BRANCH.ERROR, handleDeleteBranchErrorSaga),

    takeLatest(COMPARE_BRANCHES.REQUEST, compareBranchesSaga),
    takeLatest(COMPARE_BRANCHES.SUCCESS, handleCompareSuccessSaga),
    takeLatest(COMPARE_BRANCHES.ERROR, handleCompareErrorSaga),

    takeLatest(
      COMPARE_BRANCHES_POLL_STATUS.REQUEST,
      compareBranchesPollStatusSaga
    ),
    takeLatest(COMPARE_BRANCHES_POLL_STATUS.SUCCESS, handlePollSuccessSaga),
    takeLatest(COMPARE_BRANCHES_POLL_STATUS.ERROR, handleCompareErrorSaga),
    takeLatest(COMPARE_BRANCHES_POLL_STATUS_TIMEOUT, handlePollTimeoutSaga),

    takeLatest(
      FETCH_DEFAULT_COMMIT_MESSAGE.REQUEST,
      fetchDefaultCommitMessageSaga
    ),
    loadBranchesStatusWatcher(),

    takeLatest(RELOAD_BRANCHES, reloadBranchesSaga),
    takeLatest(TOGGLE_BRANCH_SELECT.ALL_IN_PAGE, toggleSelectAllSaga),
    takeLatest(TOGGLE_BRANCH_SELECT.ONE, toggleSelectOneSaga),
    takeLatest(BULK_DELETE_BRANCHES.REQUEST, bulkDeleteBranchesSaga),
    takeLatest(
      BULK_DELETE_BRANCHES.SUCCESS,
      handleBulkDeleteBranchesSuccessSaga
    ),
    takeLatest(BULK_DELETE_BRANCHES.ERROR, handleBulkDeleteBranchesErrorSaga),
  ]);
}

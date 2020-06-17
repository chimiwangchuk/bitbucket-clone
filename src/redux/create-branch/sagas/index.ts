import { all, takeLatest } from 'redux-saga/effects';

import {
  CHANGE_REPOSITORY,
  CREATE_BRANCH,
  FETCH_BRANCHING_MODEL,
  FETCH_REF_OPTIONS,
  FETCH_COMMIT_STATUSES,
  LOAD_REPOSITORIES,
  SET_CURRENT_REPOSITORY,
} from '../actions';
import {
  createBranchSaga,
  fetchBranchingModelSaga,
  selectDataAndFetchRefOptionsSaga,
  fetchCommitStatusesSaga,
  handleChangeRepositorySaga,
  handleLoadRepositoriesErrorSaga,
  handleLoadRepositoriesSuccessSaga,
  setCurrentRepositorySaga,
  suggestFromBranchSaga,
} from './create-branch-saga';

export default function* createBranchSagas() {
  yield all([
    takeLatest(FETCH_REF_OPTIONS.REQUEST, selectDataAndFetchRefOptionsSaga),
    takeLatest(FETCH_COMMIT_STATUSES.REQUEST, fetchCommitStatusesSaga),
    takeLatest(FETCH_BRANCHING_MODEL.REQUEST, fetchBranchingModelSaga),
    takeLatest(CREATE_BRANCH.REQUEST, createBranchSaga),
    takeLatest(CHANGE_REPOSITORY, handleChangeRepositorySaga),
    takeLatest(SET_CURRENT_REPOSITORY, setCurrentRepositorySaga),
    takeLatest(LOAD_REPOSITORIES.SUCCESS, handleLoadRepositoriesSuccessSaga),
    takeLatest(LOAD_REPOSITORIES.ERROR, handleLoadRepositoriesErrorSaga),
    suggestFromBranchSaga(),
  ]);
}

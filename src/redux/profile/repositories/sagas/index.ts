import { takeLatest, all } from 'redux-saga/effects';
import { FetchProfileRepositories } from '../actions';
import getRepositoryBuildStatusesSaga from './get-repository-build-statuses';

export default function* profileRepositoriesSagas() {
  yield all([
    takeLatest(
      FetchProfileRepositories.SUCCESS,
      getRepositoryBuildStatusesSaga
    ),
  ]);
}

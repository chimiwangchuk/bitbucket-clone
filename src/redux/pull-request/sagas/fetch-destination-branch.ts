import { put, select, take } from 'redux-saga/effects';
import { getDestinationBranchName } from 'src/redux/pull-request/selectors';
import {
  FETCH_DESTINATION_BRANCH,
  LOAD_PULL_REQUEST,
} from 'src/redux/pull-request/actions';
import fetchRepositoryBranch from 'src/sections/repository/actions/fetch-repository-branch';

export function* fetchDestinationBranch(owner: string, slug: string) {
  let destinationBranchName = yield select(getDestinationBranchName);

  if (!destinationBranchName) {
    yield take(LOAD_PULL_REQUEST.SUCCESS);

    destinationBranchName = yield select(getDestinationBranchName);
  }

  yield put(
    fetchRepositoryBranch(
      FETCH_DESTINATION_BRANCH,
      `${owner}/${slug}`,
      destinationBranchName
    )
  );
}

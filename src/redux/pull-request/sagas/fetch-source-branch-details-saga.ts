import { put, select } from 'redux-saga/effects';
import { fetchSourceBranchDetails } from 'src/redux/pull-request/actions';
import {
  getPullRequestBranchName,
  getCurrentPullRequestUrlPieces,
} from 'src/redux/pull-request/selectors';

export default function* fetchSourceBranchDetailsSaga() {
  const { owner, slug } = yield select(getCurrentPullRequestUrlPieces);
  const sourceBranchName = yield select(getPullRequestBranchName);

  yield put(fetchSourceBranchDetails(owner, slug, sourceBranchName));
}

import { put, call } from 'redux-saga/effects';
import { FETCH_BRANCH_SYNC_INFO } from 'src/redux/pull-request/actions';
import { getPullRequestApis } from 'src/sagas/helpers';

function* fetchBranchSyncInfoSaga(
  owner: string,
  slug: string,
  id: string | number
) {
  try {
    const api = yield* getPullRequestApis();
    const info = yield call(api.getBranchSyncInfo, owner, slug, id);
    yield put({
      type: FETCH_BRANCH_SYNC_INFO.SUCCESS,
      payload: info,
    });
  } catch (e) {
    yield put({
      type: FETCH_BRANCH_SYNC_INFO.ERROR,
    });
  }
}

export default fetchBranchSyncInfoSaga;

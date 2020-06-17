import { put, call } from 'redux-saga/effects';
import { FETCH_CONFLICTS } from 'src/redux/pull-request/actions';
import { getPullRequestApis } from 'src/sagas/helpers';

function* fetchConflictsSaga(owner: string, slug: string, id: string | number) {
  try {
    const api = yield* getPullRequestApis();
    const conflicts = yield call(api.getConflicts, owner, slug, id);
    yield put({
      type: FETCH_CONFLICTS.SUCCESS,
      payload: conflicts,
    });
  } catch (e) {
    // We aren't concerned with this request erroring for now
  }
}

export default fetchConflictsSaga;

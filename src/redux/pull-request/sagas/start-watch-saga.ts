import { take } from 'redux-saga/effects';
import { START_WATCH } from 'src/redux/pull-request/actions';
import { watchSaga } from 'src/redux/pull-request/sagas/watch-saga';
import { getPullRequestApis } from 'src/sagas/helpers';

export function* startWatchSaga() {
  const api = yield* getPullRequestApis();

  while (true) {
    yield take(START_WATCH.BEGIN);
    yield* watchSaga(api.startWatch);
  }
}

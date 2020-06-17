import { take } from 'redux-saga/effects';
import { STOP_WATCH } from 'src/redux/pull-request/actions';
import { watchSaga } from 'src/redux/pull-request/sagas/watch-saga';
import { getPullRequestApis } from 'src/sagas/helpers';

export function* stopWatchSaga() {
  const api = yield* getPullRequestApis();

  while (true) {
    yield take(STOP_WATCH.BEGIN);
    yield* watchSaga(api.stopWatch);
  }
}

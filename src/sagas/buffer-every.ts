import { take, call, actionChannel, fork } from 'redux-saga/effects';

// XXX figure out types for the saga
// https://softwareteams.atlassian.net/browse/BBCDEV-10784
export default function bufferEvery(pattern: string, saga: any) {
  return fork(function* forkedGen() {
    const channel = yield actionChannel(pattern);
    while (true) {
      const action = yield take(channel);
      yield call(saga, action);
    }
  });
}

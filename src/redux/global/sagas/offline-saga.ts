import { eventChannel } from 'redux-saga';
import { take, put, call, delay, fork, cancel } from 'redux-saga/effects';

import { showFlagComponent, dismissFlag } from 'src/redux/flags';
import { NETWORK_OFFLINE, NETWORK_ONLINE } from '../actions';

// we need to wait between dismissing previous notification
// and showing next one. If not - notifications will stack up
// we want to avoid such behavior in this case
export const AVOID_NOTIFICATION_GROUPING_DELAY = 500;

export function createOfflineEventChannel() {
  return eventChannel(emitter => {
    const setOnline = () => emitter(false);
    const setOffline = () => emitter(true);

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  });
}

function* notifyOnline() {
  yield put({ type: NETWORK_ONLINE });
  yield put(dismissFlag('network-offline'));
  yield delay(AVOID_NOTIFICATION_GROUPING_DELAY);
  yield put(showFlagComponent('network-online'));
}

function* notifyOffline() {
  yield put({ type: NETWORK_OFFLINE });
  yield put(dismissFlag('network-online'));
  yield delay(AVOID_NOTIFICATION_GROUPING_DELAY);
  yield put(showFlagComponent('network-offline'));
}

export default function* offlineSaga() {
  const offlineEventChannel = yield call(createOfflineEventChannel);
  let prevNotifyTask;
  while (true) {
    const isOffline = yield take(offlineEventChannel);
    if (prevNotifyTask) {
      yield cancel(prevNotifyTask);
    }
    if (isOffline) {
      prevNotifyTask = yield fork(notifyOffline);
    } else {
      prevNotifyTask = yield fork(notifyOnline);
    }
  }
}

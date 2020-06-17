import { delay, race, call, put, take } from 'redux-saga/effects';

import {
  LoadStatusPageIncidentsSuccess,
  LoadStatusPageIncidentsError,
  STOP_STATUSPAGE_POLLING,
  START_STATUSPAGE_POLLING,
} from '../actions/statuspage';
import { getIncidents } from '../api/statuspage-api';
import { PAGE_HIDDEN, PAGE_VISIBLE } from '../actions/page-visibility';

/**
 * Polls statuspage once per minute for incident updates
 */
export function* pollStatuspageSaga() {
  while (true) {
    try {
      yield delay(60000); // 1 minute
      const resp = yield call(getIncidents);
      yield put(LoadStatusPageIncidentsSuccess(resp));
    } catch (error) {
      yield put(LoadStatusPageIncidentsError(error));
      // TODO: Backoff in case the API failure is intermittant?
      yield put({ type: STOP_STATUSPAGE_POLLING });
    }
  }
}

/**
 * Starts polling statuspage when the window comes into focus or the start_polling
 * action is dispatched. If the window looses focus or a stop event is dispatched
 * polling will be canceled.
 */
export function* pollStatuspageWhileVisibleSaga() {
  while (true) {
    yield take([PAGE_VISIBLE, START_STATUSPAGE_POLLING]);
    yield race({
      pollStatuspage: call(pollStatuspageSaga),
      hidePage: take(PAGE_HIDDEN),
      stopPolling: take(STOP_STATUSPAGE_POLLING),
    });
  }
}

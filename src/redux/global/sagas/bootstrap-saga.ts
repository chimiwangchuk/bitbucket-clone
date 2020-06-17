import * as Sentry from '@sentry/browser';
import { call, put, take, select, spawn } from 'redux-saga/effects';

import { getCurrentUser } from 'src/selectors/user-selectors';
import { LoadGlobal } from '../actions';
import { START_STATUSPAGE_POLLING } from '../actions/statuspage';
import { pollStatuspageWhileVisibleSaga } from './poll-statuspage-saga';

export default function* bootstrapSaga() {
  yield take(LoadGlobal.SUCCESS);

  yield spawn(pollStatuspageWhileVisibleSaga);
  yield put({ type: START_STATUSPAGE_POLLING });

  const currentUser = yield select(getCurrentUser);
  if (currentUser && currentUser.uuid) {
    yield call(Sentry.configureScope, scope => {
      scope.setUser({
        id: currentUser.uuid,
      });
    });
  }
}

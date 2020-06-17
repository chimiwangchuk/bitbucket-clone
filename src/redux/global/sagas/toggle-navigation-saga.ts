import { call, select, takeLatest } from 'redux-saga/effects';
import { getCurrentUser } from 'src/selectors/user-selectors';
import prefs from 'src/utils/preferences';
import { TOGGLE_NAVIGATION_INIT } from '../actions';

// @ts-ignore TODO: fix noImplicitAny error here
export function* toggleNavigationInit(action) {
  const { payload } = action;
  const isOpen: boolean = payload;

  const user = yield select(getCurrentUser);
  if (user) {
    yield call(prefs.set, user.uuid, 'adg3-sidebar-closed', !isOpen);
  }
}

function* toggleNavigationSaga() {
  yield takeLatest(TOGGLE_NAVIGATION_INIT, toggleNavigationInit);
}

export default toggleNavigationSaga;

import { call, select, take, cancel, fork, delay } from 'redux-saga/effects';

import { getCurrentUser } from 'src/selectors/user-selectors';
import prefs from 'src/utils/preferences';

import { TOGGLE_SIDEBAR, ToggleSidebarAction } from '../actions';
import { isSidebarOpen, getSidebarWidth } from '../reducer';

export function* onToggleSidebar(action: ToggleSidebarAction) {
  const { sidebarType } = action.payload;

  const currentUser = yield select(getCurrentUser);
  const isOpen = yield select(isSidebarOpen, sidebarType);
  const width = yield select(getSidebarWidth, sidebarType);

  if (currentUser) {
    yield call(
      prefs.set,
      currentUser.uuid,
      `right-sidebar-${sidebarType}-collapsed`,
      !isOpen
    );
    if (isOpen) {
      yield call(
        prefs.set,
        currentUser.uuid,
        `right-sidebar-${sidebarType}-width`,
        width
      );
    }
  }
}

export default function* toggleSidebarSaga() {
  // Debouncing the saga reduces load on the preferences API when rapidly toggling the sidebar
  // It also limits this saga to running once per toggle (the TOGGLE_SIDEBAR action can fire
  // twice if the sidebar collapsed/expanded state is triggered externally: once to open/close
  // and once via the sidebar onResize callback to update redux to the new width)
  // Taken from redux-saga-debounce-effect library, copied because we've bumped to newer redux-saga
  // @ts-ignore TODO: fix noImplicitAny error here
  function* delayedSaga(action) {
    yield delay(500);
    yield call(onToggleSidebar, action);
  }

  let task;
  while (true) {
    const action = yield take(TOGGLE_SIDEBAR);
    if (task) {
      yield cancel(task);
    }

    task = yield fork(delayedSaga, action);
  }
}

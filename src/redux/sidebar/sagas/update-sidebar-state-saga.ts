import { select, put } from 'redux-saga/effects';

import updateMobileHeaderState from 'src/redux/global/actions/update-mobile-header-state';
import { getIsMobileHeaderActive } from 'src/selectors/global-selectors';
import { toggleSidebar } from '../actions';

// @ts-ignore TODO: fix noImplicitAny error here
export default function* updateSidebarStateSaga(action) {
  const isMobileHeaderActive = yield select(getIsMobileHeaderActive);
  if (isMobileHeaderActive && !action.payload.isOpen) {
    yield put(updateMobileHeaderState('none'));
  } else {
    yield put(toggleSidebar(action.payload));
  }
}

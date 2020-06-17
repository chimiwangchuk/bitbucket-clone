import { select, put } from 'redux-saga/effects';

import updateMobileHeaderState from 'src/redux/global/actions/update-mobile-header-state';
import { getIsMobileHeaderActive } from 'src/selectors/global-selectors';
import toggleNavigation from '../actions/toggle-navigation';

// @ts-ignore TODO: fix noImplicitAny error here
export default function* updateNavigationStateSaga(action) {
  const isMobileHeaderActive = yield select(getIsMobileHeaderActive);
  const isOpen = action.payload !== undefined && action.payload;
  if (isMobileHeaderActive && !isOpen) {
    yield put(updateMobileHeaderState('none'));
  } else {
    yield put(toggleNavigation(action.payload) as any);
  }
}

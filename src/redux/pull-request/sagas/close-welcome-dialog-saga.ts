import { select, call } from 'redux-saga/effects';

import prefs from 'src/utils/preferences';
import { getCurrentUser } from 'src/selectors/user-selectors';

export function* closeWelcomeDialogSaga() {
  const currentUser = yield select(getCurrentUser);

  if (currentUser) {
    yield call(
      prefs.set,
      currentUser.uuid,
      'code-review-welcome-dialog-closed',
      true
    );
  }
}

import { put, take, select } from 'redux-saga/effects';

import { LoadRepositoryPage } from 'src/sections/repository/actions';
import fetchUserEmails from 'src/sections/repository/actions/fetch-user-emails';
import { getIsRepositoryPageLoadingErrorGuardEnabled } from 'src/selectors/feature-selectors';

function* loadRepositoryErrorSaga() {
  const isRepositoryPageLoadingErrorGuardEnabled = select(
    getIsRepositoryPageLoadingErrorGuardEnabled
  );

  if (isRepositoryPageLoadingErrorGuardEnabled) {
    while (true) {
      yield take(LoadRepositoryPage.ERROR);
      yield put(fetchUserEmails());
    }
  }
}

export default loadRepositoryErrorSaga;

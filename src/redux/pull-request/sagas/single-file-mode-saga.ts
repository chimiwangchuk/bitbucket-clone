import * as Sentry from '@sentry/browser';

import { select, put, call } from 'redux-saga/effects';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { dismissFlagWithoutUpdatingSeenState, showFlag } from 'src/redux/flags';
import messages from 'src/sections/global/components/flags/single-file-mode/single-file-mode.i18n';
import { getIsCodeReviewSingleFileModeEnabled } from 'src/selectors/feature-selectors';
import preferences from 'src/utils/preferences';
import { getIsSingleFileModeActive } from '../selectors';

export const SINGLE_FILE_MODE_FLAG_ID = 'single-file-mode-enabled';
export const SINGLE_FILE_MODE_FLAG_VIEWED_PREF_KEY =
  'single-file-mode-flag-viewed';

export function* dismissFileModeEnabledFlag() {
  const isSingleFileModeFeatureEnabled = yield select(
    getIsCodeReviewSingleFileModeEnabled
  );
  if (!isSingleFileModeFeatureEnabled) {
    return;
  }
  // don't update seen state due to non user-initiated dismissal
  yield put(dismissFlagWithoutUpdatingSeenState(SINGLE_FILE_MODE_FLAG_ID));
}

export function* saveFileModeFlagEnabledSeenStateSaga() {
  const isSingleFileModeFeatureEnabled = yield select(
    getIsCodeReviewSingleFileModeEnabled
  );
  if (!isSingleFileModeFeatureEnabled) {
    return;
  }
  const currentUser = yield select(getCurrentUser);
  if (currentUser && currentUser.uuid) {
    yield call(
      preferences.set,
      currentUser.uuid,
      SINGLE_FILE_MODE_FLAG_VIEWED_PREF_KEY,
      true
    );
  }
}

export function* singleFileModeEnabledSaga() {
  const isSingleFileModeFeatureEnabled = yield select(
    getIsCodeReviewSingleFileModeEnabled
  );
  if (!isSingleFileModeFeatureEnabled) {
    return;
  }

  const isSingleFileMode = yield select(getIsSingleFileModeActive);
  if (isSingleFileMode) {
    const currentUser = yield select(getCurrentUser);
    if (currentUser && currentUser.uuid) {
      let userHasSeenFlag = false;
      try {
        userHasSeenFlag = yield call(
          preferences.get,
          currentUser.uuid,
          SINGLE_FILE_MODE_FLAG_VIEWED_PREF_KEY
        );
      } catch (e) {
        Sentry.captureException(e);
      }
      if (!userHasSeenFlag) {
        yield put(
          showFlag({
            id: SINGLE_FILE_MODE_FLAG_ID,
            iconType: 'normal',
            title: { msg: messages.singleFileModeEnabledFlagTitle },
            description: { msg: messages.singleFileModeEnabledFlagDescription },
          })
        );
      }
    }
  }
}

import * as Sentry from '@sentry/browser';
import { Action } from 'redux';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import commonMessages from 'src/i18n/common';
import { showFlagComponent, showFlag } from 'src/redux/flags';
import { SimpleFlagProps } from 'src/redux/flags/types';
import {
  getGlobalDiffViewMode,
  getGlobalIsColorBlindModeEnabled,
  getGlobalIsWordDiffEnabled,
  getGlobalShouldIgnoreWhitespace,
  getGlobalIsAnnotationsEnabled,
  UPDATE_GLOBAL_DIFF_VIEW_MODE_SUCCESS,
  UPDATE_GLOBAL_IS_WORD_DIFF_ENABLED_SUCCESS,
  UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS,
  UPDATE_GLOBAL_IS_COLOR_BLIND_MODE_ENABLED_SUCCESS,
  UPDATE_GLOBAL_IS_ANNOTATIONS_ENABLED_SUCCESS,
  UPDATE_SETTINGS_REQUEST,
  UPDATE_SETTINGS_SUCCESS,
  UpdateGlobalDiffViewModeSuccessAction,
  UpdateGlobalIsWordDiffEnabledSuccessAction,
  UpdateGlobalShouldIgnoreWhitespaceSuccessAction,
  UpdateGlobalIsColorBlindNodeEnabledSuccessAction,
  UpdateGlobalIsAnnotationsEnabledSuccessAction,
  UpdateSettingsRequestAction,
  UpdateSettingsSuccessAction,
} from 'src/redux/pull-request-settings';
import messages from 'src/sections/repository/sections/pull-request/components/pull-request-settings/i18n';
import { getCurrentUser } from 'src/selectors/user-selectors';
import preferencesApi, { PreferenceKey } from 'src/utils/preferences';

export const GLOBAL_DIFF_VIEW_MODE_PREFERENCE_KEY =
  'pull-request-diff-view-mode';
export const GLOBAL_COLOR_BLIND_MODE_PREFERENCE_KEY =
  'pull-request-color-blind-mode-enabled';
export const GLOBAL_IGNORE_WHITESPACE_PREFERENCE_KEY =
  'pull-request-ignore-whitespace-enabled';
export const GLOBAL_WORD_DIFF_PREFERENCE_KEY = 'pull-request-word-diff-enabled';
export const GLOBAL_ANNOTATIONS_PREFERENCE_KEY =
  'pull-request-annotations-enabled';

type UpdateUserPreferenceOptions = {
  key: PreferenceKey;
  successAction: Action;
  userUuid?: string;
  value: any;
};

// exported for use in tests
export const SUCCESS_FLAG = {
  id: 'pull-request-settings-update-success',
  description: { msg: messages.successFlagDescription },
  iconType: 'success',
  title: { msg: commonMessages.success },
} as SimpleFlagProps;

function* updateUserPreference(options: UpdateUserPreferenceOptions) {
  try {
    // If the current user isn't logged in, we don't have a user preference to update, so just fire the
    // success action to trigger any necessary re-renders and move on
    if (!options.userUuid) {
      yield put(options.successAction);
      // Return a truthy value so the saga doesn't produce an error flag
      return true;
    }

    const response = yield call(
      preferencesApi.set,
      options.userUuid,
      options.key,
      options.value
    );
    yield put(options.successAction);
    return response;
  } catch (e) {
    // Don't re-throw -- we want the `yield all` to wait for *all* of the updates to finish rather than
    // exit early if one fails
    Sentry.withScope(scope => {
      scope.setTag('preferenceKey', `${options.key}`);
      Sentry.captureMessage(
        `Error while updating a user preference via the Pull Request settings modal`,
        Sentry.Severity.Error
      );
    });
    return undefined;
  }
}

export function* updatePullRequestSettingsSaga(
  action: UpdateSettingsRequestAction
) {
  const currentUser = yield select(getCurrentUser);

  const globalDiffViewMode = yield select(getGlobalDiffViewMode);
  const globalIsWordDiffEnabled = yield select(getGlobalIsWordDiffEnabled);
  const globalIsColorBlindModeEnabled = yield select(
    getGlobalIsColorBlindModeEnabled
  );
  const globalShouldIgnoreWhitespace = yield select(
    getGlobalShouldIgnoreWhitespace
  );
  const globalIsAnnotationsEnabled = yield select(
    getGlobalIsAnnotationsEnabled
  );

  const newGlobalDiffViewMode = action.payload.diffViewMode;
  const newGlobalIsWordDiffEnabled = action.payload.isWordDiffEnabled;
  const newGlobalShouldIgnoreWhitespace = action.payload.shouldIgnoreWhitespace;
  const newGlobalIsColorBlindModeEnabled =
    action.payload.isColorBlindModeEnabled;
  const newGlobalIsAnnotationsEnabled = action.payload.isAnnotationsEnabled;

  const preferenceUpdateEffects = [];

  // This is just a passthrough for now, but the persistence logic to use a user pref (starting with COREX-1934)
  // will go here and this success action will then depend on the result of that API request
  if (newGlobalDiffViewMode !== globalDiffViewMode) {
    const successAction: UpdateGlobalDiffViewModeSuccessAction = {
      type: UPDATE_GLOBAL_DIFF_VIEW_MODE_SUCCESS,
      payload: {
        diffViewMode: newGlobalDiffViewMode,
      },
    };

    preferenceUpdateEffects.push(
      call(updateUserPreference, {
        key: GLOBAL_DIFF_VIEW_MODE_PREFERENCE_KEY,
        successAction,
        userUuid: currentUser?.uuid,
        value: newGlobalDiffViewMode,
      })
    );
  }

  if (newGlobalIsWordDiffEnabled !== globalIsWordDiffEnabled) {
    const successAction: UpdateGlobalIsWordDiffEnabledSuccessAction = {
      type: UPDATE_GLOBAL_IS_WORD_DIFF_ENABLED_SUCCESS,
      payload: {
        isWordDiffEnabled: newGlobalIsWordDiffEnabled,
      },
    };

    preferenceUpdateEffects.push(
      call(updateUserPreference, {
        key: GLOBAL_WORD_DIFF_PREFERENCE_KEY,
        successAction,
        userUuid: currentUser?.uuid,
        value: newGlobalIsWordDiffEnabled,
      })
    );
  }

  if (newGlobalShouldIgnoreWhitespace !== globalShouldIgnoreWhitespace) {
    const successAction: UpdateGlobalShouldIgnoreWhitespaceSuccessAction = {
      type: UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS,
      payload: {
        shouldIgnoreWhitespace: newGlobalShouldIgnoreWhitespace,
      },
    };

    preferenceUpdateEffects.push(
      call(updateUserPreference, {
        key: GLOBAL_IGNORE_WHITESPACE_PREFERENCE_KEY,
        successAction,
        userUuid: currentUser?.uuid,
        value: newGlobalShouldIgnoreWhitespace,
      })
    );
  }

  if (newGlobalIsColorBlindModeEnabled !== globalIsColorBlindModeEnabled) {
    const successAction: UpdateGlobalIsColorBlindNodeEnabledSuccessAction = {
      type: UPDATE_GLOBAL_IS_COLOR_BLIND_MODE_ENABLED_SUCCESS,
      payload: {
        isColorBlindModeEnabled: newGlobalIsColorBlindModeEnabled,
      },
    };

    preferenceUpdateEffects.push(
      call(updateUserPreference, {
        key: GLOBAL_COLOR_BLIND_MODE_PREFERENCE_KEY,
        successAction,
        userUuid: currentUser?.uuid,
        value: newGlobalIsColorBlindModeEnabled,
      })
    );
  }

  if (newGlobalIsAnnotationsEnabled !== globalIsAnnotationsEnabled) {
    const successAction: UpdateGlobalIsAnnotationsEnabledSuccessAction = {
      type: UPDATE_GLOBAL_IS_ANNOTATIONS_ENABLED_SUCCESS,
      payload: {
        isAnnotationsEnabled: newGlobalIsAnnotationsEnabled,
      },
    };

    preferenceUpdateEffects.push(
      call(updateUserPreference, {
        key: GLOBAL_ANNOTATIONS_PREFERENCE_KEY,
        successAction,
        userUuid: currentUser?.uuid,
        value: newGlobalIsAnnotationsEnabled,
      })
    );
  }

  const results = yield all(preferenceUpdateEffects);

  if (results.every(Boolean)) {
    const successAction: UpdateSettingsSuccessAction = {
      type: UPDATE_SETTINGS_SUCCESS,
    };
    yield put(successAction);
    yield put(showFlag(SUCCESS_FLAG));
  } else {
    yield put(showFlagComponent('pull-request-preferences-error'));
  }
}

export default function* pullRequestSettingsSagas() {
  yield all([
    takeLatest(UPDATE_SETTINGS_REQUEST, updatePullRequestSettingsSaga),
  ]);
}

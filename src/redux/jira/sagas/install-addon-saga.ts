import { call, put, select } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import settings from 'src/settings';
import fetchAccessToken from 'src/utils/fetch-access-token';
import { captureMessageForResponse } from 'src/utils/sentry';
import { getCurrentRepository } from 'src/selectors/repository-selectors';
import { INSTALL_JIRA_ADDON } from '../actions';

export function* installAddonSaga() {
  const currentRepo = yield select(getCurrentRepository);
  const url = `${settings.API_CANON_URL}/internal/site/addons/account/${currentRepo.owner.uuid}/install/`;
  try {
    const accessToken = yield call(
      fetchAccessToken,
      'site:bitbucket-jira-installer'
    );
    const response = yield call(fetch, url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    });

    if (response.ok) {
      yield put({
        type: INSTALL_JIRA_ADDON.SUCCESS,
      });
    } else {
      yield captureMessageForResponse(response, 'Installing Jira addon failed');
      yield put({
        type: INSTALL_JIRA_ADDON.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: INSTALL_JIRA_ADDON.ERROR,
    });
  }
}

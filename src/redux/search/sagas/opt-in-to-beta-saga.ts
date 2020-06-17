import { call, put } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import { change } from 'redux-form';
import { User } from 'src/components/types';
import settings from 'src/settings';
import { FORM_KEY } from 'src/constants/search';
import fetchAccessToken from 'src/utils/fetch-access-token';
import { user as userSchema } from 'src/sections/profile/schemas';
import { OptInToBeta } from 'src/redux/search/actions';

type OptInToBetaAction = {
  type: 'search/OPT_IN_TO_BETA_REQUEST';
  payload: {
    account: User;
  };
};

export default function* optInToBetaSaga({
  payload: { account },
}: OptInToBetaAction) {
  const url = `${settings.API_CANON_URL}/internal/site/addons/account/${account.uuid}/install/`;
  try {
    const accessToken = yield call(fetchAccessToken, `site:search-installer`);
    const response = yield call(fetch, url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Authorization error');
    }
  } catch (e) {
    yield put({
      type: OptInToBeta.ERROR,
      error: true,
    });
    if (e instanceof Error) {
      Sentry.captureException(e);
    }
    return;
  }

  // We want to update our normalized account to reflect the new search state
  const updatedAccount = {
    ...account,
    extra: {
      ...account.extra,
      search_state: 'ENABLED',
    },
  };
  // Also update the separate state in the account switcher form.
  // Otherwise the search form doesn't work after opting in.
  yield put(change(FORM_KEY, 'account', updatedAccount));
  yield put({
    type: OptInToBeta.SUCCESS,
    payload: updatedAccount,
    meta: {
      schema: userSchema,
    },
  });
}

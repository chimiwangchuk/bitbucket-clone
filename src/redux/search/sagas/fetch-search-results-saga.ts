import { call, put, select } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import qs from 'qs';
import urls from 'src/urls/search';
import store from 'src/utils/store';
import { SEARCH_RECENT_LOCALSTORAGE_KEY } from 'src/constants/search';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { SearchQueryParams } from 'src/types/search';
import { uncurlyUuid } from '@atlassian/bitkit-analytics';
import {
  publishFact,
  publishTrackEvent,
  TrackEvent,
} from 'src/utils/analytics/publish';
import { SearchResultsViewedFact } from 'src/sections/search/facts';
import { FetchSearchResults } from 'src/redux/search/actions';
import authRequest from 'src/utils/fetch';
import settings from 'src/settings';
import { getTokenDetails, getAuthHeader } from 'src/utils/get-token-details';
import { statsdApiClient } from 'src/utils/metrics';
import { getIsExpiresDurationInApiToken } from 'src/selectors/feature-selectors';

import { getSearchAccount } from '../selectors';

type SearchParamsAction = {
  type: 'search/FETCH_SEARCH_RESULTS';
  payload: SearchQueryParams;
};

export default function* fetchSearchResultSaga({
  payload: { q, account, page },
}: SearchParamsAction) {
  const targetAccount = yield select(getSearchAccount, { account });
  const url = urls.api.v20.code(targetAccount);
  store.set(SEARCH_RECENT_LOCALSTORAGE_KEY, targetAccount.uuid);
  const params = {
    search_query: q,
    page,
    fields: '+values.file.commit.repository.mainbranch.name',
  };
  const request = authRequest(
    `${settings.API_CANON_URL}${url}?${qs.stringify(params)}`
  );
  const start = Date.now();
  try {
    const searchTrackEvent: TrackEvent = {
      action: 'searched',
      actionSubject: 'code',
      actionSubjectId: uncurlyUuid(targetAccount.uuid),
      source: 'searchResultsScreen',
      attributes: {},
    };
    const currentUser = yield select(getCurrentUser);
    const expiresDurationInApiToken = yield select(
      getIsExpiresDurationInApiToken
    );
    const options = yield call(
      getTokenDetails,
      currentUser && currentUser.uuid,
      expiresDurationInApiToken
    );
    const headers = yield call(getAuthHeader, options);

    const response = yield call(fetch, request, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    const json = yield response.json();
    const tags = [
      `response:${response.status === 200 ? 'ok' : 'error'}`,
      `status:${response.status}`,
    ];

    statsdApiClient.histogram(
      {
        'search_results.search.timing': Math.round(Date.now() - start),
      },
      { tags }
    );

    if (response.ok) {
      if (!page) {
        // only fire on initial query
        searchTrackEvent.attributes = { status: 'success' };
        yield call(publishTrackEvent, searchTrackEvent);
        yield call(
          publishFact,
          new SearchResultsViewedFact({
            total_result_count: json.size,
            is_substituted: json.query_substituted,
          })
        );
      }

      yield put({
        type: FetchSearchResults.SUCCESS,
        payload: json,
      });
    } else {
      if (!page && json.error && json.error.data && json.error.data.key) {
        const errorKey = json.error.data.key;
        searchTrackEvent.attributes = {
          status: 'error',
          error: errorKey,
        };
        yield call(publishTrackEvent, searchTrackEvent);
        yield call(
          publishFact,
          new SearchResultsViewedFact({
            error: errorKey,
          })
        );
      }
      yield put({
        type: FetchSearchResults.ERROR,
        error: true,
        meta: json,
      });
    }
  } catch (err) {
    statsdApiClient.histogram(
      {
        'search_results.search.timing': Math.round(Date.now() - start),
      },
      { tags: ['response:error'] }
    );
    yield put({
      type: FetchSearchResults.ERROR,
      error: true,
      // An empty object (`{}`) will trigger the display of a generic error msg
      meta: {},
    });

    if (err instanceof Error) {
      Sentry.captureException(err);
    }
  }
}

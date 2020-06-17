import { put, call, select } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import urls from 'src/redux/pull-request/urls';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import { getPullRequestApis } from 'src/sagas/helpers';
import { UrlPieces } from 'src/types/pull-request';
import { FETCH_ACTIVITY } from '../activity-reducer';

/**
 * Recurses itself to get every page of the activity endpoint
 * until there is no next url found. Each page results in a
 * FETCH_ACTIVITY.SUCCESS event being dispatched with the next
 * list of events.
 */
// @ts-ignore TODO: fix noImplicitAny error here
export function* fetchActivityFeedPage(url: string | undefined) {
  if (!url) {
    return;
  }

  const api = yield* getPullRequestApis();
  try {
    const response = yield call(api.getActivity, url);
    yield put({
      type: FETCH_ACTIVITY.SUCCESS,
      payload: {
        activityEvents: response.values,
        nextUrl: response.next,
      },
    });
    yield* fetchActivityFeedPage(response.next);
  } catch (e) {
    yield put({
      type: FETCH_ACTIVITY.ERROR,
      payload: e.message,
    });
  }
}

/**
 * Fetches the entirety of the activity endpoint page by page sequentially.
 * This entrance point resolves how to build the first activity page's URL.
 * @param pieces Optional map of owner, slug, id values. If omitted the saga will look at the values in the state.
 */
export function* fetchActivityFeed(pieces?: UrlPieces) {
  const hasPieces = pieces && pieces.owner && pieces.slug && pieces.id;
  const { owner, slug, id } = hasPieces
    ? pieces
    : yield select(getCurrentPullRequestUrlPieces);

  if (!owner || !slug || !id) {
    Sentry.captureMessage(
      `Tried to fetch activity feed but lacked something ${JSON.stringify({
        owner,
        slug,
        id,
      })}`,
      Sentry.Severity.Info
    );
    return;
  }

  const activityFirstPageUrl = urls.api.internal.activity({
    owner,
    slug,
    id,
  });
  yield* fetchActivityFeedPage(activityFirstPageUrl);
}

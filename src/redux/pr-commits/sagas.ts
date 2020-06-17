import { put, call, all, takeLatest, select } from 'redux-saga/effects';
import urls from 'src/redux/pull-request/urls';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import { getPullRequestApis } from 'src/sagas/helpers';
import { UrlPieces } from 'src/types/pull-request';
import { commit } from '../pull-request/schemas';
import Actions from './actions';
import { getCommitsNextUrl } from './selectors';

type UrlString = string;

// Workhorse function to simply use the api layer and the url to put commits into state
export function* fetchCommits(url: UrlString) {
  const api = yield* getPullRequestApis();
  const response: UnwrapPromise<typeof api.getCommits> = yield call(
    api.getCommits,
    url
  );

  if ('error' in response) {
    yield put({ type: Actions.COMMIT_FETCH_ERROR, payload: response.status });
    return;
  }

  const { commits, next, page } = response;
  yield put({
    type: Actions.UPDATE_COMMITS,
    meta: {
      schema: { commits: [commit] },
    },
    payload: { commits, next, page },
  });
}

/** Useful before we have anything in state */
export function* prefetchCommits({ owner, slug, id }: UrlPieces) {
  const url = urls.api.v20.commits(owner, slug, id);
  yield fetchCommits(url);
}

/** owner, slug, and id are expected to be in state */
export function* retryCommits() {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  if (!owner || !slug || !id) {
    return;
  }
  const url = urls.api.v20.commits(owner, slug, id);
  yield fetchCommits(url);
}

/** Uses next url from state */
export function* fetchNextCommits() {
  const nextUrl = yield select(getCommitsNextUrl);
  yield fetchCommits(nextUrl);
}

export function* rootPrCommitsSaga() {
  yield all([
    takeLatest(Actions.RETRY_COMMITS, retryCommits),
    takeLatest(Actions.FETCH_MORE_COMMITS, fetchNextCommits),
  ]);
}

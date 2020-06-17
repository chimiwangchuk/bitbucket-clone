import { call, put, select, spawn, take } from 'redux-saga/effects';
import initialState from 'src/initial-state';
import {
  EnteredCodeReviewAction,
  UNLOAD_PULL_REQUEST,
  LOAD_PULL_REQUEST,
} from 'src/redux/pull-request/actions';
import {
  getLastPullRequestRetrievalTime,
  getCurrentPullRequest,
  getDefaultMergeStrategy,
} from 'src/redux/pull-request/selectors';
import { fetchActivityFeed } from 'src/redux/pull-request/sagas/fetch-activity-saga';
import { getCurrentPullRequestCommits } from 'src/redux/pr-commits/selectors';
import { prefetchCommits } from 'src/redux/pr-commits/sagas';
import fetchConflictsSaga from './fetch-conflicts-saga';
import { restorePersistedStateSaga } from './diff-files-state-persistor-saga';
import {
  fetchPullRequest,
  completePullRequestUpdate,
} from './fetch-pull-request-saga';
import { fetchMergeChecksSaga } from './fetch-merge-checks-saga';
import {
  fetchDiffStatByPrIdSaga,
  fetchDiffStatByCompareSpecSaga,
} from './fetch-diffstat-saga';
import {
  fetchDiffByPrIdSaga,
  fetchDiffByCompareSpecSaga,
} from './fetch-diff-saga';
import fetchBranchSyncInfoSaga from './branch-sync-info-saga';
import { fetchDestinationBranch } from './fetch-destination-branch';

export const TIME_TO_STALE = 30 * 1000;

// Utils
// @ts-ignore TODO: fix noImplicitAny error here
const isSamePR = (prData, owner, slug, id) => {
  const currentPullRequest = prData?.currentPullRequest || {};
  const prFullName =
    currentPullRequest?.destination?.repository?.full_name || '/';
  const [prOwner, prSlug] = prFullName.split('/');

  return (
    parseInt(currentPullRequest.id, 10) === parseInt(id, 10) &&
    prOwner === owner &&
    prSlug === slug
  );
};

export function* codeReviewDataSaga(action: EnteredCodeReviewAction) {
  const { owner, slug, id } = action;
  // This mimics the structure of the hydrated pr data from window.__initial_state__
  const statePRdata = {
    commits: yield select(getCurrentPullRequestCommits),
    currentPullRequest: yield select(getCurrentPullRequest),
    defaultMergeStrategy: yield select(getDefaultMergeStrategy),
  };
  const { pullRequest: hydratedPRdata } = initialState?.repository || {};

  const lastFetched = yield select(getLastPullRequestRetrievalTime);
  const timeSinceLastFetch = lastFetched ? Date.now() - lastFetched : 0;

  const shouldUseState =
    !!statePRdata &&
    isSamePR(statePRdata, owner, slug, id) &&
    timeSinceLastFetch <= TIME_TO_STALE;

  // Activity feed is cleared when the user leaves a PR. So, we need to refetch it
  // even if it's the same PR
  yield spawn(fetchActivityFeed, { owner, slug, id });

  if (shouldUseState) {
    return;
  }

  // Always re-fetch, non-blocking.
  // The owner/slug/id here is from route so not contingent on fetching the PR data first
  yield put({ type: UNLOAD_PULL_REQUEST });

  yield spawn(fetchConflictsSaga, owner, slug, id);
  yield spawn(restorePersistedStateSaga, owner, slug, id);
  yield spawn(fetchMergeChecksSaga, owner, slug, id);
  yield spawn(prefetchCommits, { owner, slug, id });
  yield spawn(fetchBranchSyncInfoSaga, owner, slug, id);

  // Completing a fetch of pullrequest will trigger a fetch of conversations
  const haveHydratedPR = !!hydratedPRdata;
  if (haveHydratedPR) {
    delete initialState?.repository?.pullRequest;

    // If we have a hydrated pull request, then we will fetch the diff & diffstat
    // using the URLs on the PR resource. These URLs point to the generic repo
    // diff & diffstat endpoints, which is ultimately what the pull-request diff
    // & diffstat endpoints redirect to. So using these URLs directly will save
    // us the 302 redirect which is 100-200ms.
    yield call(completePullRequestUpdate, hydratedPRdata);
    yield take(LOAD_PULL_REQUEST.SUCCESS);
    yield spawn(fetchDiffByCompareSpecSaga);
    yield spawn(fetchDiffStatByCompareSpecSaga);
  } else {
    yield spawn(fetchPullRequest, { owner, slug, id });
    yield spawn(fetchDiffByPrIdSaga, owner, slug, id);
    yield spawn(fetchDiffStatByPrIdSaga, owner, slug, id);
  }

  yield spawn(fetchDestinationBranch, owner, slug);
}

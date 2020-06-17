import {
  call,
  delay,
  select,
  put,
  take,
  fork,
  cancel,
  cancelled,
  race,
  spawn,
} from 'redux-saga/effects';
import { Action } from 'redux';
import { PullRequestUpdatesResponse } from 'src/types/pull-request';
import { dismissFlag, showFlagComponent } from 'src/redux/flags';
import {
  PAGE_HIDDEN,
  PAGE_VISIBLE,
} from 'src/redux/global/actions/page-visibility';
import { prefetchCommits } from 'src/redux/pr-commits/sagas';
import { getPullRequestApis } from 'src/sagas/helpers';
import {
  POLLED_PULLREQUEST,
  EXITED_CODE_REVIEW,
  EnteredCodeReviewAction,
  RefreshCodeReviewDataOptions,
  UPDATE_PULL_REQUEST_LINKS,
  updatePullRequest,
} from '../actions';
import {
  getCurrentPullRequestUrlPieces,
  getLastPollTime,
  getUpdateNeeds,
  getCurrentPullRequest,
} from '../selectors';
import { backOffPoller } from '../utils/polling-delay-timer';
import { FETCH_ACTIVITY } from '../activity-reducer';
import fetchConflictsSaga from './fetch-conflicts-saga';
import { fetchDiffByCompareSpecSaga } from './fetch-diff-saga';
import { fetchDiffStatByCompareSpecSaga } from './fetch-diffstat-saga';
import { fetchPullRequest } from './fetch-pull-request-saga';
import { fetchPullRequestComments } from './fetch-pull-request-comments-saga';
import fetchBranchSyncInfoSaga from './branch-sync-info-saga';
import { retryFetchAllMergeChecksIfNeeded } from './fetch-merge-checks-saga';

export const INITIAL_INTERVAL = 20 * 1000;
export const PR_UPDATE_FLAG_ID = 'pull-request-updated';

const hasChanges = (response: PullRequestUpdatesResponse) =>
  response.anchorMoved ||
  // response.destRevMoved || // Ignored for now because of noisy amount of updates
  response.prDetailsModified ||
  response.approvalsAdded.length > 0 ||
  response.approvalsRemoved.length > 0 ||
  response.commentsAdded.length > 0 ||
  response.commentsDeleted.length > 0 ||
  response.commentsReplied.length > 0 ||
  response.commentsEdited.length > 0;

export function* getPullRequestUpdates(updatedOn: string) {
  const api = yield* getPullRequestApis();
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);

  const response: UnwrapPromise<typeof api.getUpdates> = yield call(
    api.getUpdates,
    owner,
    slug,
    id,
    updatedOn
  );

  if ('error' in response) {
    throw response.error;
  }

  if (hasChanges(response)) {
    yield put({
      type: POLLED_PULLREQUEST,
      payload: {
        lastModified: response.lastModified,
        needsPullRequest:
          response.prDetailsModified ||
          response.approvalsAdded.length > 0 ||
          response.approvalsRemoved.length > 0 ||
          response.anchorMoved,
        needsDiff: response.anchorMoved,
        needsComments:
          response.commentsAdded.length > 0 ||
          response.commentsDeleted.length > 0 ||
          response.commentsReplied.length > 0 ||
          response.commentsEdited.length > 0,
        links: response.links,
      },
    });

    yield put(showFlagComponent(PR_UPDATE_FLAG_ID));
  }
}

export function* pollPullRequestUpdates() {
  const { calculateDelay, cleanup: cleanupPoller } = backOffPoller(
    INITIAL_INTERVAL
  );

  while (true) {
    const updatedOn: ReturnType<typeof getLastPollTime> = yield select(
      getLastPollTime
    );

    if (!updatedOn) {
      yield delay(calculateDelay());
      continue;
    }

    try {
      yield call(getPullRequestUpdates, updatedOn);
    } catch (e) {
      // Unhandled currently, just delay and try again
    } finally {
      if (yield cancelled()) {
        cleanupPoller();
      }
    }

    yield delay(calculateDelay());
  }
}

// @ts-ignore TODO: fix noImplicitAny error here
export function* startingPollingForUpdates(_action: EnteredCodeReviewAction) {
  const pollingLoop = yield fork(pollPullRequestUpdates);
  const { pageWasHidden } = yield race({
    pageWasHidden: take(PAGE_HIDDEN),
    exitedPage: take(EXITED_CODE_REVIEW),
  });

  yield cancel(pollingLoop);

  if (pageWasHidden) {
    yield take(PAGE_VISIBLE);
    yield* startingPollingForUpdates({} as EnteredCodeReviewAction);
  }
}

export function* dismissUpdateFlag() {
  yield put(dismissFlag(PR_UPDATE_FLAG_ID));
}

export function* minimalUpdateSaga(
  action: Action & {
    payload: RefreshCodeReviewDataOptions;
  }
) {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const { needsDiff, needsComments, needsPullRequest, links } = action.payload;

  // This clears the existing activity feed and refetches from the beginning
  yield put({ type: FETCH_ACTIVITY.REQUEST });

  if (needsDiff) {
    yield spawn(fetchConflictsSaga, owner, slug, id);
    yield spawn(prefetchCommits, { owner, slug, id });

    if (links) {
      const pullRequest = yield select(getCurrentPullRequest);
      const updatedPullRequest = {
        ...pullRequest,
        links: {
          ...pullRequest.links,
          ...links,
        },
      };
      yield put(
        updatePullRequest(UPDATE_PULL_REQUEST_LINKS, updatedPullRequest)
      );
    }

    yield spawn(fetchDiffByCompareSpecSaga);
    yield spawn(fetchDiffStatByCompareSpecSaga);
    yield spawn(fetchBranchSyncInfoSaga, owner, slug, id);
  }

  if (needsComments) {
    yield spawn(fetchPullRequestComments);
  }

  if (needsPullRequest) {
    yield spawn(fetchPullRequest);
    yield spawn(retryFetchAllMergeChecksIfNeeded);
  }
}

export function* minimalUpdateFromPollResults() {
  const updateNeeds = yield select(getUpdateNeeds);
  yield spawn(minimalUpdateSaga, { type: 'IRRELEVANT', payload: updateNeeds });
}

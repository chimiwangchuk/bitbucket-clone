import { call, put, select, take, delay, race } from 'redux-saga/effects';
import authRequest, { jsonHeaders } from 'src/utils/fetch';

import { loadBranchingModel, getBranchingModel } from 'src/redux/branches';
import {
  updatePullRequest,
  EXITED_CODE_REVIEW,
} from 'src/redux/pull-request/actions';
import {
  FETCH_PULL_REQUEST_MERGE_STATUS,
  MERGE,
  closeDialog,
  setAsyncMergeInProgress,
  fetchPullRequestMergeStatus,
} from 'src/redux/pull-request/merge-reducer';
import {
  getCurrentPullRequest,
  getCurrentPullRequestUrlPieces,
  getDestinationBranchName,
} from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import { getIsMergePullRequestsAsyncEnabled } from 'src/selectors/feature-selectors';
import { getErrorMessage } from './utils/get-error-message';

export const PULL_REQUEST_MERGE_STATUS_POLLING_DELAY = 10000;

export enum MERGE_TASK_STATUSES {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
}

export function* pollPullRequestMergeStatus(pollingLink: string) {
  while (true) {
    yield delay(PULL_REQUEST_MERGE_STATUS_POLLING_DELAY);
    yield put(fetchPullRequestMergeStatus(pollingLink));
    const { success, error } = yield race({
      success: take(FETCH_PULL_REQUEST_MERGE_STATUS.SUCCESS),
      error: take(FETCH_PULL_REQUEST_MERGE_STATUS.ERROR),
    });

    if (error) {
      throw Error(error.payload);
    }
    const { payload: json } = success;
    if (json.task_status === MERGE_TASK_STATUSES.SUCCESS) {
      const { merge_result: pullRequest } = json;
      return pullRequest;
    }
  }
}

export function* getPullRequestJson(response: Response) {
  const isMergePullRequestAsyncEnabled = yield select(
    getIsMergePullRequestsAsyncEnabled
  );

  if (isMergePullRequestAsyncEnabled && response.status === 202) {
    const pullRequestMergeStatusPollingLink = response.headers.get('location');

    yield put(closeDialog());

    if (!pullRequestMergeStatusPollingLink) {
      return { json: null };
    }

    yield put(setAsyncMergeInProgress(true));

    try {
      return yield race({
        json: call(
          pollPullRequestMergeStatus,
          pullRequestMergeStatusPollingLink
        ),
        exitedCodeReview: take(EXITED_CODE_REVIEW),
      });
    } finally {
      yield put(setAsyncMergeInProgress(false));
    }
  } else {
    const json = yield response.json();

    return { json };
  }
}

function* mergePullRequestSaga() {
  while (true) {
    const { payload: mergeInfo } = yield take(MERGE.REQUEST);

    const { owner, slug: repoSlug, id: pullRequestId } = yield select(
      getCurrentPullRequestUrlPieces
    );

    const endpoint = urls.api.v20.merge({
      owner,
      repoSlug,
      pullRequestId,
    });

    try {
      const authWrapped = authRequest(endpoint, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({
          close_source_branch: mergeInfo.closeSourceBranch,
          message: mergeInfo.message,
          merge_strategy: mergeInfo.mergeStrategy,
        }),
      });

      const response = yield call(fetch, authWrapped);

      if (!response.ok) {
        const message = yield call(getErrorMessage, response.clone());

        throw Error(message);
      }

      const { json } = yield call(getPullRequestJson, response);

      // If json is falsey it means that the user has exited the code review page
      // or there is an error occured while the async merge polling was happening
      if (json) {
        const currentPullRequest = yield select(getCurrentPullRequest);
        const updatedPullRequest = {
          ...currentPullRequest,
          state: json.state,
          updated_on: json.updated_on,
          closed_by: json.closed_by,
          closed_on: json.closed_on,
          merge_commit: json.merge_commit,
        };

        yield put(updatePullRequest(MERGE.SUCCESS, updatedPullRequest));

        const destinationBranchName = yield select(getDestinationBranchName);
        const { development, production } = yield select(getBranchingModel);
        // @ts-ignore TODO: fix noImplicitAny error here
        const checkBranchName = branch => {
          return !!branch && branch.name === destinationBranchName;
        };

        // If the destination branch is the "development" or "production" branch
        // we need to referch the branching model in order to update the hashes to
        // the latest commit.
        if (checkBranchName(development) || checkBranchName(production)) {
          yield put(
            loadBranchingModel({
              repositoryOwner: owner,
              repositorySlug: repoSlug,
            })
          );
        }
      }
    } catch (e) {
      yield put({
        type: MERGE.ERROR,
        payload: e.message,
        error: true,
      });
    }
  }
}

export default mergePullRequestSaga;

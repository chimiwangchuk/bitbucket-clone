import { put, select, call, fork } from 'redux-saga/effects';
import { get } from 'lodash-es';

import {
  pullRequest as pullRequestSchema,
  commit as commitSchema,
} from 'src/redux/pull-request/schemas';
import { getPullRequestApis } from 'src/sagas/helpers';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import { UrlPieces } from 'src/types/pull-request';
import { fetchSourceRepositoryDetails } from '../actions/fetch-source-repository-details';
import { LOAD_PULL_REQUEST } from '../actions';

const makeBackbucketSafeNow = () => new Date().toISOString().replace(/Z/, '');

function* fetchSourceRepositoryDetailsSaga(sourceFullName: string) {
  yield put(fetchSourceRepositoryDetails(sourceFullName));
}

export function* completePullRequestUpdate(pullRequest: unknown) {
  if (pullRequest) {
    const sourceFullName = get(pullRequest, [
      'currentPullRequest',
      'source',
      'repository',
      'full_name',
    ]);
    const destinationFullName = get(pullRequest, [
      'currentPullRequest',
      'destination',
      'repository',
      'full_name',
    ]);

    if (sourceFullName && sourceFullName !== destinationFullName) {
      yield fork(fetchSourceRepositoryDetailsSaga, sourceFullName);
    }
  }

  yield put({
    type: LOAD_PULL_REQUEST.SUCCESS,
    payload: {
      ...(pullRequest as object),
      lastPoll: makeBackbucketSafeNow(),
    },
    meta: {
      schema: {
        currentPullRequest: pullRequestSchema,
        // Once we're 100% on commits api usage this can be removed
        commits: [commitSchema],
      },
    },
  });
}

export function* fetchPullRequest(urlPieces?: UrlPieces) {
  const api = yield* getPullRequestApis();
  // eslint-disable-next-line no-param-reassign
  urlPieces = urlPieces || (yield select(getCurrentPullRequestUrlPieces));

  if (!urlPieces) {
    return;
  }

  const { owner, slug, id } = urlPieces;
  try {
    const pullRequest = yield call(api.getPullRequest, owner, slug, id);
    yield call(completePullRequestUpdate, pullRequest);
  } catch (e) {
    yield put({
      type: LOAD_PULL_REQUEST.ERROR,
    });
  }
}

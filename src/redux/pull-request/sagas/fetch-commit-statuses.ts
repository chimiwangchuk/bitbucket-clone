import { select, call, put, take } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { getShowCommentsBuildsStatusesPullRequestPageEnabled } from 'src/selectors/feature-selectors';
import { getCurrentRepository } from 'src/selectors/repository-selectors';
import { UPDATE_COMMITS_STATUS } from 'src/redux/pr-commits/actions';
import { commit as commitSchema } from 'src/redux/pull-request/schemas';
import { getPullRequestCommitsState } from 'src/redux/pr-commits/selectors';
import { BuildStatusCountsMap } from 'src/types';
import { Commit } from 'src/components/types';
import { short12Hash } from 'src/utils/short-hash';
import urls from 'src/urls/commit';
import authRequest from 'src/utils/fetch';
import { LoadRepositoryPage } from 'src/sections/repository/actions';

export function createCommitStatusMapper(statuses: BuildStatusCountsMap) {
  return (commit: Commit) => {
    const status = statuses[short12Hash(commit.hash)];
    return {
      ...commit,
      extra: {
        ...commit.extra,
        builds: status ? [status.commit_status] : [],
        status_counts: status ? status.status_counts : undefined,
      },
    };
  };
}

export const createRequest = (
  fullName: string,
  // @ts-ignore TODO: fix noImplicitAny error here
  commits: { hash }[]
): Request => {
  const url = urls.api.internal.commitsBuildStatuses(fullName);

  return authRequest(url, {
    method: 'POST',
    body: commits.map(commit => `commits=${commit.hash}`).join('&'),
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
};

export function* fetchCommitsStatusesSaga() {
  const isShowCommentsBuildsStatusesPullRequestPageEnabled = yield select(
    getShowCommentsBuildsStatusesPullRequestPageEnabled
  );

  if (!isShowCommentsBuildsStatusesPullRequestPageEnabled) {
    return;
  }

  const { commits } = yield select(getPullRequestCommitsState);

  if (!commits.length) {
    return;
  }

  let repository = yield select(getCurrentRepository);

  if (!repository) {
    yield take(LoadRepositoryPage.SUCCESS);
    repository = yield select(getCurrentRepository);
  }

  const { full_name: fullName } = repository;

  try {
    const request = createRequest(fullName, commits);

    const response = yield call(fetch, request);

    if (response.ok) {
      const statuses = yield response.json();

      // Statuses is a dictionary mapping commit SHAs to statuses
      if (Object.keys(statuses).length === 0) {
        return;
      }

      const addStatus = createCommitStatusMapper(statuses);

      yield put({
        type: UPDATE_COMMITS_STATUS.SUCCESS,
        payload: commits.map(addStatus),
        meta: {
          schema: [commitSchema],
        },
      });
    }
  } catch (e) {
    Sentry.captureException(e);
  }
}

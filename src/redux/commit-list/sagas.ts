import { select, call, takeLatest, put, all } from 'redux-saga/effects';

import { getCurrentRepository } from 'src/selectors/repository-selectors';
import authRequest from 'src/utils/fetch';
import urls from 'src/urls/commit';
import { short12Hash } from 'src/utils/short-hash';
import { Commit } from 'src/components/types';
import { BuildStatusCountsMap } from 'src/types';

import { getCurrentCommits } from './selectors';
import { LoadCommits, UPDATE_COMMITS } from './';

function createCommitStatusMapper(statuses: BuildStatusCountsMap) {
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

export function* loadCommitStatusesSaga() {
  const commits = yield select(getCurrentCommits);

  if (!commits.length) {
    return;
  }

  const { full_name: fullName } = yield select(getCurrentRepository);
  const url = urls.api.internal.commitsBuildStatuses(fullName);

  try {
    const request = authRequest(url, {
      method: 'POST',
      // @ts-ignore TODO: fix noImplicitAny error here
      body: commits.map(commit => `commits=${commit.hash}`).join('&'),
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });

    const response = yield call(fetch, request);

    if (response.ok) {
      const statuses = yield response.json();

      if (Object.keys(statuses).length === 0) {
        return;
      }

      const addStatus = createCommitStatusMapper(statuses);

      yield put({
        type: UPDATE_COMMITS,
        payload: commits.map(addStatus),
      });
    }
  } catch (e) {
    // Silently fail for now
  }
}

export default function* commitListSagas() {
  yield all([takeLatest(LoadCommits.SUCCESS, loadCommitStatusesSaga)]);
}

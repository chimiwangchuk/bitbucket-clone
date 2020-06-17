import { select, call, put } from 'redux-saga/effects';

import { pullRequest } from 'src/redux/pull-request/schemas';
import { getCurrentRepository } from 'src/selectors/repository-selectors';
import authRequest from 'src/utils/fetch';
import urls from 'src/urls/commit';
import { short12Hash } from 'src/utils/short-hash';
import { BuildStatusCountsMap } from 'src/types';
import { PullRequest } from 'src/types/pull-requests-table';

import { getPullRequests } from '../selectors';

function createCommitStatusMapper(statuses: BuildStatusCountsMap) {
  return (pr: PullRequest) => {
    const status = statuses[short12Hash(pr.source.commit.hash)];
    return {
      ...pr,
      status_counts: status && status.status_counts,
    };
  };
}

export default function* loadPullRequestsStatuses() {
  const currentRepository = yield select(getCurrentRepository);
  const prs = yield select(getPullRequests);

  if (!prs.length || !currentRepository) {
    return;
  }

  const url = urls.api.internal.commitsBuildStatuses(
    currentRepository.full_name
  );

  try {
    const request = authRequest(url, {
      method: 'POST',
      // @ts-ignore TODO: fix noImplicitAny error here
      body: prs.map(pr => `commits=${pr.source.commit.hash}`).join('&'),
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
    const response = yield call(fetch, request);

    if (response.ok) {
      const statuses = yield response.json();
      // not using an action creator for this because no reducer uses this
      // information; we rely on the normalizr middleware
      yield put({
        type: 'pullRequestList/update-prs-with-build-status',
        payload: prs.map(createCommitStatusMapper(statuses)),
        meta: {
          schema: [pullRequest],
        },
      });
    }
  } catch (e) {
    // ah dang, too bad
  }
}

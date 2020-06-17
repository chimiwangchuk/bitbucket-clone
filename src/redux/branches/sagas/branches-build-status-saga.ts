import { select, call, put, all, take } from 'redux-saga/effects';

import { getCurrentRepositoryFullSlug } from 'src/selectors/repository-selectors';
import authRequest from 'src/utils/fetch';
import urls from 'src/urls/commit';
import { short12Hash } from 'src/utils/short-hash';
import { BuildStatusCountsMap } from 'src/types';
import { Branch } from 'src/components/types';
import { getAllBranches, getMainBranch } from '../selectors';
import { branch as branchSchema } from '../schemas';
import { LOAD_BRANCHES, LOAD_MAIN_BRANCH } from '../actions';

export function createCommitStatusMapper(statuses: BuildStatusCountsMap) {
  return (branch: Branch) => {
    const status = statuses[short12Hash(branch.target.hash)];
    return {
      ...branch,
      status_counts: status && status.status_counts,
    };
  };
}

export function* loadBranchesStatusWorker() {
  const allBranches = yield select(getAllBranches);
  const repoFullSlug = yield select(getCurrentRepositoryFullSlug);
  const url = urls.api.internal.commitsBuildStatuses(repoFullSlug);

  try {
    const request = authRequest(url, {
      method: 'POST',
      body: allBranches
        // @ts-ignore TODO: fix noImplicitAny error here
        .map(branch => `commits=${branch.target.hash}`)
        .join('&'),
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

      const updatedBranches = allBranches.map(
        createCommitStatusMapper(statuses)
      );

      // normalizr will handle this action
      yield put({
        type: 'branches/update-branches-with-build-status',
        payload: updatedBranches,
        meta: {
          schema: [branchSchema],
        },
      });
    }
  } catch (e) {
    // Silently fail for now
  }
}

export function* loadBranchesStatusWatcher() {
  while (true) {
    const mainBranch = yield select(getMainBranch);
    const actions = [LOAD_BRANCHES.SUCCESS];

    if (!mainBranch) {
      actions.push(LOAD_MAIN_BRANCH.SUCCESS);
    }

    yield all(actions.map(action => take(action)));
    yield* loadBranchesStatusWorker();
  }
}

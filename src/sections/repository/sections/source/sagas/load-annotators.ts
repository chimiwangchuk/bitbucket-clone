import { takeLatest, put, call } from 'redux-saga/effects';
import { AddonManager } from '@atlassian/bitbucket-connect-js';
import { Action } from 'src/types/state';
import { commitFileTarget } from 'src/connect/targets';
import { LoadAnnotators } from '../actions';

export type LoadAnnotatorsPayload = {
  path: string;
  hash: string;
  repositorySlug: string;
  repositoryOwnerUsername: string;
  repositoryOwnerUuid: string;
};

// Retrieves the list of Connect addons enabled for the current
// user that expose an "annotation" module.
async function loadAnnotatorModules(payload: LoadAnnotatorsPayload) {
  const {
    path,
    hash,
    repositorySlug,
    repositoryOwnerUsername,
    repositoryOwnerUuid,
  } = payload;

  const fileTarget = commitFileTarget({
    hash,
    path,
    repositoryOwner: repositoryOwnerUsername,
    repositorySlug,
  });
  const annotationModules = await AddonManager.getModules(repositoryOwnerUuid, {
    target: fileTarget,
    modules: [{ moduleType: 'annotators' }],
  });

  return annotationModules;
}

function* doLoadAnnotators({ payload }: Action) {
  const annotators = yield call(loadAnnotatorModules, payload);

  yield put({
    type: LoadAnnotators.SUCCESS,
    payload: annotators || [],
  });
}

export default function* loadAnnotators() {
  yield takeLatest(LoadAnnotators.REQUEST, doLoadAnnotators);
}

import { call, select } from 'redux-saga/effects';

import { updatePullRequestLastSeen } from 'src/utils/pull-requests/pull-request-activity';

import { getCurrentPullRequestId } from 'src/redux/pull-request/selectors';
import { getCurrentRepositoryFullSlug } from 'src/selectors/repository-selectors';

export function* updateLastSeenSaga() {
  const repositoryFullSlug = yield select(getCurrentRepositoryFullSlug);
  const pullRequestId = yield select(getCurrentPullRequestId);

  yield call(updatePullRequestLastSeen, repositoryFullSlug, pullRequestId);
}

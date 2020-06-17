import { select, call } from 'redux-saga/effects';
import { getCurrentUser } from 'src/selectors/user-selectors';
import prefs from 'src/utils/preferences';
import { getPullRequestsFilters } from 'src/redux/dashboard/selectors/pull-requests';

export default function* filterPullRequestSaga() {
  const user = yield select(getCurrentUser);
  const pullRequestFilters = yield select(getPullRequestsFilters);

  if (user) {
    yield call(
      prefs.set,
      user.uuid,
      'dashboard:pullRequests:filter',
      JSON.stringify(pullRequestFilters)
    );
  }
}

import { select, call } from 'redux-saga/effects';
import { getCurrentUser } from 'src/selectors/user-selectors';
import prefs from 'src/utils/preferences';
import { RepositorySort } from 'src/types/pull-requests-table';
import { SORT_OVERVIEW_REPOSITORIES } from '../actions';

export type SortRepositoriesAction = {
  type: typeof SORT_OVERVIEW_REPOSITORIES;
  payload: RepositorySort;
};

export default function* sortDashboardOverviewRepositoriesSaga({
  payload,
}: SortRepositoriesAction) {
  const user = yield select(getCurrentUser);

  if (user) {
    yield call(prefs.set, user.uuid, 'dashboard:repositories:sort', payload);
  }
}

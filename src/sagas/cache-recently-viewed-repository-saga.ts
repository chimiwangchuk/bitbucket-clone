import { call, select, take } from 'redux-saga/effects';

import { ADD_RECENTLY_VIEWED_REPOSITORY } from 'src/redux/recently-viewed-repositories';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { getRecentlyViewedRepositoriesKeys } from 'src/selectors/state-slicing-selectors';
import store from 'src/utils/recently-viewed-repositories-store';

function* cacheRecentlyViewedRepository() {
  while (true) {
    yield take(ADD_RECENTLY_VIEWED_REPOSITORY);
    const currentUser = yield select(getCurrentUser);

    if (!currentUser) {
      continue;
    }

    /**
     * By the time this saga runs, the reducer (src/reducers/recentlay-viewed-repositories.ts)
     * has already updated the data in redux to reflect the correct set of repositories based on
     * the `ADD_RECENTLY_VIEWED_REPOSITORY` action. That way the logic for adding/updating and the
     * source of truth are consolidated in one spot (the reducer).
     *
     * We retrieve the entity keys directly instead of denormalizing because we might have some in-flight
     * requests where the repository entity doesn't exist quite yet, and we don't want to remove
     * those from localstorage. Also it's a bit faster to skip denormalization.
     */
    const recentlyViewedRepositoryUuids = yield select(
      getRecentlyViewedRepositoriesKeys
    );

    yield call(store.set, currentUser, recentlyViewedRepositoryUuids);
  }
}

export default cacheRecentlyViewedRepository;

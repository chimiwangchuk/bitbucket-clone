import { call, select, take } from 'redux-saga/effects';

import { FetchRecentlyViewedRepository } from 'src/redux/recently-viewed-repositories';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { getRecentlyViewedRepositoriesKeys as getRecentlyViewedRepositoryUuids } from 'src/selectors/state-slicing-selectors';
import store from 'src/utils/recently-viewed-repositories-store';

function* removeRecentlyViewedRepository() {
  while (true) {
    const action = yield take(FetchRecentlyViewedRepository.ERROR);
    const currentUser = yield select(getCurrentUser);

    if (!currentUser) {
      continue;
    }

    const { status } = action.meta;
    if (status === 404 || status === 403) {
      /**
       * By the time this saga runs, the reducer (in `src/redux/recently-viewed-repositories/index.ts`) has already
       * updated the data in redux to reflect the correct set of repositories based on the
       * `FetchRecentlyViewedRepository.ERROR` action. That way the removal logic and the source of truth are
       * consolidated in one spot (the reducer)
       *
       * We retrieve the entity keys directly instead of denormalizing because we might have some in-flight
       * requests where the repository entity doesn't exist quite yet, and we don't want to remove
       * those from localstorage. Also it's a bit faster to skip denormalization.
       */
      const recentlyViewedRepositoryUuids = yield select(
        getRecentlyViewedRepositoryUuids
      );
      yield call(store.set, currentUser, recentlyViewedRepositoryUuids);
    }
  }
}

export default removeRecentlyViewedRepository;

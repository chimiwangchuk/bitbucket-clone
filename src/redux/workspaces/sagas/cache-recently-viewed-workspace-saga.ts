import { call, select, take } from 'redux-saga/effects';

import { getCurrentUser } from 'src/selectors/user-selectors';
import { getRecentlyViewedWorkspacesKeys } from 'src/selectors/state-slicing-selectors';
import store from 'src/utils/recently-viewed-workspaces-store';
import { ADD_RECENTLY_VIEWED_WORKSPACE } from 'src/redux/workspaces/actions/constants';

function* cacheRecentlyViewedWorkspace() {
  while (true) {
    yield take(ADD_RECENTLY_VIEWED_WORKSPACE);
    const currentUser = yield select(getCurrentUser);

    if (!currentUser) {
      continue;
    }

    /**
     * By the time this saga runs, the reducer (src/reducers/recently-viewed-workspaces.ts)
     * has already updated the data in redux to reflect the correct set of workspaces based on
     * the `ADD_RECENTLY_VIEWED_WORKSPACES` action. That way the logic for adding/updating and the
     * source of truth are consolidated in one spot (the reducer).
     *
     * We retrieve the entity keys directly instead of denormalizing because we might have some in-flight
     * requests where the workspace entity doesn't exist quite yet, and we don't want to remove
     * those from localstorage. Also it's a bit faster to skip denormalization.
     */
    const recentlyViewedWorkspaceUuids = yield select(
      getRecentlyViewedWorkspacesKeys
    );

    yield call(store.set, currentUser, recentlyViewedWorkspaceUuids);
  }
}

export default cacheRecentlyViewedWorkspace;

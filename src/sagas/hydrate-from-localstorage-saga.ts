import { all, call, put, select, take } from 'redux-saga/effects';

import { HYDRATE_FROM_LOCALSTORAGE } from 'src/redux/global/actions';
import {
  fetchRecentlyViewedRepositories,
  fetchRecentlyViewedRepository,
} from 'src/redux/recently-viewed-repositories';
import callFetch from 'src/sagas/call-fetch';
import { getCurrentUser } from 'src/selectors/user-selectors';
import repositoryStore from 'src/utils/recently-viewed-repositories-store';
import workspaceStore from 'src/utils/recently-viewed-workspaces-store';
import { GET_RECENTLY_VIEWED_WORKSPACES } from 'src/redux/workspaces/actions';

export function* hydrateRecentlyViewedRepositoriesSaga() {
  const currentUser = yield select(getCurrentUser);

  if (!currentUser) {
    return;
  }

  const cachedRepositoryUuids = yield call(repositoryStore.get, currentUser);

  if (!Array.isArray(cachedRepositoryUuids) || !cachedRepositoryUuids.length) {
    return;
  }

  const uniqueUuids = cachedRepositoryUuids.filter(
    (uuid, i, arr) => arr.indexOf(uuid) === i
  );

  const response = yield callFetch(
    fetchRecentlyViewedRepositories(uniqueUuids)
  );

  /**
   * Find all UUIDs requested that weren't in the response
   *
   * These UUIDs might represent:
   *   - Public repositories (not available via our initial fetch due to `?role=member)
   *   - Deleted repositories
   *   - Repositories to which authorization has been revoked
   *
   * By fetching them individually we can check to see which of the above is true,
   * and respond accordingly
   */
  if (!response.error) {
    const { requestedUuids } = response.meta.data;
    const { values: responseUuids } = response.payload.result;
    const uuidsToFetch = requestedUuids.filter(
      // @ts-ignore TODO: fix noImplicitAny error here
      uuid => !responseUuids.includes(uuid)
    );
    // @ts-ignore TODO: fix noImplicitAny error here
    const fetches = uuidsToFetch.map(uuid =>
      put(fetchRecentlyViewedRepository(uuid))
    );
    yield all(fetches);
  }
}

export function* hydrateRecentlyViewedWorkspacesSaga() {
  const currentUser = yield select(getCurrentUser);

  if (!currentUser) {
    return;
  }

  const cachedWorkspacesUuids = yield call(workspaceStore.get, currentUser);
  if (cachedWorkspacesUuids) {
    yield put({
      type: GET_RECENTLY_VIEWED_WORKSPACES,
      payload: cachedWorkspacesUuids,
    });
  }
}

export default function* hydrateFromLocalStorage() {
  yield take(HYDRATE_FROM_LOCALSTORAGE);
  yield all([
    hydrateRecentlyViewedWorkspacesSaga(),
    hydrateRecentlyViewedRepositoriesSaga(),
  ]);
}

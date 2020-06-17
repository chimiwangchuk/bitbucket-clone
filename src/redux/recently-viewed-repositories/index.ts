import qs from 'qs';

import { Repository } from 'src/components/types';
import { createAsyncAction, fetchAction, FetchAction } from 'src/redux/actions';
import { repository as repositorySchema } from 'src/sections/repository/schemas';
import urls from 'src/sections/repository/urls';
import createReducer from 'src/utils/create-reducer';

export const MAX_RECENTLY_VIEWED_REPOS = 10;

// Actions

export const ADD_RECENTLY_VIEWED_REPOSITORY =
  'repository/ADD_RECENTLY_VIEWED_REPOSITORY';

export const FetchRecentlyViewedRepositories = createAsyncAction(
  'repository/FETCH_RECENTLY_VIEWED_REPOSITORIES'
);
export const FetchRecentlyViewedRepository = createAsyncAction(
  'repository/FETCH_RECENTLY_VIEWED_REPOSITORY'
);

// Action Creators

export const addRecentlyViewedRepository = (repository: Repository) => ({
  type: ADD_RECENTLY_VIEWED_REPOSITORY,
  payload: repository,
  meta: {
    schema: repositorySchema,
  },
});

export const fetchRecentlyViewedRepositories = (
  repositoryUuids: string[]
): FetchAction => {
  const url = urls.api.v20.repositories();
  const bbql = repositoryUuids.map(uuid => `uuid = "${uuid}"`).join(' OR ');
  const queryParams = qs.stringify({ q: bbql, role: 'member' });

  return fetchAction(FetchRecentlyViewedRepositories, {
    url: `${url}?${queryParams}`,
    data: { requestedUuids: repositoryUuids },
    schema: { values: [repositorySchema] },
  });
};

export const fetchRecentlyViewedRepository = (uuid: string): FetchAction => {
  const url = urls.api.v20.repositoryByUuid(uuid);
  return fetchAction(FetchRecentlyViewedRepository, {
    url,
    data: { requestedUuid: uuid },
    schema: repositorySchema,
  });
};

// Reducer

export type RecentlyViewedRepositories = string[];

const initialState: RecentlyViewedRepositories = [];

export const reducer = createReducer(initialState, {
  [ADD_RECENTLY_VIEWED_REPOSITORY](state, action) {
    const repositoryId = action.payload.result;
    const idx = state.indexOf(repositoryId);

    if (idx === 0) {
      return state;
    }

    if (idx !== -1) {
      return [repositoryId, ...state.slice(0, idx), ...state.slice(idx + 1)];
    }

    return [repositoryId, ...state.slice(0, MAX_RECENTLY_VIEWED_REPOS - 1)];
  },

  // Proactively/Immediately update redux with the cached UUIDs from localstorage
  // to prevent race conditions that could override the data if the request is slow
  [FetchRecentlyViewedRepositories.REQUEST](state, action: FetchAction) {
    if (!action.meta.data || !action.meta.data.requestedUuids) {
      return state;
    }
    return [...action.meta.data.requestedUuids];
  },

  [FetchRecentlyViewedRepository.ERROR](state, action: FetchAction) {
    const { data, status } = action.meta;
    // If the repository has been deleted or is no longer accessible, remove it
    if (data && data.requestedUuid && (status === 404 || status === 403)) {
      return state.filter(uuid => uuid !== data.requestedUuid);
    }
    return state;
  },
});

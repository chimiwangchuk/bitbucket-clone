import createReducer from 'src/utils/create-reducer';
import {
  ADD_RECENTLY_VIEWED_WORKSPACE,
  GET_RECENTLY_VIEWED_WORKSPACES,
} from '../redux/workspaces/actions';

export const MAX_RECENTLY_VIEWED_WORKSPACES = 5;

export type RecentlyViewedWorkspaces = string[];

const initialState: RecentlyViewedWorkspaces = [];

export default createReducer(initialState, {
  [ADD_RECENTLY_VIEWED_WORKSPACE](state, action) {
    const workspaceId = action.payload.result;
    const idx = state.indexOf(workspaceId);

    if (idx === 0) {
      return state;
    }

    if (idx !== -1) {
      return [workspaceId, ...state.slice(0, idx), ...state.slice(idx + 1)];
    }

    return [workspaceId, ...state.slice(0, MAX_RECENTLY_VIEWED_WORKSPACES - 1)];
  },

  // Load cached UUIDs from localstorage
  [GET_RECENTLY_VIEWED_WORKSPACES](state, action) {
    if (!action.payload) {
      return state;
    }
    return [...action.payload];
  },
});

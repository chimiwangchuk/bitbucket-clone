import createReducer from 'src/utils/create-reducer';
import { LoadPullRequests, UnloadPullRequests } from '../actions';
import { PullRequestList } from '../types';

export const pullRequestListInitialState: PullRequestList = {
  listItems: [],
  nextUrl: null,
  isLoading: false,
  isError: false,
  isPreRequestState: true,
  reloadUrl: null,
  size: 0,
  pagelen: 0,
};

export default createReducer(pullRequestListInitialState, {
  [LoadPullRequests.REQUEST](state, action) {
    const reloadUrl = action.meta && action.meta.url ? action.meta.url : null;

    return {
      ...state,
      isLoading: true,
      isError: false,
      isPreRequestState: false,
      reloadUrl,
    };
  },

  [LoadPullRequests.ERROR](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },

  [LoadPullRequests.SUCCESS](state, action) {
    const { values, next, size, pagelen } = action.payload.result;

    return {
      ...state,
      listItems: [...values],
      nextUrl: next,
      isLoading: false,
      isError: false,
      pagelen,
      size,
    };
  },

  [UnloadPullRequests]() {
    return pullRequestListInitialState;
  },
});

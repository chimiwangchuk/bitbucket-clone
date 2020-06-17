import createReducer from 'src/utils/create-reducer';
import { LoadPullRequestAuthor, UpdatePreloadedAuthor } from '../actions';

import { PullRequestListPreloadedAuthor } from '../types';

export const initialPrAuthorState: PullRequestListPreloadedAuthor = {
  author: null,
  isLoading: false,
  isError: false,
};

export default createReducer(initialPrAuthorState, {
  [LoadPullRequestAuthor.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
      isError: false,
    };
  },
  [LoadPullRequestAuthor.SUCCESS](state, action) {
    return {
      ...state,
      author: action.payload,
      isLoading: false,
      isError: false,
    };
  },
  [LoadPullRequestAuthor.ERROR](state) {
    return {
      ...state,
      author: initialPrAuthorState.author,
      isLoading: false,
      isError: true,
    };
  },
  [UpdatePreloadedAuthor](state, action) {
    return {
      ...state,
      author: action.payload,
    };
  },
});

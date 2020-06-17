import createReducer from 'src/utils/create-reducer';
import { LoadPullRequestAuthors, ClearFilteredAuthors } from '../actions';

import { PullRequestListAuthors } from '../types';

export const initialPrAuthorsState: PullRequestListAuthors = {
  authors: [],
  filteredAuthors: [],
  isLoading: false,
  isError: false,
};

export default createReducer(initialPrAuthorsState, {
  [LoadPullRequestAuthors.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
      isError: false,
    };
  },
  [LoadPullRequestAuthors.SUCCESS](state, action) {
    if (action.meta && action.meta.data.query) {
      return {
        ...state,
        filteredAuthors: action.payload.values,
        isLoading: false,
        isError: false,
      };
    }
    return {
      ...state,
      authors: action.payload.values,
      isLoading: false,
      isError: false,
    };
  },
  [LoadPullRequestAuthors.ERROR](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },
  [ClearFilteredAuthors](state) {
    return {
      ...state,
      filteredAuthors: initialPrAuthorsState.filteredAuthors,
    };
  },
});

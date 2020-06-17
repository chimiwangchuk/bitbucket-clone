import createReducer from 'src/utils/create-reducer';
import { SearchResponse } from 'src/types/search';

import {
  RESET_SEARCH,
  FetchSearchResults,
  LoadSearchPage,
  OptInToBeta,
} from './actions';

export type SearchState = {
  accounts: string[];
  isLoading: boolean;
  isOptInLoading: boolean;
  optInFailed: boolean;
  response: SearchResponse;
};

const initialState: SearchState = {
  accounts: [],
  isLoading: false,
  isOptInLoading: false,
  optInFailed: false,
  response: null,
};

export default createReducer(initialState, {
  [LoadSearchPage.SUCCESS](state, action) {
    return {
      ...state,
      accounts: action.payload.result.accounts,
    };
  },

  [RESET_SEARCH](state) {
    return {
      ...state,
      isLoading: false,
      isOptInLoading: false,
      optInFailed: false,
      response: null,
    };
  },

  [FetchSearchResults.REQUEST](state) {
    return {
      ...state,
      response: null,
      isLoading: true,
    };
  },

  [FetchSearchResults.SUCCESS](state, action) {
    return {
      ...state,
      response: action.payload,
      isLoading: false,
    };
  },

  [FetchSearchResults.ERROR](state, action) {
    return {
      ...state,
      isLoading: false,
      response: action.meta,
    };
  },

  [OptInToBeta.REQUEST](state) {
    return {
      ...state,
      isOptInLoading: true,
      optInFailed: false,
    };
  },

  [OptInToBeta.SUCCESS](state) {
    return {
      ...state,
      isOptInLoading: false,
    };
  },

  [OptInToBeta.ERROR](state) {
    return {
      ...state,
      isOptInLoading: false,
      optInFailed: true,
    };
  },
});

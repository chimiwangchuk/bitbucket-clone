import createReducer from 'src/utils/create-reducer';
import { WatchPrefs } from '../types';

import {
  FetchRepositorySubscriptions,
  TOGGLE_SUBSCRIPTIONS_DIALOG,
} from '../actions';

export type RepositorySubscriptionsState = {
  hasError: boolean;
  isDialogOpen: boolean;
  isLoading: boolean;
  settings: WatchPrefs | null | undefined;
};

const initialState: RepositorySubscriptionsState = {
  hasError: false,
  isDialogOpen: false,
  isLoading: false,
  settings: null,
};

export default createReducer(initialState, {
  [FetchRepositorySubscriptions.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },
  [FetchRepositorySubscriptions.SUCCESS](state, action) {
    return {
      ...state,
      isLoading: false,
      settings: action.payload,
    };
  },
  [FetchRepositorySubscriptions.ERROR](state) {
    return {
      ...state,
      hasError: true,
      isLoading: false,
    };
  },
  [TOGGLE_SUBSCRIPTIONS_DIALOG](state, action) {
    if (action.payload === state.isDialogOpen) {
      return state;
    }

    return {
      ...state,
      isDialogOpen: action.payload,
    };
  },
});

import createReducer from 'src/utils/create-reducer';

import { FetchRepositories } from '../actions';

export type DashboardRepositoriesState = {
  isLoading: boolean;
  isError: boolean;
  isPreRequestState: boolean;
  repositories: object[];
  size: number;
  pagelen: number;
};

const initialState: DashboardRepositoriesState = {
  isLoading: false,
  isError: false,
  isPreRequestState: true,
  repositories: [],
  size: 0,
  pagelen: 0,
};

export default createReducer(initialState, {
  [FetchRepositories.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
      isError: false,
      isPreRequestState: false,
    };
  },

  [FetchRepositories.ERROR](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },

  [FetchRepositories.SUCCESS](state, action) {
    return {
      ...state,
      isLoading: false,
      repositories: action.payload.result.values,
      size: action.payload.result.size,
      pagelen: action.payload.result.pagelen,
    };
  },
});

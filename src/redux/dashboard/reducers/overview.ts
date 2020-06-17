import { RepositorySort } from 'src/types/pull-requests-table';
import createReducer from 'src/utils/create-reducer';
import { LoadDashboardOverview, SORT_OVERVIEW_REPOSITORIES } from '../actions';

export type DashboardOverviewState = {
  isLoading: boolean;
  isError: boolean;
  repositories: string[];
  repositoriesSortBy: RepositorySort | undefined;
};

const initialState: DashboardOverviewState = {
  isLoading: false,
  isError: false,
  repositories: [],
  repositoriesSortBy: undefined,
};

export default createReducer(initialState, {
  [LoadDashboardOverview.REQUEST](state) {
    return {
      ...state,
      repositories: [],
      isLoading: true,
    };
  },

  [LoadDashboardOverview.SUCCESS](state, action) {
    return {
      ...state,
      repositories: action.payload.result.repositories,
      repositoriesSortBy: action.payload.result.repositoriesSortBy,
      isLoading: false,
      isError: false,
    };
  },

  [LoadDashboardOverview.ERROR](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },

  [SORT_OVERVIEW_REPOSITORIES](state, action) {
    if (state.repositoriesSortBy === action.payload) {
      return state;
    }

    return {
      ...state,
      repositoriesSortBy: action.payload,
    };
  },
});

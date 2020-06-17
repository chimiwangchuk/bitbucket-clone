import createReducer from 'src/utils/create-reducer';

import { PullRequestSet } from 'src/types/pull-requests-table';

import {
  CLEAR_PULL_REQUEST_FILTERS,
  EXPAND_PULL_REQUESTS,
  FILTER_PULL_REQUESTS,
  LoadDashboardOverview,
} from '../actions';

export type DashboardPullRequestsState = {
  expandedPullRequestSets: PullRequestSet[];
  isLoading: boolean;
  pullRequestFilters: string[];
  pullRequests: {
    authored: string[];
    reviewing: string[];
  };
};

const initialState: DashboardPullRequestsState = {
  expandedPullRequestSets: [],
  isLoading: true,
  pullRequests: {
    authored: [],
    reviewing: [],
  },
  pullRequestFilters: [],
};

export default createReducer(initialState, {
  [CLEAR_PULL_REQUEST_FILTERS](state) {
    return {
      ...state,
      pullRequestFilters: [],
    };
  },

  [EXPAND_PULL_REQUESTS](state, action) {
    if (state.expandedPullRequestSets.indexOf(action.payload) !== -1) {
      return state;
    }

    return {
      ...state,
      expandedPullRequestSets: [
        ...state.expandedPullRequestSets,
        action.payload,
      ],
    };
  },

  [LoadDashboardOverview.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [LoadDashboardOverview.SUCCESS](state, action) {
    return {
      ...state,
      pullRequests: action.payload.result.pullRequests,
      pullRequestFilters: action.payload.result.pullRequestFilters,
      isLoading: false,
    };
  },

  [LoadDashboardOverview.ERROR](state) {
    return {
      ...state,
      isLoading: false,
    };
  },

  [FILTER_PULL_REQUESTS](state, action) {
    if (action.payload.state) {
      if (state.pullRequestFilters.indexOf(action.payload.filter) !== -1) {
        return state;
      }

      return {
        ...state,
        pullRequestFilters: [
          ...state.pullRequestFilters,
          action.payload.filter,
        ],
      };
    }

    if (state.pullRequestFilters.indexOf(action.payload.filter) === -1) {
      return state;
    }

    return {
      ...state,
      pullRequestFilters: state.pullRequestFilters.filter(
        f => f !== action.payload.filter
      ),
    };
  },
});

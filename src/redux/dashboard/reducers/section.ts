import { MenuItem } from '@atlassian/bitbucket-navigation';

import createReducer from 'src/utils/create-reducer';

import { LoadDashboard } from '../actions';

export type DashboardSectionState = {
  isLoading: boolean;
  menuItems: MenuItem[];
};

const initialState: DashboardSectionState = {
  isLoading: false,
  menuItems: [],
};

export default createReducer(initialState, {
  [LoadDashboard.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [LoadDashboard.SUCCESS](state, action) {
    return {
      ...state,
      ...action.payload,
      isLoading: false,
    };
  },

  [LoadDashboard.ERROR](state) {
    return {
      ...state,
      isLoading: false,
    };
  },
});

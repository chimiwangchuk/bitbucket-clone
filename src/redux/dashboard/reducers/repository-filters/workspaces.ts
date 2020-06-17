import createReducer from 'src/utils/create-reducer';
import {
  FetchWorkspaces,
  CLEAR_FILTERED_WORKSPACES,
  SELECT_WORKSPACE,
  FetchAndSelectWorkspace,
} from 'src/redux/dashboard/actions/fetch-repository-workspaces';
import { Workspace } from 'src/components/types';

export type WorkspacesFilterState = {
  isLoading: boolean;
  isError: boolean;
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
};

const initialState: WorkspacesFilterState = {
  isLoading: false,
  isError: false,
  workspaces: [],
  selectedWorkspace: null,
};

export default createReducer(initialState, {
  [FetchWorkspaces.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [FetchWorkspaces.ERROR](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },

  [FetchWorkspaces.SUCCESS](state, action) {
    return {
      ...state,
      isLoading: false,
      workspaces: action.payload.values,
    };
  },

  [CLEAR_FILTERED_WORKSPACES](state) {
    return {
      ...state,
      isLoading: false,
      workspaces: [],
    };
  },

  [FetchAndSelectWorkspace.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [FetchAndSelectWorkspace.ERROR](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },

  [FetchAndSelectWorkspace.SUCCESS](state, action) {
    const workspace: Workspace = action.payload;

    return {
      ...state,
      isLoading: false,
      selectedWorkspace: workspace,
    };
  },

  [SELECT_WORKSPACE](state, action) {
    return {
      ...state,
      selectedWorkspace: action.payload,
    };
  },
});

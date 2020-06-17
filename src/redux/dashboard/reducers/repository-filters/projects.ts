import createReducer from 'src/utils/create-reducer';

import {
  FetchProject,
  FetchProjects,
  SELECT_PROJECT,
  CLEAR_FILTERED_PROJECTS,
} from 'src/redux/dashboard/actions/fetch-projects';
import { Project } from 'src/components/types';

export type ProjectsFilterState = {
  isLoading: boolean;
  isError: boolean;
  data: Project[];
  filteredProjects: Project[];
  project: Project | null;
};

const initialState: ProjectsFilterState = {
  isLoading: false,
  isError: false,
  data: [],
  filteredProjects: [],
  project: null,
};

export default createReducer(initialState, {
  [FetchProjects.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [FetchProjects.ERROR](state) {
    return {
      ...state,
      isError: true,
      isLoading: false,
    };
  },

  [FetchProjects.SUCCESS](state, action) {
    if (action.meta && action.meta.data.filter) {
      return {
        ...state,
        isLoading: false,
        filteredProjects: action.payload.values,
      };
    }

    return {
      ...state,
      isLoading: false,
      data: action.payload.values,
    };
  },

  [FetchProject.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [FetchProject.ERROR](state) {
    return {
      ...state,
      isError: true,
      isLoading: false,
    };
  },

  [FetchProject.SUCCESS](state, action) {
    return {
      ...state,
      isLoading: false,
      project: action.payload.values[0],
    };
  },

  [SELECT_PROJECT](state, action) {
    return {
      ...state,
      isLoading: false,
      project: action.payload,
    };
  },

  [CLEAR_FILTERED_PROJECTS](state) {
    return {
      ...state,
      isLoading: false,
      filteredProjects: initialState.filteredProjects,
    };
  },
});

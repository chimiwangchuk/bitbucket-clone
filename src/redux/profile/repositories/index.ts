import createReducer from 'src/utils/create-reducer';
import { ProfileRepositoriesState } from 'src/redux/profile/repositories/types';
import {
  FetchProfileRepositories,
  PageUnload,
} from 'src/redux/profile/repositories/actions';

export const profileRepositoriesState: ProfileRepositoriesState = {
  listItems: [],
  nextUrl: null,
  isLoading: false,
  isError: false,
  isPreRequestState: true,
  size: 0,
  pagelen: 0,
};

export default createReducer(profileRepositoriesState, {
  [FetchProfileRepositories.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
      isPreRequestState: false,
    };
  },

  [FetchProfileRepositories.SUCCESS](state, action) {
    return {
      ...state,
      isLoading: false,
      listItems: action.payload.result.values,
      size: action.payload.result.size,
      pagelen: action.payload.result.pagelen,
    };
  },

  [FetchProfileRepositories.ERROR](state) {
    return {
      ...state,
      isError: true,
      isLoading: false,
    };
  },
  [PageUnload]() {
    return profileRepositoriesState;
  },
});

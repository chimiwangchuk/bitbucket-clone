import createReducer from 'src/utils/create-reducer';
import { ProfileRepositoriesLanguagesState } from 'src/redux/profile/repositories/types';
import { FetchProfileRepositoriesLanguages } from 'src/redux/profile/repositories/actions';

export const profileRepositoriesLanguagesState: ProfileRepositoriesLanguagesState = {
  languages: [],
  isLoading: false,
  isError: false,
};

export default createReducer(profileRepositoriesLanguagesState, {
  [FetchProfileRepositoriesLanguages.REQUEST](state) {
    return {
      ...state,
      isLoading: true,
    };
  },

  [FetchProfileRepositoriesLanguages.SUCCESS](state, action) {
    return {
      ...state,
      languages: action.payload,
      isLoading: false,
    };
  },

  [FetchProfileRepositoriesLanguages.ERROR](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },
});

import createReducer from 'src/utils/create-reducer';
import { ProfileSectionState } from './types';

import { LoadProfilePage } from './actions';

const initialState: ProfileSectionState = {
  menuItems: [],
  currentUser: undefined,
  currentWorkspace: undefined,
  activeMenuItem: '',
};

export default createReducer(initialState, {
  [LoadProfilePage.SUCCESS](state, action) {
    return { ...state, ...action.payload };
  },
});

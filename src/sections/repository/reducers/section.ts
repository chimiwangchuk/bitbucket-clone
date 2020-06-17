import { MenuItem, createNestedMenu } from '@atlassian/bitbucket-navigation';
import createReducer from 'src/utils/create-reducer';

import { Mirror } from '../types';

import {
  LoadRepositoryPage,
  TOGGLE_CLONE_DIALOG,
  TOGGLE_SYNC_DIALOG,
  UNLOAD_REPOSITORY,
  UPDATE_MENU_ITEMS,
  UPDATE_REPOSITORY_SECTION_MENU_ITEMS,
} from '../actions';

export type RepositorySectionState = {
  currentRepository: string | null | undefined;
  isCloneDialogOpen: boolean;
  isSyncDialogOpen: boolean;
  menuItems: MenuItem[];
  bitbucketActions: MenuItem[];
  importBitbucketActions: MenuItem[];
  connectActions: MenuItem[];
  mirrors: Mirror[] | null;
};

const initialState: RepositorySectionState = {
  currentRepository: null,
  isCloneDialogOpen: false,
  isSyncDialogOpen: false,
  menuItems: [],
  bitbucketActions: [],
  importBitbucketActions: [],
  connectActions: [],
  mirrors: null,
};

export default createReducer(initialState, {
  [LoadRepositoryPage.SUCCESS](state, action) {
    const { menuItems, ...result } = action.payload.result;
    return {
      ...state,
      ...result,
      menuItems: createNestedMenu(menuItems),
    };
  },

  [UNLOAD_REPOSITORY](state) {
    return { ...state, currentRepository: null, mirrors: null, menuItems: [] };
  },

  [UPDATE_MENU_ITEMS](state, action) {
    return { ...state, menuItems: createNestedMenu(action.payload) };
  },

  [UPDATE_REPOSITORY_SECTION_MENU_ITEMS](state, action) {
    return { ...state, menuItems: createNestedMenu(action.payload) };
  },

  [TOGGLE_CLONE_DIALOG](state, action) {
    return {
      ...state,
      isCloneDialogOpen: action.payload,
    };
  },

  [TOGGLE_SYNC_DIALOG](state, action) {
    if (action.payload === state.isSyncDialogOpen) {
      return state;
    }

    return {
      ...state,
      isSyncDialogOpen: action.payload,
    };
  },
});

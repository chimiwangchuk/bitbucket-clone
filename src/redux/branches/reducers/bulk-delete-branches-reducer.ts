import createReducer from 'src/utils/create-reducer';
import { DetailedBranch } from 'src/sections/repository/sections/branches/types';
import { Action } from 'src/types/state';
import {
  TOGGLE_BRANCH_SELECT,
  TOGGLE_SELECTION_MODE,
  BULK_DELETE_BRANCHES_DIALOG,
  BULK_DELETE_BRANCHES,
} from '../actions';

export enum LoadingStatus {
  Before = 'BEFORE',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Failed = 'FAILED',
}

export type BulkDeleteBranchesState = {
  selectedBranches: DetailedBranch[];
  isInSelectionMode: boolean;
  isBulkDeleteBranchesDialogOpen: boolean;
  bulkDeleteBranchesStatus: LoadingStatus;
};

export const initialState: BulkDeleteBranchesState = {
  selectedBranches: [],
  isInSelectionMode: false,
  isBulkDeleteBranchesDialogOpen: false,
  bulkDeleteBranchesStatus: LoadingStatus.Before,
};

export default createReducer(initialState, {
  [TOGGLE_BRANCH_SELECT.SAVE](
    state,
    { payload: selectedBranches }: Action<DetailedBranch[]>
  ) {
    return {
      ...state,
      selectedBranches: selectedBranches!,
    };
  },
  [TOGGLE_SELECTION_MODE](state, { payload: isSelected }: Action<boolean>) {
    return {
      ...state,
      isInSelectionMode: isSelected!,
      selectedBranches: isSelected! ? state.selectedBranches : [],
    };
  },
  [BULK_DELETE_BRANCHES_DIALOG.OPEN](state) {
    return {
      ...state,
      isBulkDeleteBranchesDialogOpen: true,
    };
  },
  [BULK_DELETE_BRANCHES_DIALOG.CLOSE](state) {
    return {
      ...state,
      isBulkDeleteBranchesDialogOpen: false,
    };
  },
  [BULK_DELETE_BRANCHES.REQUEST](state) {
    return {
      ...state,
      bulkDeleteBranchesStatus: LoadingStatus.Loading,
    };
  },
  [BULK_DELETE_BRANCHES.SUCCESS](state) {
    return {
      ...state,
      bulkDeleteBranchesStatus: LoadingStatus.Success,
    };
  },
  [BULK_DELETE_BRANCHES.ERROR](state) {
    return {
      ...state,
      bulkDeleteBranchesStatus: LoadingStatus.Failed,
    };
  },
});

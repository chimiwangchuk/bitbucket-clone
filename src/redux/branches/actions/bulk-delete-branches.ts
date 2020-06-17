import { createAsyncAction } from 'src/redux/actions';
import { DetailedBranch } from 'src/sections/repository/sections/branches/types';
import { prefixed } from './common';

export const TOGGLE_BRANCH_SELECT = {
  ONE: prefixed('TOGGLE_BRANCH_SELECT_ONE'),
  ALL_IN_PAGE: prefixed('TOGGLE_BRANCH_SELECT_ALL_IN_PAGE'),
  SAVE: prefixed('TOGGLE_BRANCH_SELECT_SAVE'),
};

export const onToggleBranchSelect = (payload: DetailedBranch) => ({
  type: TOGGLE_BRANCH_SELECT.ONE,
  payload,
});

export const onToggleBranchSelectAllInPage = (isSelected: boolean) => ({
  type: TOGGLE_BRANCH_SELECT.ALL_IN_PAGE,
  payload: isSelected,
});

export const onToggleBranchSelectSave = (branches: DetailedBranch[]) => ({
  type: TOGGLE_BRANCH_SELECT.SAVE,
  payload: branches,
});

export const clearSelectedBranches = () => ({
  type: TOGGLE_BRANCH_SELECT.SAVE,
  payload: [],
});

export const TOGGLE_SELECTION_MODE = prefixed('TOGGLE_SELECTION_MODE');

export const onToggleSelectionMode = (isSelected: boolean) => ({
  type: TOGGLE_SELECTION_MODE,
  payload: isSelected,
});

export const BULK_DELETE_BRANCHES_DIALOG = {
  OPEN: prefixed('BULK_DELETE_BRANCHES_DIALOG_OPEN'),
  CLOSE: prefixed('BULK_DELETE_BRANCHES_DIALOG_CLOSE'),
};

export const openBulkDeleteBranchesDialog = () => ({
  type: BULK_DELETE_BRANCHES_DIALOG.OPEN,
});

export const closeBulkDeleteBranchesDialog = () => ({
  type: BULK_DELETE_BRANCHES_DIALOG.CLOSE,
});

export const BULK_DELETE_BRANCHES = createAsyncAction(
  prefixed('BULK_DELETE_BRANCHES')
);
export const bulkDeleteBranches = () => ({
  type: BULK_DELETE_BRANCHES.REQUEST,
});

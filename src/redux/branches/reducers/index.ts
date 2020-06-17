import { combineReducers } from 'redux';

import branchListReducer, {
  initialState as branchListInitialState,
  BranchListState,
} from './branch-list-reducer';

import deleteBranchReducer, {
  initialState as deleteBranchDialogInitialState,
  DeleteBranchDialogState,
} from './delete-branch-reducer';

import compareBranchesReducer, {
  initialState as compareBranchesDialogInitialState,
  CompareBranchesDialogState,
} from './compare-branches-reducer';

import bulkDeleteBranchesReducer, {
  initialState as bulkDeleteBranchesInitialState,
  BulkDeleteBranchesState,
} from './bulk-delete-branches-reducer';

export type BranchesState = {
  branchList: BranchListState;
  deleteBranchDialog: DeleteBranchDialogState;
  compareBranchesDialog: CompareBranchesDialogState;
  bulkDeleteBranches: BulkDeleteBranchesState;
};

export const initialState = {
  branchList: branchListInitialState,
  deleteBranchDialog: deleteBranchDialogInitialState,
  compareBranchesDialog: compareBranchesDialogInitialState,
  bulkDeleteBranches: bulkDeleteBranchesInitialState,
};

export default combineReducers({
  branchList: branchListReducer,
  deleteBranchDialog: deleteBranchReducer,
  compareBranchesDialog: compareBranchesReducer,
  bulkDeleteBranches: bulkDeleteBranchesReducer,
});

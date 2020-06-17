import { createAsyncAction } from 'src/redux/actions';
import { DetailedBranch } from 'src/sections/repository/sections/branches/types';

import { prefixed } from './common';

export const DELETE_BRANCH_DIALOG = {
  OPEN: prefixed('OPEN_DELETE_BRANCH_DIALOG'),
  CLOSE: prefixed('CLOSE_DELETE_BRANCH_DIALOG'),
};

export const openDeleteBranchDialog = (branch: DetailedBranch) => ({
  type: DELETE_BRANCH_DIALOG.OPEN,
  payload: {
    branch,
  },
});

export const closeDeleteBranchDialog = () => ({
  type: DELETE_BRANCH_DIALOG.CLOSE,
});

export const DELETE_BRANCH = createAsyncAction(prefixed('DELETE_BRANCH'));
export const deleteBranch = () => ({
  type: DELETE_BRANCH.REQUEST,
});

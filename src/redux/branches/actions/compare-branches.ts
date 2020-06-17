import { createAsyncAction } from 'src/redux/actions';

import { MergeStrategy } from 'src/types/pull-request';
import { prefixed } from './common';

export type CompareBranchesOptions = {
  commitMessage: string;
  mergeStrategy?: MergeStrategy;
};

export type CompareBranchesAction = {
  type: string;
  payload: CompareBranchesOptions;
};

export const COMPARE_BRANCHES = createAsyncAction(prefixed('COMPARE_BRANCHES'));
export const compareBranches = (
  payload: CompareBranchesOptions
): CompareBranchesAction => ({
  type: COMPARE_BRANCHES.REQUEST,
  payload,
});

export type CompareBranchesPollStatusOptions = {
  url: string;
};

export type CompareBranchesPollStatusAction = {
  type: string;
  payload: CompareBranchesPollStatusOptions;
};

export const COMPARE_BRANCHES_POLL_STATUS = createAsyncAction(
  prefixed('COMPARE_BRANCHES_POLL_STATUS')
);
export const COMPARE_BRANCHES_POLL_STATUS_TIMEOUT =
  'COMPARE_BRANCHES_POLL_STATUS_TIMEOUT';
export const compareBranchesPollStatus = (
  payload: CompareBranchesPollStatusOptions
): CompareBranchesPollStatusAction => ({
  type: COMPARE_BRANCHES_POLL_STATUS.REQUEST,
  payload,
});

export const COMPARE_BRANCHES_DIALOG = {
  OPEN: prefixed('OPEN_COMPARE_BRANCHES_DIALOG'),
  CLOSE: prefixed('CLOSE_COMPARE_BRANCHES_DIALOG'),
};

export const closeCompareBranchesDialog = () => ({
  type: COMPARE_BRANCHES_DIALOG.CLOSE,
});

type BranchDialogOptions = {
  sourceBranchName: string;
  destinationBranchName: string;
  sourceRepositoryFullName?: string;
  destinationRepositoryFullName?: string;
  reloadAction?: { type: string };
};

export const openSyncBranchDialog = (options: BranchDialogOptions) => ({
  type: COMPARE_BRANCHES_DIALOG.OPEN,
  payload: {
    isMerge: false,
    ...options,
  },
});

export const openMergeBranchDialog = (options: BranchDialogOptions) => ({
  type: COMPARE_BRANCHES_DIALOG.OPEN,
  payload: {
    isMerge: true,
    ...options,
  },
});

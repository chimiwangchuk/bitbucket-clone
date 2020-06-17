import { createSelector, Selector } from 'reselect';
import { denormalize } from 'normalizr';
import { memoize } from 'lodash-es';
import { BucketState } from 'src/types/state';
import {
  getRepository,
  getEntities,
} from 'src/selectors/state-slicing-selectors';
import { getPagination } from 'src/utils/get-pagination';
import { DetailedBranch } from 'src/sections/repository/sections/branches/types';
import { BranchesState } from './reducers/index';
import {
  BranchingModelState,
  BranchListState,
} from './reducers/branch-list-reducer';
import { branch as branchSchema } from './schemas';

import { DeleteBranchDialogState } from './reducers/delete-branch-reducer';
import { CompareBranchesDialogState } from './reducers/compare-branches-reducer';
import { BulkDeleteBranchesState } from './reducers/bulk-delete-branches-reducer';

type BranchesSelector<T> = Selector<BucketState, T>;

export const getBranchesSlice: BranchesSelector<BranchesState> = createSelector(
  getRepository,
  ({ branches }) => branches
);

export const getBranchListSlice: BranchesSelector<BranchListState> = createSelector(
  getBranchesSlice,
  ({ branchList }) => branchList
);

export const getBulkDeleteBranchesSlice: BranchesSelector<BulkDeleteBranchesState> = createSelector(
  getBranchesSlice,
  ({ bulkDeleteBranches }) => bulkDeleteBranches
);

export const getBranches: BranchesSelector<DetailedBranch[]> = createSelector(
  getBranchListSlice,
  getEntities,
  ({ listItems }, entities) =>
    denormalize(listItems.branches, [branchSchema], entities)
);

export const getBranchingModel: BranchesSelector<BranchingModelState> = createSelector(
  getBranchListSlice,
  branches => branches.branchingModel
);

export const getIsBranchListLoading: BranchesSelector<boolean> = createSelector(
  getBranchListSlice,
  ({ listItems, mainBranch }) => listItems.isLoading || mainBranch.isLoading
);

export const getIsBranchListError: BranchesSelector<boolean> = createSelector(
  getBranchListSlice,
  ({ isError }) => isError
);

export const getBranchListReloadUrl: BranchesSelector<
  string | null | undefined
> = createSelector(getBranchListSlice, ({ listItems }) => listItems.reloadUrl);

export const getMainBranch: BranchesSelector<DetailedBranch> = createSelector(
  getBranchListSlice,
  getEntities,
  ({ mainBranch }, entities) =>
    denormalize(mainBranch.branch, branchSchema, entities)
);

export const getDeleteBranchDialogSlice: BranchesSelector<DeleteBranchDialogState> = createSelector(
  getBranchesSlice,
  ({ deleteBranchDialog }) => deleteBranchDialog
);

export const getCompareBranchesDialogSlice: BranchesSelector<CompareBranchesDialogState> = createSelector(
  getBranchesSlice,
  ({ compareBranchesDialog }) => compareBranchesDialog
);

export const getAllBranches: BranchesSelector<DetailedBranch[]> = createSelector(
  getBranches,
  getMainBranch,
  getIsBranchListLoading,
  (branches, mainBranch, isLoading) => {
    // Stop the main branch from rendering before
    // the other branches to prevent the connect
    // caching from breaking
    // The branches are passed into a <ConnectModules> component to pre-fetch the
    // modules so when the dropdown(s) are opened the web items are pulled from
    // cache instead of fetched on the spot (which would cause them render 200-500ms
    // after the dropdown is open). The main branch and the additional branches need
    // to be rendered at the same time, otherwise the modules won't be cached correctly.
    const allBranches =
      mainBranch && branches.length ? [mainBranch, ...branches] : [];

    // Still render the main branch if no other
    // branches are returned
    if (mainBranch && !branches.length && !isLoading) {
      allBranches.push(mainBranch);
    }

    return allBranches;
  }
);

export const getSelectedBranches: BranchesSelector<DetailedBranch[]> = createSelector(
  getBulkDeleteBranchesSlice,
  ({ selectedBranches }) => selectedBranches
);

export const getIsInSelectionMode: BranchesSelector<boolean> = createSelector(
  getBulkDeleteBranchesSlice,
  ({ isInSelectionMode }) => isInSelectionMode
);

const getBranchListSize = (state: BucketState) =>
  state.repository.branches.branchList.listItems.size;

const getBranchListLength = (state: BucketState) =>
  state.repository.branches.branchList.listItems.pageLength;

export const getBranchListTotalPages = createSelector(
  getBranchListSize,
  getBranchListLength,
  (size, pageLength) => (size && pageLength ? Math.ceil(size / pageLength) : 1)
);

// Using lodash memoize method because we get dynamic argument into our calculation function
// and we want to reduce redundant selector recalculation calls to minimum needed
export const getBranchesPagination = createSelector(
  getBranchListTotalPages,
  totalPages => memoize(getPagination(totalPages))
);

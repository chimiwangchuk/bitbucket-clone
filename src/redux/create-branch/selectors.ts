import { createSelector, Selector } from 'reselect';
import { BucketState } from 'src/types/state';
import {
  RefSelector,
  RepositorySelector,
  WorkflowBranches,
  SelectOption,
  RepositoryDetails,
} from 'src/sections/create-branch/types';
import { getRepoOwnerAndSlug } from 'src/sections/create-branch/utils';

export const getCreateBranchParams = (state: BucketState) =>
  state.createBranch.params;

export const getBranchTypesVisible = (state: BucketState) =>
  state.createBranch.branchTypeSelector.isVisible;

export const getSelectedRepoFullSlug = (state: BucketState) => {
  const { selected } = state.createBranch.repositorySelector;
  return selected ? selected.value : '';
};

export const getSelectedRepoOwnerAndSlug = (state: BucketState) => {
  const { selected } = state.createBranch.repositorySelector;
  return getRepoOwnerAndSlug(((selected as SelectOption) || {}).value);
};

export const getBranchTypes = (state: BucketState) => {
  return state.createBranch.branchTypeSelector.branchTypes;
};

export const getSelectedBranchType = (state: BucketState) => {
  return state.createBranch.branchTypeSelector.selected;
};

export const getJiraIssue = (state: BucketState) => {
  return state.createBranch.issue;
};

export const getRefSelectorState = (state: BucketState): RefSelector =>
  state.createBranch.refSelector;

export const getRepositorySelectorState: (
  state: BucketState
) => RepositorySelector = state => state.createBranch.repositorySelector;

export const getSelectedRepositoryDetails: Selector<
  BucketState,
  RepositoryDetails | null
> = createSelector(
  getRepositorySelectorState,
  (state: RepositorySelector) => state.selectedDetails
);

export const getSelectedRepositoryMainBranch = createSelector(
  getSelectedRepositoryDetails,
  details => (details ? details.mainbranch : null)
);

export const getWorkflowBranches = (state: BucketState): WorkflowBranches =>
  state.createBranch.workflowBranches;

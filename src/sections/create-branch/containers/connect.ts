import { connect } from 'react-redux';

import { getSiteMessageBanner } from 'src/selectors/global-selectors';
import {
  getCurrentRepositoryFullSlug,
  getRepositoryAccessLevel,
} from 'src/selectors/repository-selectors';
import {
  createBranch,
  changeBranchType,
  closeCreateBranchRepoDialog,
  openCreateBranchRepoDialog,
  closeCreateBranchGlobalDialog,
  openCreateBranchGlobalDialog,
  fetchCommitStatuses,
  onChangeRepository,
  setCurrentRepository,
  loadRepositories,
  changeFromBranch,
  changeNewBranchName,
  setJiraIssue,
} from 'src/redux/create-branch/actions';
import {
  getRefSelectorState,
  getRepositorySelectorState,
} from 'src/redux/create-branch/selectors';
import { BucketState } from 'src/types/state';
import {
  BranchType,
  CreateFromPayload,
  JiraIssue,
  Ref,
  SelectOption,
} from '../types';
import { LOADING_STATE } from '../constants';
import { generateBranchName } from '../utils';

const mapStateToProps = (state: BucketState) => {
  const {
    branchTypeSelector,
    isCreating,
    isRepoDialogOpen,
    isGlobalDialogOpen,
    params,
    refSelector,
    repositorySelector,
    error,
    workflowBranches,
  } = state.createBranch;
  const newBranchName = generateBranchName(
    params.name,
    branchTypeSelector.selected
  );
  // We are disabled when:
  //   1. LOADING: branch type, branches or repositories
  //   2. ERROR: branches or repositories. When branch type is in error we just hide the type
  //          but let the user submit without the types.
  //   3. There is no new branch name.
  //   4. There is no target branch.
  const isDisabled =
    refSelector.loadingState !== LOADING_STATE.SUCCESS ||
    repositorySelector.loadingState !== LOADING_STATE.SUCCESS ||
    branchTypeSelector.loadingState === LOADING_STATE.LOADING ||
    !newBranchName ||
    !(params.target && params.target.hash);

  return {
    branchTypeSelector,
    isRepoDialogOpen,
    isGlobalDialogOpen,
    isCreating,
    isDisabled,
    createParams: params,
    refSelector: getRefSelectorState(state),
    repositorySelector: getRepositorySelectorState(state),
    repositoryFullSlug: getCurrentRepositoryFullSlug(state),
    isBannerOpen: Boolean(getSiteMessageBanner(state)),
    newBranchName,
    error,
    workflowBranches,
    userLevel: getRepositoryAccessLevel(state),
    focusedTaskBackButtonUrl: state.global.focusedTaskBackButtonUrl,
  };
};

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  openCreateBranchRepoDialog: () => dispatch(openCreateBranchRepoDialog()),
  openCreateBranchGlobalDialog: () => dispatch(openCreateBranchGlobalDialog()),
  closeCreateBranchRepoDialog: () => dispatch(closeCreateBranchRepoDialog()),
  closeCreateBranchGlobalDialog: () =>
    dispatch(closeCreateBranchGlobalDialog()),
  onChangeBranchType: (payload: BranchType) =>
    dispatch(changeBranchType(payload)),
  onChangeFromBranch: (branch: Ref) => dispatch(changeFromBranch(branch)),
  onChangeNewBranchName: (name: string) => dispatch(changeNewBranchName(name)),
  onCreate: (payload: CreateFromPayload) => dispatch(createBranch(payload)),
  onFetchCommitStatuses: () => dispatch(fetchCommitStatuses()),
  onChangeRepository: (payload: SelectOption) =>
    dispatch(onChangeRepository(payload)),
  setCurrentRepository: () => dispatch(setCurrentRepository()),
  loadRepositories: () => dispatch(loadRepositories()),
  setJiraIssue: (jiraIssue: JiraIssue | null) => {
    if (jiraIssue) {
      dispatch(setJiraIssue(jiraIssue));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps);

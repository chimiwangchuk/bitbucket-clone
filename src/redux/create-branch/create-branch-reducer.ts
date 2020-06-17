import createReducer from 'src/utils/create-reducer';
import { BRANCH_KIND } from 'src/constants/branching-model';
import {
  EXTENDED_BRANCH_KINDS,
  BRANCH_TYPE_OTHER,
  LOADING_STATE,
  AllBranchTypes,
} from 'src/sections/create-branch/constants';
import {
  BranchType,
  CreateBranchState,
} from 'src/sections/create-branch/types';
import {
  branchTypeFromIssue,
  generateBranchNameFromIssue,
} from 'src/sections/create-branch/jira';
import { getRefOption } from 'src/sections/create-branch/utils';
import {
  ChangeBranchFromAction,
  ChangeBranchTypeAction,
  ChangeNewBranchNameAction,
  ChangeRepositoryAction,
  FetchBranchingModelSuccessAction,
  FetchRefOptionsSuccessAction,
  FetchCommitStatusesSuccessAction,
  SetJiraIssueAction,
  SetSuggestedFromBranchAction,
  CHANGE_BRANCH_TYPE,
  CHANGE_FROM_BRANCH,
  CHANGE_NEW_BRANCH_NAME,
  CHANGE_REPOSITORY,
  CREATE_BRANCH,
  CREATE_BRANCH_REPO_DIALOG,
  CREATE_BRANCH_GLOBAL_DIALOG,
  FETCH_BRANCHING_MODEL,
  FETCH_REF_OPTIONS,
  FETCH_COMMIT_STATUSES,
  LOAD_REPOSITORIES,
  SET_CURRENT_REPOSITORY,
  SET_JIRA_ISSUE,
  SET_SUGGESTED_FROM_BRANCH,
  SHOW_CREATE_BRANCH_SUCCESS_FLAG,
  LOAD_REPOSITORY,
} from './actions';

const findTypeByKind = (
  branchTypes: BranchType[],
  kind: AllBranchTypes
): BranchType | null => {
  if (kind === EXTENDED_BRANCH_KINDS.OTHER) {
    return BRANCH_TYPE_OTHER;
  }

  return branchTypes.find(type => type.kind === kind) || null;
};

export const initialState: CreateBranchState = {
  isGlobalDialogOpen: false,
  isRepoDialogOpen: false,
  isCreating: false,
  error: null,
  params: {
    name: '',
    target: null,
  },
  refSelector: {
    loadingState: LOADING_STATE.LOADING,
    refs: [],
    hasMoreRefs: false,
    suggestedRef: null,
    selected: null,
    selectedByUser: false,
    selectedCommitStatuses: [],
  },
  workflowBranches: {
    main: null,
    development: null,
    production: null,
  },
  branchTypeSelector: {
    loadingState: LOADING_STATE.LOADING,
    isVisible: false,
    branchTypes: [],
    selected: null,
  },
  successFlag: {
    branch: null,
  },
  repositorySelector: {
    loadingState: LOADING_STATE.LOADING,
    repositories: [],
    selected: null,
    selectedDetails: null,
  },
};

export default createReducer(initialState, {
  [CREATE_BRANCH_REPO_DIALOG.OPEN](
    state: CreateBranchState
  ): CreateBranchState {
    return {
      ...state,
      isGlobalDialogOpen: false,
      isRepoDialogOpen: true,
    };
  },
  [CREATE_BRANCH_REPO_DIALOG.CLOSE]() {
    return {
      isRepoDialogOpen: false,
      // Reset the state when the modal closes, so that it won't display anything
      // from the previous open state, next time the modal opens.
      ...initialState,
    };
  },
  [CREATE_BRANCH_GLOBAL_DIALOG.OPEN](
    state: CreateBranchState
  ): CreateBranchState {
    return {
      ...state,
      isGlobalDialogOpen: true,
      isRepoDialogOpen: false,
    };
  },
  [CREATE_BRANCH_GLOBAL_DIALOG.CLOSE]() {
    return {
      isGlobalDialogOpen: false,
      // Reset the state when the modal closes, so that it won't display anything
      // from the previous open state, next time the modal opens.
      ...initialState,
    };
  },
  [FETCH_REF_OPTIONS.REQUEST](state: CreateBranchState) {
    return {
      ...state,
      refSelector: {
        ...state.refSelector,
        refs: [],
        hasMoreRefs: false,
        loadingState: LOADING_STATE.LOADING,
      },
    };
  },
  [FETCH_REF_OPTIONS.SUCCESS](
    state: CreateBranchState,
    action: FetchRefOptionsSuccessAction
  ): CreateBranchState {
    const { refs, mainRef, hasMoreRefs } = action.payload;

    return {
      ...state,
      refSelector: {
        ...state.refSelector,
        refs,
        hasMoreRefs,
        loadingState: LOADING_STATE.SUCCESS,
      },
      workflowBranches: {
        ...state.workflowBranches,
        main: mainRef,
      },
    };
  },
  [FETCH_REF_OPTIONS.ERROR](state: CreateBranchState): CreateBranchState {
    return {
      ...state,
      refSelector: {
        ...state.refSelector,
        loadingState: LOADING_STATE.ERROR,
      },
    };
  },
  [FETCH_COMMIT_STATUSES.SUCCESS](
    state: CreateBranchState,
    action: FetchCommitStatusesSuccessAction
  ): CreateBranchState {
    return {
      ...state,
      refSelector: {
        ...state.refSelector,
        // @ts-ignore
        selectedCommitStatuses: action.payload,
      },
    };
  },
  [FETCH_COMMIT_STATUSES.ERROR](state: CreateBranchState): CreateBranchState {
    return {
      ...state,
      refSelector: {
        ...state.refSelector,
        selectedCommitStatuses: [],
      },
    };
  },
  [FETCH_BRANCHING_MODEL.REQUEST](state: CreateBranchState): CreateBranchState {
    return {
      ...state,
      branchTypeSelector: {
        ...state.branchTypeSelector,
        branchTypes: [],
        loadingState: LOADING_STATE.LOADING,
      },
    };
  },
  [FETCH_BRANCHING_MODEL.SUCCESS](
    state: CreateBranchState,
    action: FetchBranchingModelSuccessAction
  ): CreateBranchState {
    const { development, production, branchTypes } = action.payload;

    const previousSelectedBranchType = state.branchTypeSelector.selected;
    const previousSelectedKind =
      previousSelectedBranchType && previousSelectedBranchType.kind;
    let selectedBranchType: BranchType | null;

    selectedBranchType = previousSelectedKind
      ? findTypeByKind(branchTypes, previousSelectedKind)
      : null;

    if (!selectedBranchType && state.issue) {
      const isBugfixEnabled = Boolean(
        branchTypes.find(br => br.kind === BRANCH_KIND.BUG_FIX)
      );
      const kind = branchTypeFromIssue(state.issue, isBugfixEnabled);
      if (kind !== EXTENDED_BRANCH_KINDS.OTHER) {
        selectedBranchType = findTypeByKind(branchTypes, kind);
      }
    }

    const hasBranchTypes = branchTypes.length > 0;
    if (!selectedBranchType && hasBranchTypes) {
      selectedBranchType = BRANCH_TYPE_OTHER;
    }

    return {
      ...state,
      branchTypeSelector: {
        branchTypes,
        loadingState: LOADING_STATE.SUCCESS,
        isVisible: hasBranchTypes,
        selected: selectedBranchType,
      },
      workflowBranches: {
        ...state.workflowBranches,
        development,
        production,
      },
    };
  },
  [FETCH_BRANCHING_MODEL.ERROR](state: CreateBranchState): CreateBranchState {
    return {
      ...state,
      branchTypeSelector: {
        ...state.branchTypeSelector,
        isVisible: false,
        loadingState: LOADING_STATE.ERROR,
        selected: null,
      },
    };
  },
  [SET_SUGGESTED_FROM_BRANCH](
    state: CreateBranchState,
    action: SetSuggestedFromBranchAction
  ): CreateBranchState {
    return {
      ...state,
      refSelector: {
        ...state.refSelector,
        suggestedRef: action.payload,
      },
    };
  },
  [CHANGE_FROM_BRANCH](
    state: CreateBranchState,
    action: ChangeBranchFromAction
  ): CreateBranchState {
    const { ref, selectedByUser } = action.payload;
    return {
      ...state,
      refSelector: {
        ...state.refSelector,
        selected: getRefOption(ref),
        selectedByUser,
      },
      params: {
        ...state.params,
        target: ref,
      },
    };
  },
  [CHANGE_NEW_BRANCH_NAME](
    state: CreateBranchState,
    action: ChangeNewBranchNameAction
  ): CreateBranchState {
    return {
      ...state,
      params: {
        ...state.params,
        name: action.payload,
      },
      error: null,
    };
  },
  [CHANGE_BRANCH_TYPE](
    state: CreateBranchState,
    action: ChangeBranchTypeAction
  ): CreateBranchState {
    return {
      ...state,
      branchTypeSelector: {
        ...state.branchTypeSelector,
        selected: action.payload,
      },
      error: null,
    };
  },
  [CREATE_BRANCH.REQUEST](state: CreateBranchState): CreateBranchState {
    return {
      ...state,
      isCreating: true,
      error: null,
    };
  },
  [CREATE_BRANCH.SUCCESS](state: CreateBranchState): CreateBranchState {
    return {
      ...state,
      isCreating: false,
    };
  },
  [CREATE_BRANCH.ERROR](state: CreateBranchState, action): CreateBranchState {
    return {
      ...state,
      isCreating: false,
      error: action.payload,
    };
  },
  [SHOW_CREATE_BRANCH_SUCCESS_FLAG](
    state: CreateBranchState,
    action
  ): CreateBranchState {
    return {
      ...state,
      successFlag: {
        branch: action.payload,
      },
    };
  },
  [CHANGE_REPOSITORY](
    state: CreateBranchState,
    action: ChangeRepositoryAction
  ): CreateBranchState {
    return {
      ...state,
      repositorySelector: {
        ...state.repositorySelector,
        selected: action.payload.selected,
      },
      branchTypeSelector: {
        // When user switches the repository we need to clear some elements
        // which are irrelevant after the switch, such as "branch from" name
        // and hash as well as active branching model. However, we need to keep
        // the branch type that user might've selected before switching the repo
        // until its branching model is fetched to then pre-select the same
        // branch type if it is configured for the new repo.
        // Hence, we don't override `selected` property.
        // This is to avoid flickering in the UI, we also need to keep `isVisible`
        // property to continue showing/hiding the branch type selector until
        // the new branching model is fetched.
        ...state.branchTypeSelector,
        branchTypes: [],
      },
      params: {
        ...state.params,
        target: null,
      },
      error: null,
      workflowBranches: {
        main: null,
        development: null,
        production: null,
      },
      refSelector: {
        ...state.refSelector,
        refs: [],
        hasMoreRefs: false,
        suggestedRef: null,
        selected: null,
        selectedByUser: false,
        selectedCommitStatuses: [],
      },
    };
  },
  [SET_CURRENT_REPOSITORY](state: CreateBranchState): CreateBranchState {
    // This is called in the dialog and on the repo page when we only have
    // one repository. We never trigger a repository load in this case so
    // we the state to SUCCESS to ensure we can create branches.
    return {
      ...state,
      repositorySelector: {
        ...state.repositorySelector,
        loadingState: LOADING_STATE.SUCCESS,
      },
    };
  },
  [LOAD_REPOSITORIES.REQUEST](state: CreateBranchState): CreateBranchState {
    return {
      ...state,
      repositorySelector: {
        loadingState: LOADING_STATE.LOADING,
        repositories: [],
        selected: null,
        selectedDetails: null,
      },
    };
  },
  [LOAD_REPOSITORIES.SUCCESS](
    state: CreateBranchState,
    action
  ): CreateBranchState {
    const repos = action.payload.repositories || [];
    return {
      ...state,
      repositorySelector: {
        loadingState: LOADING_STATE.SUCCESS,
        // @ts-ignore TODO: fix noImplicitAny error here
        repositories: repos.map(({ full_name: fullName }) => ({
          label: fullName,
          value: fullName,
        })),
        selected: null,
        selectedDetails: null,
      },
      branchTypeSelector: {
        ...state.branchTypeSelector,
        // Set the loading state to 'success' if there are no repos
        // to hide the loading icon on the ref selector
        loadingState:
          repos.length === 0
            ? LOADING_STATE.SUCCESS
            : state.branchTypeSelector.loadingState,
      },
      refSelector: {
        ...state.refSelector,
        // Set the loading state to 'success' if there are no repos
        // to hide the loading icon on the ref selector
        loadingState:
          repos.length === 0
            ? LOADING_STATE.SUCCESS
            : state.refSelector.loadingState,
      },
    };
  },
  [LOAD_REPOSITORIES.ERROR](state: CreateBranchState): CreateBranchState {
    return {
      ...state,
      repositorySelector: {
        ...state.repositorySelector,
        loadingState: LOADING_STATE.ERROR,
      },
      branchTypeSelector: {
        ...state.branchTypeSelector,
        isVisible: false,
        loadingState: LOADING_STATE.ERROR,
      },
      refSelector: {
        ...state.refSelector,
        loadingState: LOADING_STATE.ERROR,
      },
    };
  },
  [LOAD_REPOSITORY.SUCCESS](
    state: CreateBranchState,
    action
  ): CreateBranchState {
    return {
      ...state,
      repositorySelector: {
        ...state.repositorySelector,
        selectedDetails: action.payload,
      },
    };
  },
  [SET_JIRA_ISSUE](
    state: CreateBranchState,
    action: SetJiraIssueAction
  ): CreateBranchState {
    const { params } = state;
    const issue = action.payload;

    return {
      ...state,
      issue,
      params: {
        ...params,
        name: params.name || generateBranchNameFromIssue(issue),
      },
    };
  },
});

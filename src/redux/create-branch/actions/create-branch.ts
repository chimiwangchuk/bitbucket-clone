import { stringify } from 'qs';
import { BuildStatus } from 'src/components/types';
import {
  createAsyncAction,
  hydrateAction,
  fetchAction,
} from 'src/redux/actions';
import repoUrls from 'src/sections/repository/urls';

import {
  BranchType,
  CreateFromPayload,
  JiraIssue,
  Ref,
  RefSelectorGroup,
  SelectOption,
} from 'src/sections/create-branch/types';

const prefixed = (action: string) => `create-branch/${action}`;

export const LOAD_REPOSITORY = createAsyncAction(prefixed('LOAD_REPOSITORY'));
export const loadRepository = (owner: string, slug: string) => {
  const fields = [
    '*',
    'mainbranch.type',
    'mainbranch.name',
    'mainbranch.target.hash',
    '-project',
    '-owner',
  ];
  const qs = stringify({ fields: fields.join(',') }, { indices: false });
  const url = `${repoUrls.api.v20.repository(owner, slug)}?${qs}`;
  return fetchAction(LOAD_REPOSITORY, {
    url,
  });
};

export const LOAD_REPOSITORIES = createAsyncAction(
  prefixed('LOAD_REPOSITORIES')
);
export const loadRepositories = () =>
  hydrateAction(LOAD_REPOSITORIES, 'createBranch', {
    url: '/branch/create',
  });

export const CREATE_BRANCH_REPO_DIALOG = {
  OPEN: prefixed('OPEN_CREATE_BRANCH_REPO_DIALOG'),
  CLOSE: prefixed('CLOSE_CREATE_BRANCH_REPO_DIALOG'),
};

export const CREATE_BRANCH_GLOBAL_DIALOG = {
  OPEN: prefixed('OPEN_CREATE_BRANCH_GLOBAL_DIALOG'),
  CLOSE: prefixed('CLOSE_CREATE_BRANCH_GLOBAL_DIALOG'),
};

export const openCreateBranchRepoDialog = () => ({
  type: CREATE_BRANCH_REPO_DIALOG.OPEN,
});

export const closeCreateBranchRepoDialog = () => ({
  type: CREATE_BRANCH_REPO_DIALOG.CLOSE,
});

export const openCreateBranchGlobalDialog = () => ({
  type: CREATE_BRANCH_GLOBAL_DIALOG.OPEN,
});

export const closeCreateBranchGlobalDialog = () => ({
  type: CREATE_BRANCH_GLOBAL_DIALOG.CLOSE,
});

export type FetchRefOptionsSuccessAction = {
  type: string;
  payload: {
    mainRef: Ref | null | undefined;
    refs: RefSelectorGroup[];
    hasMoreRefs: boolean;
  };
};
export const FETCH_REF_OPTIONS = createAsyncAction(
  prefixed('FETCH_REF_OPTIONS')
);

export type FetchRefOptionsPayload = {
  search?: string;
};

export type FetchRefOptionsAction = {
  type: string;
  payload: FetchRefOptionsPayload;
};

export const fetchRefOptions = (payload: FetchRefOptionsPayload = {}) => ({
  type: FETCH_REF_OPTIONS.REQUEST,
  payload,
});

export type FetchCommitStatusesSuccessAction = {
  type: string;
  payload: {
    statuses: BuildStatus[];
  };
};
export const FETCH_COMMIT_STATUSES = createAsyncAction(
  prefixed('FETCH_COMMIT_STATUSES')
);
export const fetchCommitStatuses = () => ({
  type: FETCH_COMMIT_STATUSES.REQUEST,
});

export type FetchBranchingModelSuccessAction = {
  type: string;
  payload: {
    development: Ref;
    production: Ref | null;
    branchTypes: BranchType[];
  };
};

export const FETCH_BRANCHING_MODEL = createAsyncAction(
  prefixed('FETCH_BRANCHING_MODEL')
);
export const fetchBranchingModel = () => ({
  type: FETCH_BRANCHING_MODEL.REQUEST,
});

export type SetSuggestedFromBranchAction = {
  type: string;
  payload: Ref;
};
export const SET_SUGGESTED_FROM_BRANCH = prefixed('SET_SUGGESTED_FROM_BRANCH');
export const setSuggestedFromBranch = (
  branch: Ref
): SetSuggestedFromBranchAction => ({
  type: SET_SUGGESTED_FROM_BRANCH,
  payload: branch,
});

export type ChangeBranchFromAction = {
  type: string;
  payload: {
    ref: Ref;
    selectedByUser: boolean;
  };
};
export const CHANGE_FROM_BRANCH = prefixed('CHANGE_FROM_BRANCH');
export const changeFromBranch = (
  ref: Ref,
  selectedByUser = true
): ChangeBranchFromAction => ({
  type: CHANGE_FROM_BRANCH,
  payload: {
    ref,
    selectedByUser,
  },
});

export type ChangeNewBranchNameAction = {
  type: string;
  payload: string;
};
export const CHANGE_NEW_BRANCH_NAME = prefixed('CHANGE_NEW_BRANCH_NAME');
export const changeNewBranchName = (
  name: string
): ChangeNewBranchNameAction => ({
  type: CHANGE_NEW_BRANCH_NAME,
  payload: name,
});

export const CREATE_BRANCH = createAsyncAction(prefixed('CREATE_BRANCH'));
export const createBranch = (payload: CreateFromPayload) => ({
  type: CREATE_BRANCH.REQUEST,
  payload,
});

export type ChangeBranchTypeAction = {
  type: string;
  payload: BranchType;
};
export const CHANGE_BRANCH_TYPE = prefixed('CHANGE_BRANCH_TYPE');
export const changeBranchType = (
  branchType: BranchType
): ChangeBranchTypeAction => ({
  type: CHANGE_BRANCH_TYPE,
  payload: branchType,
});

export const SHOW_CREATE_BRANCH_SUCCESS_FLAG = prefixed(
  'SHOW_CREATE_BRANCH_SUCCESS_FLAG'
);
export const showCreateBranchSuccessFlag = (branch: Ref) => ({
  type: SHOW_CREATE_BRANCH_SUCCESS_FLAG,
  payload: branch,
});

export type ChangeRepositoryAction = {
  type: string;
  payload: {
    /* The selected repository */
    selected: SelectOption;
    /* `true` if the user actually set the repository. */
    selectedByUser: boolean;
  };
};
export const CHANGE_REPOSITORY = prefixed('CHANGE_REPOSITORY');
export const onChangeRepository = (
  selected: SelectOption,
  selectedByUser = true
): ChangeRepositoryAction => ({
  type: CHANGE_REPOSITORY,
  payload: {
    selected,
    selectedByUser,
  },
});

export const SET_CURRENT_REPOSITORY = prefixed('SET_CURRENT_REPOSITORY');
export const setCurrentRepository = () => ({
  type: SET_CURRENT_REPOSITORY,
});

export type SetJiraIssueAction = {
  type: string;
  payload: JiraIssue;
};
export const SET_JIRA_ISSUE = prefixed('SET_JIRA_ISSUE');
export const setJiraIssue = (payload: JiraIssue): SetJiraIssueAction => ({
  type: SET_JIRA_ISSUE,
  payload,
});

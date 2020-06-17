import { createAsyncAction } from 'src/redux/actions';
import { OnboardingViewed } from '../constants';
import {
  Site,
  CreatePrCommentIssuePayload,
  IssueType,
  SetFormErrorStatePayload,
} from '../types';
import { createJiraIssue as prefix } from './prefix';

export const INIT_CREATE_JIRA_ISSUE = prefix('INIT_CREATE_JIRA_ISSUE');
export const initCreateJiraIssue = () => ({
  type: INIT_CREATE_JIRA_ISSUE,
});

export const CREATE_JIRA_ISSUE_FORM_VISIBILITY_CHANGE = prefix(
  'CREATE_JIRA_ISSUE_FORM_VISIBILITY_CHANGE'
);
export const onCreateJiraIssueFormChangeVisibility = (payload: {
  commentId: number;
  isVisible: boolean;
}) => ({
  type: CREATE_JIRA_ISSUE_FORM_VISIBILITY_CHANGE,
  payload,
});

export const FETCH_CONNECTED_JIRA_SITES = createAsyncAction(
  prefix('FETCH_CONNECTED_JIRA_SITES')
);
export const fetchConnectedJiraSites = () => ({
  type: FETCH_CONNECTED_JIRA_SITES.REQUEST,
});

export const FETCH_JIRA_PROJECT = createAsyncAction(
  prefix('FETCH_JIRA_PROJECT')
);
export const fetchJiraProject = (payload: {
  cloudId: string;
  projectId: string;
}) => ({
  type: FETCH_JIRA_PROJECT.REQUEST,
  payload,
});

export const FETCH_JIRA_PROJECTS_FOR_SITE = createAsyncAction(
  prefix('FETCH_JIRA_PROJECTS_FOR_SITE')
);
export const fetchJiraProjectsForSite = (payload: {
  site: Site;
  projectFilter: string;
}) => ({
  type: FETCH_JIRA_PROJECTS_FOR_SITE.REQUEST,
  payload,
});

export const FETCH_JIRA_ISSUE_CREATION_METADATA = createAsyncAction(
  prefix('FETCH_JIRA_ISSUE_CREATION_METADATA')
);
export const fetchJiraIssueCreationMetadata = (payload: {
  cloudId: string;
  projectId: string;
}) => ({
  type: FETCH_JIRA_ISSUE_CREATION_METADATA.REQUEST,
  payload,
});

export const CREATE_JIRA_ISSUE = createAsyncAction(prefix('CREATE_JIRA_ISSUE'));
export const createJiraIssue = (
  payload: CreatePrCommentIssuePayload & { pullRequestId: number }
) => ({
  type: CREATE_JIRA_ISSUE.REQUEST,
  payload,
});

export const ON_UNSUPPORTED_FIELDS_ERROR = prefix(
  'ON_UNSUPPORTED_FIELDS_ERROR'
);
export const onUnsupportedFieldsError = (payload: {
  issueType: IssueType;
  commentId: number;
}) => ({
  type: ON_UNSUPPORTED_FIELDS_ERROR,
  payload,
});

export const SET_FORM_ERROR_STATE = prefix('SET_FORM_ERROR_STATE');
export const setFormErrorState = (payload: SetFormErrorStatePayload) => ({
  type: SET_FORM_ERROR_STATE,
  payload,
});

export const FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED = createAsyncAction(
  prefix('FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED')
);
export const fetchCreateJiraIssueOnboardingViewed = () => ({
  type: FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.REQUEST,
});

export const UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED = createAsyncAction(
  prefix('UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED')
);
export const updateCreateJiraIssueOnboardingViewed = (
  payload: OnboardingViewed
) => ({
  type: UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.REQUEST,
  payload,
});

export const UNLOAD_CREATE_JIRA_ISSUE = prefix('UNLOAD_CREATE_JIRA_ISSUE');
export const unloadCreateJiraIssue = () => ({
  type: UNLOAD_CREATE_JIRA_ISSUE,
});

export const FETCH_CREATE_JIRA_ISSUE_PREFERENCES = createAsyncAction(
  prefix('FETCH_CREATE_JIRA_ISSUE_PREFERENCES')
);
export const fetchCreateJiraIssuePreferences = (
  repositoryFullSlug: string
) => ({
  type: FETCH_CREATE_JIRA_ISSUE_PREFERENCES.REQUEST,
  payload: {
    repositoryFullSlug,
  },
});

export const UPDATE_CREATE_JIRA_ISSUE_PREFERENCES = createAsyncAction(
  prefix('UPDATE_CREATE_JIRA_ISSUE_PREFERENCES')
);
export const updateCreateJiraIssuePreferences = (payload: {
  cloudId: string;
  projectId: string;
  repositoryFullSlug: string;
}) => ({
  type: UPDATE_CREATE_JIRA_ISSUE_PREFERENCES.REQUEST,
  payload,
});

import { createAsyncAction, hydrateAction } from 'src/redux/actions';
import urls from 'src/urls/jira';
import { EmptyStateKind } from '../constants';
import { FilterStatePartial } from '../types';
import { jiraRepoPage as prefix } from './prefix';

export const INSTALL_JIRA_ADDON = createAsyncAction(
  prefix('INSTALL_JIRA_ADDON')
);
export const installJiraAddon = () => ({
  type: INSTALL_JIRA_ADDON.REQUEST,
});

export const HYDRATE_JIRA_DATA = createAsyncAction(prefix('HYDRATE_JIRA_DATA'));
export const hydrateJiraData = (repositoryFullSlug: string) =>
  hydrateAction(HYDRATE_JIRA_DATA, 'repository.jira', {
    url: urls.ui.root(repositoryFullSlug),
  });

export const INIT_JIRA_REPO_PAGE = 'INIT_JIRA_REPO_PAGE';
export const initJiraRepoPage = (repositoryFullSlug: string) => ({
  type: INIT_JIRA_REPO_PAGE,
  payload: repositoryFullSlug,
});

export const FETCH_JIRA_SITES = createAsyncAction(prefix('FETCH_JIRA_SITES'));
export const fetchJiraSites = () => ({
  type: FETCH_JIRA_SITES.REQUEST,
});

export const FETCH_RELEVANT_JIRA_SITES = createAsyncAction(
  prefix('FETCH_RELEVANT_JIRA_SITES')
);
export const fetchRelevantJiraSites = (repositoryFullSlug: string) => ({
  type: FETCH_RELEVANT_JIRA_SITES.REQUEST,
  payload: repositoryFullSlug,
});

export const FETCH_JIRA_RELEVANT_PROJECTS = createAsyncAction(
  prefix('FETCH_JIRA_RELEVANT_PROJECTS')
);
export const fetchJiraRelevantProjects = () => ({
  type: FETCH_JIRA_RELEVANT_PROJECTS.REQUEST,
});

export const FETCH_JIRA_ASSIGNEES = createAsyncAction(
  prefix('FETCH_JIRA_ASSIGNEES')
);
export const fetchJiraAssignees = () => ({
  type: FETCH_JIRA_ASSIGNEES.REQUEST,
});

export const FETCH_JIRA_RELEVANT_ISSUES = createAsyncAction(
  prefix('FETCH_JIRA_RELEVANT_ISSUES')
);
export const fetchJiraRelevantIssues = () => ({
  type: FETCH_JIRA_RELEVANT_ISSUES.REQUEST,
});

export const FETCH_DEV_ACTIVITY = createAsyncAction(
  prefix('FETCH_DEV_ACTIVITY')
);
export const fetchDevActivity = (payload: {
  cloudId: string;
  issueIds: string[];
}) => ({
  type: FETCH_DEV_ACTIVITY.REQUEST,
  payload,
});

export const FETCH_WORKSPACE_PERMISSION = createAsyncAction(
  prefix('FETCH_WORKSPACE_PERMISSION')
);
export const fetchWorkspacePermission = () => ({
  type: FETCH_WORKSPACE_PERMISSION.REQUEST,
});

export const FILTER_STATE = {
  CHANGE: prefix('CHANGE_FILTER_STATE'),
  SAVE: prefix('SAVE_FILTER_STATE'),
};
export const saveFilterState = (payload: FilterStatePartial) => ({
  type: FILTER_STATE.SAVE,
  payload,
});

export const changeFilterState = (payload: FilterStatePartial) => ({
  type: FILTER_STATE.CHANGE,
  payload,
});

export const SET_EMPTY_STATE_KIND = prefix('SET_EMPTY_STATE_KIND');
export const setEmptyStateKind = (payload: EmptyStateKind) => ({
  type: SET_EMPTY_STATE_KIND,
  payload,
});

export const RESET_STATE = prefix('RESET_STATE');
export const resetState = () => ({
  type: RESET_STATE,
});

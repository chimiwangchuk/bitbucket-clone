import createReducer from 'src/utils/create-reducer';
import { LoadingStatus } from 'src/constants/loading-status';
import {
  FETCH_JIRA_SITES,
  FETCH_JIRA_RELEVANT_PROJECTS,
  FETCH_WORKSPACE_PERMISSION,
  INSTALL_JIRA_ADDON,
  HYDRATE_JIRA_DATA,
  SET_EMPTY_STATE_KIND,
  RESET_STATE,
  FETCH_RELEVANT_JIRA_SITES,
  FILTER_STATE,
  FETCH_JIRA_RELEVANT_ISSUES,
  FETCH_DEV_ACTIVITY,
  FETCH_JIRA_ASSIGNEES,
} from '../actions';
import {
  AppInstalledStatus,
  WorkspacePermission,
  EmptyStateKind,
} from '../constants';
import {
  Site,
  ProjectAssociation,
  JiraIssue,
  FilterState,
  Sort,
  DevActivityMap,
  Assignee,
} from '../types';

export type RepositoryJiraState = {
  appInstalledStatus: AppInstalledStatus;
  emptyStateKind: EmptyStateKind;
  projectAssociations: ProjectAssociation[];
  relevantProjectsFetchedStatus: LoadingStatus;
  relevantSites: Site[];
  relevantSitesFetchedStatus: LoadingStatus;
  sites: Site[];
  sitesFetchedStatus: LoadingStatus;
  jiraRelevantIssuesFetchedStatus: LoadingStatus;
  jiraRelevantIssues: JiraIssue[];
  jiraRelevantIssuesPages: number;
  devActivity: DevActivityMap;
  workspacePermission?: WorkspacePermission;
  workspacePermissionFetchedStatus: LoadingStatus;
  filterState: FilterState;
  assignees: Assignee[];
  assigneesFetchedStatus: LoadingStatus;
};

export const defaultFilterState = {
  siteCloudId: '',
  projectIds: [],
  issueCategories: [],
  textFilterQuery: '',
  assignees: [],
  sort: {
    field: 'updated',
    order: 'DESC',
  } as Sort,
  currentPage: 1,
};

export const initialState: RepositoryJiraState = {
  appInstalledStatus: AppInstalledStatus.Before,
  emptyStateKind: EmptyStateKind.Before,
  projectAssociations: [],
  relevantProjectsFetchedStatus: LoadingStatus.Before,
  relevantSites: [],
  relevantSitesFetchedStatus: LoadingStatus.Before,
  sites: [],
  sitesFetchedStatus: LoadingStatus.Before,
  jiraRelevantIssuesFetchedStatus: LoadingStatus.Before,
  jiraRelevantIssues: [],
  jiraRelevantIssuesPages: 0,
  devActivity: {},
  workspacePermission: undefined,
  workspacePermissionFetchedStatus: LoadingStatus.Before,
  filterState: defaultFilterState,
  assignees: [],
  assigneesFetchedStatus: LoadingStatus.Before,
};

export default createReducer(initialState, {
  [HYDRATE_JIRA_DATA.REQUEST]: state => ({
    ...state,
    appInstalledStatus: AppInstalledStatus.Fetching,
  }),
  [HYDRATE_JIRA_DATA.SUCCESS]: (state, { payload }) => ({
    ...state,
    appInstalledStatus: payload.appInstalled
      ? AppInstalledStatus.Installed
      : AppInstalledStatus.NotInstalled,
  }),
  [HYDRATE_JIRA_DATA.ERROR]: state => ({
    ...state,
    appInstalledStatus: AppInstalledStatus.FailedToFetch,
  }),
  [INSTALL_JIRA_ADDON.REQUEST]: state => ({
    ...state,
    appInstalledStatus: AppInstalledStatus.Installing,
  }),
  [INSTALL_JIRA_ADDON.SUCCESS]: state => ({
    ...state,
    appInstalledStatus: AppInstalledStatus.Installed,
  }),
  [INSTALL_JIRA_ADDON.ERROR]: state => ({
    ...state,
    appInstalledStatus: AppInstalledStatus.FailedToInstall,
  }),

  // Jira sites
  [FETCH_JIRA_SITES.REQUEST]: state => ({
    ...state,
    sitesFetchedStatus: LoadingStatus.Fetching,
    sites: [],
  }),
  [FETCH_JIRA_SITES.SUCCESS]: (state, { payload }) => ({
    ...state,
    sitesFetchedStatus: LoadingStatus.Success,
    sites: payload,
  }),
  [FETCH_JIRA_SITES.ERROR]: state => ({
    ...state,
    sitesFetchedStatus: LoadingStatus.Failed,
    sites: [],
  }),

  // Jira sites
  [FETCH_JIRA_RELEVANT_ISSUES.REQUEST]: state => ({
    ...state,
    jiraRelevantIssuesFetchedStatus: LoadingStatus.Fetching,
    jiraRelevantIssues: [],
    devActivity: {},
  }),
  [FETCH_JIRA_RELEVANT_ISSUES.SUCCESS]: (state, { payload }) => ({
    ...state,
    jiraRelevantIssuesFetchedStatus: LoadingStatus.Success,
    jiraRelevantIssues: payload.values,
    jiraRelevantIssuesPages: Math.ceil(payload.size / payload.pagelen),
  }),
  [FETCH_JIRA_RELEVANT_ISSUES.ERROR]: state => ({
    ...state,
    jiraRelevantIssuesFetchedStatus: LoadingStatus.Failed,
    jiraRelevantIssues: [],
    devActivity: {},
  }),

  // Dev activity (for icon with branch/pull request status for issues)
  [FETCH_DEV_ACTIVITY.REQUEST]: state => ({
    ...state,
    devActivity: {},
  }),
  [FETCH_DEV_ACTIVITY.SUCCESS]: (state, { payload }) => {
    // Update existing dev activity data for sites where we already had data,
    // instead of overwriting all the data for a site (which the normal shallow
    // spread would do). That means if you switch back and forth between pages,
    // the dev activity shows up immediately after issues are loaded.
    const devActivity = { ...state.devActivity };
    Object.keys(payload).forEach(cloudId => {
      devActivity[cloudId] = {
        ...devActivity[cloudId],
        ...payload[cloudId],
      };
    });
    return {
      ...state,
      devActivity,
    };
  },

  // Relevant Jira sites
  [FETCH_RELEVANT_JIRA_SITES.REQUEST]: state => ({
    ...state,
    relevantSitesFetchedStatus: LoadingStatus.Fetching,
    relevantSites: [],
  }),
  [FETCH_RELEVANT_JIRA_SITES.SUCCESS]: (
    state,
    { payload: { values, hasPermission } }
  ) => ({
    ...state,
    relevantSitesFetchedStatus: hasPermission
      ? LoadingStatus.Success
      : LoadingStatus.Forbidden,
    relevantSites: values,
  }),
  [FETCH_RELEVANT_JIRA_SITES.ERROR]: state => ({
    ...state,
    relevantSitesFetchedStatus: LoadingStatus.Failed,
    relevantSites: [],
  }),

  // Jira relevant projects
  [FETCH_JIRA_RELEVANT_PROJECTS.REQUEST]: state => ({
    ...state,
    relevantProjectsFetchedStatus: LoadingStatus.Fetching,
    projectAssociations: [],
  }),
  [FETCH_JIRA_RELEVANT_PROJECTS.SUCCESS]: (
    state,
    { payload: { values, hasPermission } }
  ) => ({
    ...state,
    relevantProjectsFetchedStatus: hasPermission
      ? LoadingStatus.Success
      : LoadingStatus.Forbidden,
    projectAssociations: values,
  }),
  [FETCH_JIRA_RELEVANT_PROJECTS.ERROR]: state => ({
    ...state,
    relevantProjectsFetchedStatus: LoadingStatus.Failed,
    projectAssociations: [],
  }),

  // Jira relevant assignees
  [FETCH_JIRA_ASSIGNEES.REQUEST]: state => ({
    ...state,
    assigneesFetchedStatus: LoadingStatus.Fetching,
    assignees: [],
  }),
  [FETCH_JIRA_ASSIGNEES.SUCCESS]: (state, { payload: { values } }) => ({
    ...state,
    assigneesFetchedStatus: LoadingStatus.Success,
    assignees: values,
  }),
  [FETCH_JIRA_ASSIGNEES.ERROR]: state => ({
    ...state,
    assigneesFetchedStatus: LoadingStatus.Failed,
    assignees: [],
  }),

  // Workspace permission
  [FETCH_WORKSPACE_PERMISSION.REQUEST]: state => ({
    ...state,
    workspacePermission: undefined,
    workspacePermissionFetchedStatus: LoadingStatus.Fetching,
  }),
  [FETCH_WORKSPACE_PERMISSION.SUCCESS]: (state, { payload }) => ({
    ...state,
    workspacePermission: payload[0] && payload[0].permission,
    workspacePermissionFetchedStatus: LoadingStatus.Success,
  }),
  [FETCH_WORKSPACE_PERMISSION.ERROR]: state => ({
    ...state,
    workspacePermission: undefined,
    workspacePermissionFetchedStatus: LoadingStatus.Failed,
  }),

  [FILTER_STATE.SAVE]: (state, { payload }) => ({
    ...state,
    filterState: {
      ...state.filterState,
      ...payload,
    },
  }),

  [SET_EMPTY_STATE_KIND]: (state, { payload }) => ({
    ...state,
    emptyStateKind: payload,
  }),
  [RESET_STATE]: () => ({
    ...initialState,
  }),
});

import createReducer from 'src/utils/create-reducer';
import { Action } from 'src/types/state';
import { LoadingStatus } from 'src/constants/loading-status';
import {
  FETCH_DASHBOARD_DEV_ACTIVITY,
  FETCH_DASHBOARD_JIRA_ISSUES,
  INIT_DASHBOARD_JIRA,
  ON_DASHBOARD_JIRA_SITE_CHANGE,
  SET_DASHBOARD_JIRA_DEFAULT_CLOUD_ID,
} from '../actions';
import { AvailableSite, DevActivityMap, JiraIssue } from '../types';

export type DashboardJiraIssuesState = {
  defaultSiteCloudId?: string;
  selectedSite?: AvailableSite;
  availableSites: AvailableSite[];
  availableSitesLoadingStatus: LoadingStatus;
  jiraIssues: JiraIssue[];
  jiraIssuesLoadingStatus: LoadingStatus;
  jiraIssuesCount: number;
  jiraIssuesJql?: string;
  devActivity: DevActivityMap;
};

const initialState: DashboardJiraIssuesState = {
  availableSites: [],
  availableSitesLoadingStatus: LoadingStatus.Before,
  jiraIssues: [],
  jiraIssuesLoadingStatus: LoadingStatus.Before,
  jiraIssuesCount: 0,
  devActivity: {},
};

export default createReducer(initialState, {
  [INIT_DASHBOARD_JIRA.REQUEST]: state => ({
    ...state,
    selectedSite: undefined,
    availableSites: [],
    availableSitesLoadingStatus: LoadingStatus.Fetching,
    devActivity: {},
  }),
  [INIT_DASHBOARD_JIRA.SUCCESS]: (
    state,
    {
      payload,
    }: Action<{ selectedSite: AvailableSite; availableSites: AvailableSite[] }>
  ) => ({
    ...state,
    selectedSite: payload!.selectedSite,
    availableSites: payload!.availableSites,
    availableSitesLoadingStatus: LoadingStatus.Success,
  }),
  [INIT_DASHBOARD_JIRA.ERROR]: state => ({
    ...state,
    selectedSite: undefined,
    availableSites: [],
    availableSitesLoadingStatus: LoadingStatus.Failed,
  }),
  [SET_DASHBOARD_JIRA_DEFAULT_CLOUD_ID]: (
    state,
    { payload }: Action<string>
  ) => ({
    ...state,
    defaultSiteCloudId: payload,
  }),
  [ON_DASHBOARD_JIRA_SITE_CHANGE]: (
    state,
    { payload }: Action<AvailableSite>
  ) => ({
    ...state,
    selectedSite: payload,
    // Reset the state when the selected site changes
    jiraIssues: [],
    jiraIssuesLoadingStatus: LoadingStatus.Before,
    jiraIssuesCount: 0,
    jiraIssuesJql: undefined,
  }),
  [FETCH_DASHBOARD_JIRA_ISSUES.REQUEST]: state => ({
    ...state,
    jiraIssues: [],
    jiraIssuesLoadingStatus: LoadingStatus.Fetching,
    jiraIssuesCount: 0,
    jiraIssuesJql: undefined,
  }),
  [FETCH_DASHBOARD_JIRA_ISSUES.SUCCESS]: (
    state,
    {
      payload,
    }: Action<{
      jiraIssues: JiraIssue[];
      jiraIssuesCount: number;
      jiraIssuesJql: string;
    }>
  ) => ({
    ...state,
    jiraIssues: payload!.jiraIssues,
    jiraIssuesLoadingStatus: LoadingStatus.Success,
    jiraIssuesCount: payload!.jiraIssuesCount,
    jiraIssuesJql: payload!.jiraIssuesJql,
  }),
  [FETCH_DASHBOARD_JIRA_ISSUES.ERROR]: state => ({
    ...state,
    jiraIssues: [],
    jiraIssuesLoadingStatus: LoadingStatus.Failed,
    jiraIssuesCount: 0,
    jiraIssuesJql: undefined,
  }),
  [FETCH_DASHBOARD_DEV_ACTIVITY.SUCCESS]: (state, { payload }) => {
    // Update existing dev activity data for sites where we already had data,
    // instead of overwriting all the data for a site (which the normal shallow
    // spread would do). That means if you switch back and forth between sites,
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
});

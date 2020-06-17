import { createAsyncAction } from 'src/redux/actions';
import { AvailableSite } from 'src/redux/jira/types';
import { dashboardJiraIssues as prefix } from './prefix';

export const INIT_DASHBOARD_JIRA = createAsyncAction(
  prefix('INIT_DASHBOARD_JIRA')
);
export const initDashboardJiraIssues = () => ({
  type: INIT_DASHBOARD_JIRA.REQUEST,
});

export const ON_DASHBOARD_JIRA_SITE_CHANGE = prefix(
  'ON_DASHBOARD_JIRA_SITE_CHANGE'
);
export const onDashboardJiraSiteChange = (site: AvailableSite) => ({
  type: ON_DASHBOARD_JIRA_SITE_CHANGE,
  payload: site,
});

export const FETCH_DASHBOARD_JIRA_ISSUES = createAsyncAction(
  prefix('FETCH_DASHBOARD_JIRA_ISSUES')
);
export const fetchDashboardJiraIssues = (site: AvailableSite) => ({
  type: FETCH_DASHBOARD_JIRA_ISSUES.REQUEST,
  payload: site,
});

export const SET_DASHBOARD_JIRA_DEFAULT_CLOUD_ID = prefix(
  'SET_DASHBOARD_JIRA_DEFAULT_CLOUD_ID'
);
export const setDashboardJiraDefaultCloudId = (cloudId: string) => ({
  type: SET_DASHBOARD_JIRA_DEFAULT_CLOUD_ID,
  payload: cloudId,
});

export const FETCH_DASHBOARD_DEV_ACTIVITY = createAsyncAction(
  prefix('FETCH_DEV_ACTIVITY')
);
export const fetchDashboardDevActivity = (payload: {
  cloudId: string;
  issueIds: string[];
}) => ({
  type: FETCH_DASHBOARD_DEV_ACTIVITY.REQUEST,
  payload,
});

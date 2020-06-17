import { all, takeLatest } from 'redux-saga/effects';

import {
  CREATE_JIRA_ISSUE,
  FETCH_AVAILABLE_ISSUE_TRANSITIONS,
  FETCH_CONNECTED_JIRA_SITES,
  FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED,
  FETCH_CREATE_JIRA_ISSUE_PREFERENCES,
  FETCH_DASHBOARD_DEV_ACTIVITY,
  FETCH_DASHBOARD_JIRA_ISSUES,
  FETCH_DEV_ACTIVITY,
  FETCH_JIRA_ASSIGNEES,
  FETCH_JIRA_ISSUE_CREATION_METADATA,
  FETCH_JIRA_PROJECT,
  FETCH_JIRA_RELEVANT_ISSUES,
  FETCH_JIRA_RELEVANT_PROJECTS,
  FETCH_JIRA_SITES,
  FETCH_PULL_REQUEST_JIRA_ISSUES,
  FETCH_RELEVANT_JIRA_SITES,
  FETCH_WORKSPACE_PERMISSION,
  FILTER_STATE,
  INIT_CREATE_JIRA_ISSUE,
  INIT_DASHBOARD_JIRA,
  INIT_JIRA_REPO_PAGE,
  INSTALL_JIRA_ADDON,
  ON_DASHBOARD_JIRA_SITE_CHANGE,
  ON_UNSUPPORTED_FIELDS_ERROR,
  TRANSITION_ISSUES,
  UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED,
  UPDATE_CREATE_JIRA_ISSUE_PREFERENCES,
} from '../actions';
import {
  createJiraIssueSaga,
  fetchConnectedJiraSitesSaga,
  fetchCreateJiraIssueOnboardingViewedSaga,
  fetchCreateJiraIssuePreferencesSaga,
  fetchDebouncedJiraProjectsForSiteSaga,
  fetchJiraIssueCreationMetadataSaga,
  fetchJiraProjectSaga,
  handleUnsupportedFieldsErrorSaga,
  initCreateJiraIssueSaga,
  updateCreateJiraIssueOnboardingViewedSaga,
  updateCreateJiraIssuePreferencesSaga,
} from './create-jira-issue-saga';
import {
  changeFilterStateSaga,
  fetchDevActivitySaga,
  fetchJiraAssigneesSaga,
  fetchJiraRelevantIssuesSaga,
  fetchJiraRelevantProjectsSaga,
  fetchRelevantJiraSitesSaga,
  fetchSitesSaga,
  fetchWorkspacePermissionSaga,
  handleFetchRelevantIssuesSuccessSaga,
  handleFetchRelevantProjectsSuccessSaga,
  handleFetchRelevantSitesSuccessSaga,
  handleFetchSitesSuccessSaga,
  initJiraRepoPageSaga,
  updateEmptyStateForSelectedSite,
} from './jira-repo-page-saga';
import { installAddonSaga } from './install-addon-saga';
import {
  fetchAvailableIssueTransitionsSaga,
  fetchPullRequestJiraIssuesSaga,
  transitionIssuesSaga,
} from './pull-request-jira-issues-saga';
import {
  fetchDashboardDevActivitySaga,
  fetchDashboardJiraIssuesSaga,
  initDashboardJira,
  onSelectedSiteChangeSaga,
} from './dashboard-jira-issues-saga';

export default function* jiraSagas() {
  yield all([
    takeLatest(FETCH_JIRA_RELEVANT_ISSUES.REQUEST, fetchJiraRelevantIssuesSaga),
    takeLatest(FETCH_DEV_ACTIVITY.REQUEST, fetchDevActivitySaga),
    takeLatest(FETCH_JIRA_ASSIGNEES.REQUEST, fetchJiraAssigneesSaga),
    takeLatest(INSTALL_JIRA_ADDON.REQUEST, installAddonSaga),
    takeLatest(INIT_JIRA_REPO_PAGE, initJiraRepoPageSaga),
    takeLatest(FETCH_RELEVANT_JIRA_SITES.REQUEST, fetchRelevantJiraSitesSaga),
    takeLatest(
      FETCH_JIRA_RELEVANT_ISSUES.SUCCESS,
      handleFetchRelevantIssuesSuccessSaga
    ),
    takeLatest(
      FETCH_RELEVANT_JIRA_SITES.SUCCESS,
      handleFetchRelevantSitesSuccessSaga
    ),
    takeLatest(FETCH_JIRA_SITES.REQUEST, fetchSitesSaga),
    takeLatest(FETCH_JIRA_SITES.SUCCESS, handleFetchSitesSuccessSaga),
    takeLatest(
      FETCH_JIRA_RELEVANT_PROJECTS.REQUEST,
      fetchJiraRelevantProjectsSaga
    ),
    takeLatest(
      FETCH_JIRA_RELEVANT_PROJECTS.SUCCESS,
      handleFetchRelevantProjectsSuccessSaga
    ),
    takeLatest(
      FETCH_JIRA_RELEVANT_PROJECTS.ERROR,
      updateEmptyStateForSelectedSite
    ),
    takeLatest(
      FETCH_WORKSPACE_PERMISSION.REQUEST,
      fetchWorkspacePermissionSaga
    ),
    takeLatest(FETCH_CONNECTED_JIRA_SITES.REQUEST, fetchConnectedJiraSitesSaga),
    takeLatest(
      FETCH_JIRA_ISSUE_CREATION_METADATA.REQUEST,
      fetchJiraIssueCreationMetadataSaga
    ),
    takeLatest(CREATE_JIRA_ISSUE.REQUEST, createJiraIssueSaga),
    takeLatest(
      FETCH_PULL_REQUEST_JIRA_ISSUES.REQUEST,
      fetchPullRequestJiraIssuesSaga
    ),
    takeLatest(
      FETCH_AVAILABLE_ISSUE_TRANSITIONS.REQUEST,
      fetchAvailableIssueTransitionsSaga
    ),
    takeLatest(TRANSITION_ISSUES.REQUEST, transitionIssuesSaga),
    takeLatest(ON_UNSUPPORTED_FIELDS_ERROR, handleUnsupportedFieldsErrorSaga),
    takeLatest(
      FETCH_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.REQUEST,
      fetchCreateJiraIssueOnboardingViewedSaga
    ),
    takeLatest(
      UPDATE_CREATE_JIRA_ISSUE_ONBOARDING_VIEWED.REQUEST,
      updateCreateJiraIssueOnboardingViewedSaga
    ),
    takeLatest(
      FETCH_CREATE_JIRA_ISSUE_PREFERENCES.REQUEST,
      fetchCreateJiraIssuePreferencesSaga
    ),
    takeLatest(
      UPDATE_CREATE_JIRA_ISSUE_PREFERENCES.REQUEST,
      updateCreateJiraIssuePreferencesSaga
    ),
    takeLatest(INIT_CREATE_JIRA_ISSUE, initCreateJiraIssueSaga),
    takeLatest(INIT_DASHBOARD_JIRA.REQUEST, initDashboardJira),
    takeLatest(ON_DASHBOARD_JIRA_SITE_CHANGE, onSelectedSiteChangeSaga),
    takeLatest(
      FETCH_DASHBOARD_JIRA_ISSUES.REQUEST,
      fetchDashboardJiraIssuesSaga
    ),
    takeLatest(
      FETCH_DASHBOARD_DEV_ACTIVITY.REQUEST,
      fetchDashboardDevActivitySaga
    ),
    takeLatest(FETCH_JIRA_PROJECT.REQUEST, fetchJiraProjectSaga),
    takeLatest(FILTER_STATE.CHANGE, changeFilterStateSaga),
    fetchDebouncedJiraProjectsForSiteSaga(),
  ]);
}

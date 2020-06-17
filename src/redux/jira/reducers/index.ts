import { combineReducers } from 'redux';

import jiraRepoPage, { RepositoryJiraState } from './jira-repo-page';
import createJiraIssue, { CreateJiraIssueState } from './create-jira-issue';
import dashboardJiraIssues, {
  DashboardJiraIssuesState,
} from './dashboard-jira-issues';
import pullRequestJiraIssues, {
  PullRequestJiraIssuesState,
} from './pull-request-jira-issues';

export type JiraState = {
  jiraRepoPage: RepositoryJiraState;
  createJiraIssue: CreateJiraIssueState;
  pullRequestJiraIssues: PullRequestJiraIssuesState;
  dashboardJiraIssues: DashboardJiraIssuesState;
};

export default combineReducers({
  jiraRepoPage,
  createJiraIssue,
  pullRequestJiraIssues,
  dashboardJiraIssues,
});

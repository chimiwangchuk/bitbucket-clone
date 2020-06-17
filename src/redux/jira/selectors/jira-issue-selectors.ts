import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { BucketState } from 'src/types/state';
import { PrCommentJiraIssue } from 'src/redux/jira/types';
import { getJiraSlice } from 'src/selectors/state-slicing-selectors';

export const getPullRequestJiraIssuesFetchedStatus = createSelector(
  getJiraSlice,
  state => state.pullRequestJiraIssues.jiraIssuesFetchedStatus
);

export const getPullRequestJiraIssues = createSelector(
  getJiraSlice,
  state => state.pullRequestJiraIssues.jiraIssues
);
export const getIssueTransitionForm = createSelector(
  getJiraSlice,
  state => state.pullRequestJiraIssues.issueTransitionFormData
);

export const getJiraIssueSites = createSelector(getJiraSlice, state => ({
  fetchedStatus: state.createJiraIssue.connectedSitesFetchedStatus,
  list: state.createJiraIssue.connectedSites,
}));

export const getPullRequestJiraIssuesForComment = createCachedSelector(
  getPullRequestJiraIssues,
  (_state: BucketState, commentId: number) => commentId,
  (issues: PrCommentJiraIssue[], commentId: number) => {
    return issues.filter(issue => issue.commentId === commentId);
  }
)((_state, commentId: number) => commentId);

export const getPullRequestJiraIssuesByType = createCachedSelector(
  getPullRequestJiraIssues,
  (_state: BucketState, type: string) => type,
  (issues: PrCommentJiraIssue[], type: string) => {
    return issues.filter(issue => issue.type === type);
  }
)((_state, type: string) => type);

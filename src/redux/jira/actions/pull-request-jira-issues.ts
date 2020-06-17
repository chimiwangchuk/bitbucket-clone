import { createAsyncAction } from 'src/redux/actions';
import { PrCommentJiraIssue, IssueTransitionFormRowData } from '../types';
import { jiraIssues as prefix } from './prefix';

export const FETCH_PULL_REQUEST_JIRA_ISSUES = createAsyncAction(
  prefix('FETCH_PULL_REQUEST_JIRA_ISSUES')
);

export type FetchPullRequestJiraIssuesPayload = {
  owner: string;
  slug: string;
  id: number;
};

export const fetchPullRequestJiraIssues = (
  payload: FetchPullRequestJiraIssuesPayload
) => ({
  type: FETCH_PULL_REQUEST_JIRA_ISSUES.REQUEST,
  ...payload,
});

export const FETCH_AVAILABLE_ISSUE_TRANSITIONS = createAsyncAction(
  prefix('FETCH_AVAILABLE_ISSUE_TRANSITIONS')
);

export const fetchAvailableIssueTransitions = (index: number) => ({
  type: FETCH_AVAILABLE_ISSUE_TRANSITIONS.REQUEST,
  payload: index,
});

export const UPDATE_ISSUE_TRANSITION = prefix('UPDATE_ISSUE_TRANSITION_FORM');

export const updateIssueTransition = (payload: {
  index: number;
  newTransition: IssueTransitionFormRowData;
}) => ({
  type: UPDATE_ISSUE_TRANSITION,
  payload,
});

export const ADD_ISSUE_TRANSITION = prefix('ADD_ISSUE_TRANSITION_FORM');

export const addIssueTransition = () => ({
  type: ADD_ISSUE_TRANSITION,
});

export const TRANSITION_ISSUES = createAsyncAction(prefix('TRANSITION_ISSUES'));

export const transitionIssues = () => ({
  type: TRANSITION_ISSUES.REQUEST,
});

export const UPDATE_JIRA_ISSUES_LIST_AFTER_CREATION = prefix(
  'UPDATE_JIRA_ISSUES_LIST_AFTER_CREATION'
);
export const updateJiraIssuesListAfterCreation = (
  payload: PrCommentJiraIssue
) => ({
  type: UPDATE_JIRA_ISSUES_LIST_AFTER_CREATION,
  payload,
});

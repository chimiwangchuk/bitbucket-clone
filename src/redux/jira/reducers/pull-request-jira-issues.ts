import createReducer from 'src/utils/create-reducer';
import { LoadingStatus } from 'src/constants/loading-status';
import { PrCommentJiraIssue, IssueTransitionFormRowData } from '../types';
import {
  FETCH_PULL_REQUEST_JIRA_ISSUES,
  UPDATE_JIRA_ISSUES_LIST_AFTER_CREATION,
  FETCH_AVAILABLE_ISSUE_TRANSITIONS,
  TRANSITION_ISSUES,
  UPDATE_ISSUE_TRANSITION,
  ADD_ISSUE_TRANSITION,
} from '../actions';

export type PullRequestJiraIssuesState = {
  jiraIssues: PrCommentJiraIssue[];
  jiraIssuesFetchedStatus: LoadingStatus;
  issueTransitionFormData: IssueTransitionFormRowData[];
};

const initialState: PullRequestJiraIssuesState = {
  jiraIssues: [],
  jiraIssuesFetchedStatus: LoadingStatus.Before,
  issueTransitionFormData: [],
};

export default createReducer(initialState, {
  [FETCH_PULL_REQUEST_JIRA_ISSUES.SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      jiraIssuesFetchedStatus: LoadingStatus.Success,
      jiraIssues: payload,
    };
  },
  [FETCH_PULL_REQUEST_JIRA_ISSUES.REQUEST]: state => {
    return {
      ...state,
      jiraIssuesFetchedStatus: LoadingStatus.Before,
      jiraIssues: [],
    };
  },
  [FETCH_PULL_REQUEST_JIRA_ISSUES.ERROR]: state => ({
    ...state,
    jiraIssuesFetchedStatus: LoadingStatus.Failed,
    jiraIssues: [],
  }),
  [FETCH_AVAILABLE_ISSUE_TRANSITIONS.SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      issueTransitionFormData: state.issueTransitionFormData.map((row, i) =>
        i === payload.index
          ? {
              ...row,
              availableIssueTransitions: payload.availableIssueTransitions,
              availableIssueTransitionsFetchedStatus: LoadingStatus.Success,
            }
          : row
      ),
    };
  },
  [FETCH_AVAILABLE_ISSUE_TRANSITIONS.REQUEST]: (state, { payload }) => {
    return {
      ...state,
      issueTransitionFormData: state.issueTransitionFormData.map((row, i) =>
        i === payload
          ? {
              ...row,
              availableIssueTransitions: [],
              availableIssueTransitionsFetchedStatus: LoadingStatus.Before,
            }
          : row
      ),
    };
  },
  [FETCH_AVAILABLE_ISSUE_TRANSITIONS.ERROR]: (state, { payload }) => {
    return {
      ...state,
      issueTransitionFormData: state.issueTransitionFormData.map((row, i) =>
        i === payload
          ? {
              ...row,
              availableIssueTransitions: [],
              availableIssueTransitionsFetchedStatus: LoadingStatus.Failed,
            }
          : row
      ),
    };
  },
  [UPDATE_JIRA_ISSUES_LIST_AFTER_CREATION]: (state, { payload }) => ({
    ...state,
    jiraIssues: [...state.jiraIssues, payload],
  }),
  [UPDATE_ISSUE_TRANSITION]: (state, { payload }) => ({
    ...state,
    issueTransitionFormData: state.issueTransitionFormData.map(
      (currentTransition, i) =>
        i === payload.index ? payload.newTransition : currentTransition
    ),
  }),
  [ADD_ISSUE_TRANSITION]: state => ({
    ...state,
    issueTransitionFormData: state.issueTransitionFormData.concat({
      selectedIssue: undefined,
      availableIssueTransitions: [],
      availableIssueTransitionsFetchedStatus: LoadingStatus.Before,
      selectedTransition: undefined,
      shouldTransition: false,
      transitionStatus: LoadingStatus.Before,
    }),
  }),
  [TRANSITION_ISSUES.REQUEST]: state => ({
    ...state,
    transitionStatus: LoadingStatus.Before,
  }),
  [TRANSITION_ISSUES.SUCCESS]: state => ({
    ...state,
    transitionStatus: LoadingStatus.Success,
  }),
  [TRANSITION_ISSUES.ERROR]: state => ({
    ...state,
    transitionStatus: LoadingStatus.Failed,
  }),
});

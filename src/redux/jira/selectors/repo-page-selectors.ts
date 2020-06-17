import { Selector, createSelector } from 'reselect';
import { JiraState } from 'src/redux/jira/reducers';

import { LoadingStatus } from 'src/constants/loading-status';
import { getJiraSlice } from 'src/selectors/state-slicing-selectors';
import { BucketState } from 'src/types/state';
import {
  Assignee,
  FilterState,
  JiraIssue,
  ProjectAssociation,
  Site,
} from '../types';

export const getFilterState: Selector<
  BucketState,
  FilterState
> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.filterState
);

export const getRelevantSitesFetchedStatus: Selector<
  BucketState,
  LoadingStatus
> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.relevantSitesFetchedStatus
);

export const getRelevantSites: Selector<BucketState, Site[]> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.relevantSites
);

export const getRelevantProjectFetchedStatus: Selector<
  BucketState,
  LoadingStatus
> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.relevantProjectsFetchedStatus
);

export const getProjectAssociations: Selector<
  BucketState,
  ProjectAssociation[]
> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.projectAssociations
);

export const getSelectedAssignees: Selector<
  BucketState,
  string[]
> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.filterState.assignees
);

export const getRelevantIssuesFetchedStatus: Selector<
  BucketState,
  LoadingStatus
> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.jiraRelevantIssuesFetchedStatus
);

export const getRelevantIssues: Selector<
  BucketState,
  JiraIssue[]
> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.jiraRelevantIssues
);

export const getRelevantIssuesPages: Selector<
  BucketState,
  number
> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.jiraRelevantIssuesPages
);

export const getAssigneesFetchedStatus: Selector<
  BucketState,
  LoadingStatus
> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.assigneesFetchedStatus
);

export const getAssignees: Selector<BucketState, Assignee[]> = createSelector(
  getJiraSlice,
  (state: JiraState) => state.jiraRepoPage.assignees
);

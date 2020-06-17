import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { DashboardState } from 'src/redux/dashboard/reducers';
import {
  getDashboard,
  getEntities,
} from 'src/selectors/state-slicing-selectors';
import { pullRequest as pullRequestSchema } from 'src/redux/pull-request/schemas';

import { DashboardPullRequestsState } from '../reducers/pull-requests';

export const getPullRequestsSlice = createSelector(
  getDashboard,
  (dashboard: DashboardState) => dashboard.pullRequests
);

const getPullRequests = createSelector(
  getPullRequestsSlice,
  (slice: DashboardPullRequestsState) => slice.pullRequests
);

const getAuthorPullRequestKeys = createSelector(
  getPullRequests,
  pullRequests => pullRequests.authored
);

const getReviewingPullRequestsKeys = createSelector(
  getPullRequests,
  pullRequests => pullRequests.reviewing
);

export const getReviewingPullRequests = createSelector(
  getReviewingPullRequestsKeys,
  getEntities,
  (keys, entities) => denormalize(keys, [pullRequestSchema], entities)
);

export const getAuthoredPullRequests = createSelector(
  getAuthorPullRequestKeys,
  getEntities,
  (keys, entities) => denormalize(keys, [pullRequestSchema], entities)
);

export const getPullRequestsFilters = createSelector(
  getPullRequestsSlice,
  (slice: DashboardPullRequestsState) => slice.pullRequestFilters
);

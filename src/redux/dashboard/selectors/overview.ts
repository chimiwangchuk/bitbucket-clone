import { createSelector } from 'reselect';

import { denormalize } from 'normalizr';
import { DashboardState } from 'src/redux/dashboard/reducers';
import { getIsRepositoriesCardsView } from 'src/selectors/feature-selectors';
import {
  getDashboard,
  getEntities,
} from 'src/selectors/state-slicing-selectors';
import { repository as repositorySchema } from 'src/sections/repository/schemas';
import { getRecentlyViewedRepositories } from 'src/selectors/repository-selectors';

import { DashboardOverviewState } from '../reducers/overview';

export const getDashboardOverviewRepositoriesSlice = createSelector(
  getDashboard,
  (dashboard: DashboardState) => dashboard.overviewRepositories
);

const getLastUpdatedRepositoryKeys = createSelector(
  getDashboardOverviewRepositoriesSlice,
  (slice: DashboardOverviewState) => slice.repositories
);

const getLastUpdatedRepositories = createSelector(
  getLastUpdatedRepositoryKeys,
  getEntities,
  (keys, entities) => denormalize(keys, [repositorySchema], entities)
);

export const getLastUpdatedRepositoryCount = createSelector(
  getLastUpdatedRepositoryKeys,
  keys => keys.length
);

const getLimitedRecentlyViewedRepositories = createSelector(
  getRecentlyViewedRepositories,
  repositories => repositories.slice(0, 10)
);

export const getDashboardOverviewRepositoriesSortBy = createSelector(
  getDashboardOverviewRepositoriesSlice,
  (slice: DashboardOverviewState) => slice.repositoriesSortBy
);

export const getDashboardOverviewRepositories = createSelector(
  getDashboardOverviewRepositoriesSortBy,
  getLastUpdatedRepositories,
  getLimitedRecentlyViewedRepositories,
  getIsRepositoriesCardsView,
  (sortBy, lastUpdated, recentlyViewed, isRepositoriesCardsView) =>
    sortBy === ('RECENTLY_VIEWED' || isRepositoriesCardsView)
      ? recentlyViewed
      : lastUpdated
);

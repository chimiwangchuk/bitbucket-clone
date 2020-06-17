import { createSelector } from 'reselect';
import { memoize } from 'lodash-es';

import { denormalize } from 'normalizr';
import { DashboardState } from 'src/redux/dashboard/reducers';
import {
  getDashboard,
  getEntities,
} from 'src/selectors/state-slicing-selectors';
import { repository as repositorySchema } from 'src/sections/repository/schemas';
import { getPagination } from 'src/utils/get-pagination';

import { DashboardRepositoriesState } from '../reducers/repositories';

export const getRepositoryListSlice = createSelector(
  getDashboard,
  (dashboard: DashboardState) => dashboard.repositories
);

const getRepositoryKeys = createSelector(
  getRepositoryListSlice,
  (slice: DashboardRepositoriesState) => slice.repositories
);

export const getRepositories = createSelector(
  getRepositoryKeys,
  getEntities,
  (keys, entities) => denormalize(keys, [repositorySchema], entities)
);

const getRepositoriesSize = createSelector(
  getRepositoryListSlice,
  (slice: DashboardRepositoriesState) => slice.size
);

const getRepositoriesLength = createSelector(
  getRepositoryListSlice,
  (slice: DashboardRepositoriesState) => slice.pagelen
);

export const getRepositoriesTotalPages = createSelector(
  getRepositoriesSize,
  getRepositoriesLength,
  (size, pageLength) => (size && pageLength ? Math.ceil(size / pageLength) : 1)
);

export const getRepositoriesPagination = createSelector(
  getRepositoriesTotalPages,
  totalPages => memoize(getPagination(totalPages))
);

export const getRepositoryFiltersSlice = createSelector(
  getDashboard,
  (dashboard: DashboardState) => dashboard.repositoryFilters
);

export const getRepositoryOwnersFilter = createSelector(
  getRepositoryFiltersSlice,
  repositoryFilters => repositoryFilters.owners
);

export const getRepositoryWorkspacesFilter = createSelector(
  getRepositoryFiltersSlice,
  repositoryFilters => repositoryFilters.workspaces
);

export const getRepositoryProjectsFilter = createSelector(
  getRepositoryFiltersSlice,
  repositoryFilters => repositoryFilters.projects
);

export const getProjects = createSelector(
  getRepositoryProjectsFilter,
  ({ filteredProjects, data }) =>
    filteredProjects.length ? filteredProjects : data
);

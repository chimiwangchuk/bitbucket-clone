import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { getProfileRepositoriesStateSlice } from 'src/redux/profile/selectors';
import { getEntities } from 'src/selectors/state-slicing-selectors';
import { repository as repositorySchema } from 'src/sections/repository/schemas';
import { getPagination } from 'src/utils/get-pagination';

export const getRepositoryKeys = createSelector(
  getProfileRepositoriesStateSlice,
  profileRepositories => profileRepositories.listItems
);

export const getProfileRepositories = createSelector(
  getRepositoryKeys,
  getEntities,
  (keys, entities) => denormalize(keys, [repositorySchema], entities)
);

const getRepositoriesSize = createSelector(
  getProfileRepositoriesStateSlice,
  slice => slice.size
);

const getRepositoriesLength = createSelector(
  getProfileRepositoriesStateSlice,
  slice => slice.pagelen
);

export const getRepositoriesTotalPages = createSelector(
  getRepositoriesSize,
  getRepositoriesLength,
  (size, pageLength) => (size && pageLength ? Math.ceil(size / pageLength) : 1)
);

export const getRepositoriesPagination = createSelector(
  getRepositoriesTotalPages,
  totalPages => getPagination(totalPages)
);

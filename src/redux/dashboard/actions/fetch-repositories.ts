import { repository as repositorySchema } from 'src/sections/repository/schemas';
import urls from 'src/urls/dashboard';

import { fetchAction } from 'src/redux/actions';
import { buildRepositoryBBQL } from 'src/redux/dashboard/utils';

import { RepositoryFilters } from 'src/sections/dashboard/types';
import { FetchRepositories } from './';

export default ({
  pagelen,
  page,
  filters,
  sort,
  csrftoken,
}: {
  pagelen?: number;
  page?: number;
  filters?: RepositoryFilters;
  sort?: string;
  csrftoken?: string;
}) =>
  fetchAction(FetchRepositories, {
    url: urls.api.internal.dashboardRepositories({
      pagelen,
      page,
      q: buildRepositoryBBQL(filters),
      watching: filters && filters.isWatching ? true : null,
      sort,
    }),
    schema: { values: [repositorySchema] },
    csrftoken,
  });

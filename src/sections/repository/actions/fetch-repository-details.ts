import { stringify } from 'qs';

import { fetchAction } from 'src/redux/actions';
import { repository as repoSchema } from 'src/sections/repository/schemas';

import urls from '../urls';
import { FetchRepositoryDetails } from './';

export default (repositoryFullSlug: string) => {
  const query = stringify({
    fields: '+parent.mainbranch.*',
  });

  return fetchAction(FetchRepositoryDetails, {
    url: `${urls.api.internal.details(repositoryFullSlug)}?${query}`,
    schema: {
      parent: repoSchema,
    },
  });
};

import { stringify } from 'qs';

import { fetchAction } from 'src/redux/actions';
import urls from 'src/sections/repository/urls';
import { FetchSourceRepositoryDetails } from 'src/sections/repository/actions';

export const fetchSourceRepositoryDetails = (repositoryFullSlug: string) => {
  const query = stringify({
    fields: '+parent.mainbranch.*',
  });

  return fetchAction(FetchSourceRepositoryDetails, {
    url: `${urls.api.internal.details(repositoryFullSlug)}?${query}`,
  });
};

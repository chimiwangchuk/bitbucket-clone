import { fetchAction } from 'src/redux/actions';

import urls from '../urls';
import { WatchPrefs } from '../types';
import { FetchRepositorySubscriptions } from './constants';

export default (
  repositoryFullSlug: string,
  updatedSubscriptionSettings?: WatchPrefs
) => {
  if (updatedSubscriptionSettings) {
    return fetchAction(FetchRepositorySubscriptions, {
      url: urls.xhr.watchPrefs(repositoryFullSlug),
      fetchOptions: {
        body: JSON.stringify(updatedSubscriptionSettings),
        method: 'POST',
      },
    });
  }

  return fetchAction(FetchRepositorySubscriptions, {
    url: urls.xhr.watchPrefs(repositoryFullSlug),
    cache: { ttl: 0 },
  });
};

import storage from 'src/utils/store';

const storageKey = 'pullrequest-history';

const getAll = () => storage.get(storageKey) || {};
const buildKey = (repositoryFullSlug: string, pullRequestId: number | string) =>
  `${repositoryFullSlug}:${pullRequestId}`;

export default {
  clearAll() {
    storage.clearAll();
  },
  get(repositoryFullSlug: string, pullRequestId: number | string) {
    return getAll()[buildKey(repositoryFullSlug, pullRequestId)];
  },
  set(
    repositoryFullSlug: string,
    pullRequestId: number | string,
    lastUpdated: string
  ) {
    const lastViewedMap = getAll();
    lastViewedMap[buildKey(repositoryFullSlug, pullRequestId)] = lastUpdated;
    storage.set(storageKey, lastViewedMap);
  },
};

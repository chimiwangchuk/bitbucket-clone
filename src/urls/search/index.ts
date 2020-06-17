import { Team, User } from 'src/components/types';

import { stringify } from '../utils';

type SearchParams = { accountUuid?: string };

export default {
  api: {
    v20: {
      code(owner: User | Team) {
        return `/2.0/${owner.type}s/${owner.uuid}/search/code`;
      },
    },
  },
  external: {
    docs:
      'https://confluence.atlassian.com/bitbucket/code-search-in-bitbucket-873876782.html',
  },
  ui: {
    search(params?: SearchParams) {
      const { accountUuid }: SearchParams = params || {};
      const url = '/search';
      const query = stringify({ account: accountUuid });
      return `${url}${query}`;
    },
  },
};

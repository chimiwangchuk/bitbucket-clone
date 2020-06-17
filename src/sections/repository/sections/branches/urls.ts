import { get } from 'lodash-es';

import { encodeBranchName } from 'src/urls/utils';
import { Branch } from 'src/components/types';

const urls = {
  api: {
    v10: {
      branchesTags: (owner: string, slug: string) =>
        `/!api/1.0/repositories/${owner}/${slug}/branches-tags`,
    },
    v20: {
      commitStatuses: (owner: string, slug: string, node: string) =>
        `/!api/2.0/repositories/${owner}/${slug}/commit/${node}/statuses`,
    },
  },
  external: {
    branchesEmptyStateLearnHow: 'https://confluence.atlassian.com/x/TwlODQ',
  },
  ui: {
    compareBranch: (
      repositoryFullSlug: string,
      branch: Branch,
      params?: { compareWith?: Branch }
    ) => {
      return `/${repositoryFullSlug}/branches/compare/${encodeBranchName(
        branch.name
      )}..${encodeBranchName(get(params, 'compareWith.name', ''))}`;
    },
  },
};

export default urls;

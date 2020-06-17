import { fetchAction } from 'src/redux/actions';
import urls from 'src/urls/source';

import { FetchFileTree } from './';

export default (repoFullName: string, hash: string, treeId: string) =>
  fetchAction(FetchFileTree, {
    url: urls.api.internal.tree(repoFullName, hash),
    data: {
      repoFullName,
      hash,
      treeId,
    },
  });

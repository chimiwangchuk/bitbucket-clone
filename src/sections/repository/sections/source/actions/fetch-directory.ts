import { fetchAction } from 'src/redux/actions';
import urls from 'src/urls/source';

import { FetchDirectory } from './';

export default (repoFullName: string, hash: string, path: string) =>
  fetchAction(FetchDirectory, {
    url: urls.api.internal.tree(repoFullName, hash, {
      maxDepth: 1,
      path,
    }),
  });

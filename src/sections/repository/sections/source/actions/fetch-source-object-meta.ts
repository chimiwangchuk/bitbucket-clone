import { fetchAction } from 'src/redux/actions';
import urls from 'src/urls/source';

import { FetchSourceObjectMeta } from './';

export default (repoFullName: string, ref: string, path: string) =>
  fetchAction(FetchSourceObjectMeta, {
    url: urls.api.v20.source(repoFullName, ref, path, {
      format: 'meta',
    }),
    fetchOptions: {
      errorType: 'text',
    },
  });

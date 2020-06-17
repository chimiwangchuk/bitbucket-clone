import { Repository } from 'src/components/types';

import { fetchAction } from 'src/redux/actions';
import urls from 'src/urls/source';

import { LoadFileMeta } from './';

export default (repository: Repository, ref: string, path: string) =>
  fetchAction(LoadFileMeta, {
    url: urls.api.v20.source(repository.full_name, ref, path, {
      format: 'meta',
    }),
    fetchOptions: { errorType: 'text' },
  });

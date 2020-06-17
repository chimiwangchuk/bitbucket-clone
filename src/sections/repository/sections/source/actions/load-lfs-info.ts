import { Repository } from 'src/components/types';

import { fetchAction } from 'src/redux/actions';
import urls from 'src/urls/source';

import { LoadLfsInfo } from './';

export default (repository: Repository, ref: string, path: string) =>
  fetchAction(LoadLfsInfo, {
    url: urls.api.internal.lfsInfo(repository.full_name, ref, path),
  });

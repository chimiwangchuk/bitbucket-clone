import { fetchAction } from 'src/redux/actions';

import urls from 'src/urls/source';

import { LoadFileContents } from './';

type Args = {
  // This URL does accept a ref name, but we are caching the response, so this
  // action expects a hash
  hash: string;
};

export default (repositoryFullSlug: string, path: string, { hash }: Args) =>
  fetchAction(LoadFileContents, {
    url: urls.api.v20.source(repositoryFullSlug, hash, path),
    fetchOptions: { responseType: 'text' },
    cache: { ttl: 60 * 60 * 24 },
  });

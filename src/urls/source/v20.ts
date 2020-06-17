import settings from 'src/settings';
import { encodePath, stringify } from '../utils';

const baseUrl = '!api/2.0/repositories';

type Params = {
  format?: 'meta' | 'rendered';
};

export const v20 = {
  fileHistory(
    repositoryFullSlug: string,
    hash: string,
    path: string,
    pageLen = 30
  ) {
    const encodedPath = encodePath(path || '/');
    const query = stringify({
      pagelen: pageLen,
      renames: false,
      fields:
        '+values.commit.message,+values.commit.rendered.message,+values.commit.author.*,+values.commit.date',
    });
    return `/${baseUrl}/${repositoryFullSlug}/filehistory/${hash}/${encodedPath}${query}`;
  },

  source(
    repositoryFullSlug: string,
    ref: string,
    path: string,
    params?: Params
  ) {
    const { format }: Params = params || {};
    const encodedPath = encodePath(path);
    const url = `/${baseUrl}/${repositoryFullSlug}/src/${ref}/${encodedPath}`;
    const query = stringify({ format });
    return `${url}${query}`;
  },

  sourceAbs(repositoryFullSlug: string, ref: string, path: string) {
    const url = v20.source(repositoryFullSlug, ref, path);
    return `${settings.CANON_URL}${url}`;
  },

  buildStatuses(repositoryFullSlug: string, hash: string) {
    return `/${baseUrl}/${repositoryFullSlug}/commit/${hash}/statuses?pagelen=100`;
  },

  downloadRepo(repositoryFullSlug: string, refName: string) {
    const extension = '.zip';
    return `/${repositoryFullSlug}/get/${encodeURIComponent(
      refName
    )}${extension}`;
  },
};

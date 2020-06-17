import { encodePath, stringify } from '../utils';

const baseUrl = '!api/internal/repositories';

type TreeParams = {
  maxDepth?: number;
  path?: string;
};

export const internal = {
  repositoryMetadataURL(repositoryFullSlug: string) {
    return `/${baseUrl}/${repositoryFullSlug}/metadata`;
  },

  lfsInfo(repositoryFullSlug: string, ref: string, path: string) {
    const encodedPath = encodePath(path);
    return `/${baseUrl}/${repositoryFullSlug}/lfs-info-by-path/${ref}/${encodedPath}`;
  },

  tree(repositoryFullSlug: string, ref: string, params?: TreeParams) {
    const { maxDepth = 0, path }: TreeParams = params || {};
    const encodedPath = encodePath(path);
    const url = `/${baseUrl}/${repositoryFullSlug}/tree/${ref}/${encodedPath}`;
    const query = stringify({
      max_depth: maxDepth > 0 ? maxDepth : null,
      no_size: 1,
    });

    return `${url}${query}`;
  },

  sourceWithMetadata(repositoryFullSlug: string, ref: string, path: string) {
    const encodedPath = encodePath(path);
    return `/${baseUrl}/${repositoryFullSlug}/srcdir-with-metadata/${ref}/${encodedPath}`;
  },
};

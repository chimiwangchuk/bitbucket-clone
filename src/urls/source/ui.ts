import { Ref } from 'src/sections/repository/types';
import { RevSpec } from 'src/sections/repository/sections/source/types';

import isRefNameUrlSafe from 'src/sections/repository/sections/source/utils/is-refname-url-safe';

import { safeEncodePath } from 'src/utils/path';
import { encodePath, stringify } from '../utils';

type EditParams = {
  at?: Ref | { name: Ref };
};

type CreateParams = {
  refOrHash?: string;
  path?: string | null | undefined;
  at?: string;
};

type DiffParams = {
  at?: string;
  json?: boolean;
  // due to react router's .push and <Link />
  // perform decodeURI on given paths
  // we need to apply safeEncodePath
  // if this url is used in links
  applyRouterFix?: boolean;
};

type SourceParams = {
  connectEditor?: string;
  connectViewer?: string;
  refOrHash?: string | null | undefined;
  path?: string;
  at?: string;
  // due to react router's .push and <Link />
  // perform decodeURI on given paths
  // we need to apply safeEncodePath
  // if this url is used in links
  applyRouterFix?: boolean;
};

type SourceRefParams = {
  path?: string;
};

export const ui = {
  createFile(repositoryFullSlug: string, params?: CreateParams) {
    const { refOrHash, path, at }: CreateParams = params || {};
    const encodedPath = encodePath(path);

    if (!refOrHash) {
      return `/${repositoryFullSlug}/create-file`;
    }

    const url = `/${repositoryFullSlug}/create-file/${refOrHash}/${encodedPath}`;
    const query = stringify({ at });
    return `${url}${query}`;
  },

  diff(
    repositoryFullSlug: string,
    path: string,
    spec: RevSpec,
    params?: DiffParams
  ) {
    const { at, json, applyRouterFix = true }: DiffParams = params || {};
    const { source, destination } = spec;
    const encodedPath = applyRouterFix
      ? safeEncodePath(path)
      : encodePath(path);
    const url = `/${repositoryFullSlug}/diff/${encodedPath}`;
    const query = stringify({
      at: at || undefined,
      diff1: source,
      diff2: destination,
      json: json || undefined,
    });
    return `${url}${query}`;
  },

  fileHistory(
    repositoryFullSlug: string,
    refOrHash: string,
    path: string,
    params?: { at?: string }
  ) {
    const { at }: { at?: string } = params || {};
    const encodedPath = safeEncodePath(path);
    const url = `/${repositoryFullSlug}/history-node/${refOrHash}/${encodedPath}`;
    const query = stringify({ at });
    return `${url}${query}`;
  },

  lfsAdmin(repositoryFullSlug: string) {
    return `/${repositoryFullSlug}/admin/lfs/file-management/`;
  },

  raw(
    repositoryFullSlug: string,
    refOrHash: string,
    path: string,
    params?: EditParams
  ) {
    const { at }: EditParams = params || {};
    const query = stringify({
      at: at ? at.name : undefined,
    });
    const encodedPath = encodePath(path);
    const url = `/${repositoryFullSlug}/raw/${refOrHash}/${encodedPath}`;
    return `${url}${query}`;
  },

  sourceWithRef(
    repositoryFullSlug: string,
    ref: Ref,
    params?: SourceRefParams
  ) {
    // if the ref contains invalid characters (#, /, %), create a link using
    // the hash and the ?at param
    const { path }: SourceRefParams = params || {};
    const nextParams = isRefNameUrlSafe(ref.name)
      ? {
          path,
          refOrHash: ref.name,
        }
      : {
          path,
          refOrHash: ref.target.hash,
          at: ref.name,
        };

    return ui.source(repositoryFullSlug, nextParams);
  },

  source(repositoryFullSlug: string, params?: SourceParams) {
    const {
      connectEditor,
      connectViewer,
      refOrHash,
      path = '',
      at,
      applyRouterFix = true,
    }: SourceParams = params || {};
    const encodedPath = applyRouterFix
      ? safeEncodePath(path)
      : encodePath(path);
    let url = `/${repositoryFullSlug}/src`;

    if (refOrHash) {
      url += `/${refOrHash}/${encodedPath}`;
    }

    const query = stringify({
      at,
      editor: connectEditor,
      viewer: connectViewer,
    });
    return `${url}${query}`;
  },

  edit(
    repositoryFullSlug: string,
    refOrHash: string,
    path: string,
    params?: EditParams
  ) {
    const { at }: EditParams = params || {};
    const query = stringify({
      mode: 'edit',
      spa: 0,
      at: at ? at.name : undefined,
    });
    const encodedPath = encodePath(path);
    const url = `/${repositoryFullSlug}/src/${refOrHash}/${encodedPath}`;
    return `${url}${query}`;
  },

  blame(
    repositoryFullSlug: string,
    refOrHash: string,
    path: string,
    params?: EditParams
  ) {
    const { at }: EditParams = params || {};
    const query = stringify({
      at: at ? at.name : undefined,
    });
    const encodedPath = encodePath(path);
    const url = `/${repositoryFullSlug}/annotate/${refOrHash}/${encodedPath}`;
    return `${url}${query}`;
  },

  permissions(repositoryFullSlug: string) {
    return `/${repositoryFullSlug}/admin/access`;
  },
};

import { AsyncAction } from './async';

type FetchActionCache = {
  key?: string;
  // How long to cache, in seconds
  ttl: number;
};

type FetchOptions = Partial<RequestInit> & {
  responseType?: 'json' | 'text';
  errorType?: 'json' | 'text';
};

type MetaArguments = {
  url: string;
  fetchOptions?: FetchOptions;
  cache?: FetchActionCache;
  data?: any;
  schema?: any;
  takeLatest?: boolean;
  isRouterResource?: boolean;
  csrftoken?: string;
};

export type StateKey = string | string[];

type FetchActionMeta = MetaArguments & {
  asyncAction: AsyncAction;
  stateKey?: StateKey;
  status?: number;
  isCached?: boolean;
};

export type FetchAction = {
  type: string;
  meta: FetchActionMeta;
  payload?: any;
  error?: true;
};

export function fetchAction(
  action: AsyncAction,
  meta: MetaArguments
): FetchAction {
  return {
    type: action.REQUEST,
    meta: {
      ...meta,
      asyncAction: action,
    },
  };
}

export function hydrateAction(
  action: AsyncAction,
  stateKey: StateKey,
  meta: MetaArguments
): FetchAction {
  return {
    type: action.REQUEST,
    meta: {
      ...meta,
      asyncAction: action,
      stateKey,
    },
  };
}

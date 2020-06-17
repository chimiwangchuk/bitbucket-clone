import { FetchAction } from 'src/redux/actions';
import { Action } from 'src/types/state';

const DEFAULT_TTL = 15;

const SET_CACHE = 'frontbucket/set-cache';
type CacheAction = {
  action: FetchAction;
  cacheKey: string;
  expires: Date;
};
export const setCache = ({ cacheKey, expires, action }: CacheAction) => ({
  type: SET_CACHE,
  payload: action,
  meta: {
    cacheKey,
    expires,
  },
});

export type CacheState = {
  [cacheKey: string]: {
    action: FetchAction;
    expires: number;
  };
};

// @ts-ignore TODO: fix noImplicitAny error here
export const cacheReducer = (state: CacheState = {}, action) => {
  if (!!action.type && action.type === SET_CACHE) {
    // @ts-ignore
    const { cacheKey, expires } = action.meta || {};
    if (!cacheKey || !expires) {
      return state;
    }

    return {
      ...state,
      [cacheKey]: {
        action: action.payload,
        expires,
      },
    };
  }

  return state;
};

function isFetchAction(action: Action): action is FetchAction {
  return (
    !!(action as FetchAction).meta && !!(action as FetchAction).meta.asyncAction
  );
}

function isGetRequest(action: FetchAction) {
  const { fetchOptions } = action.meta;
  if (!fetchOptions) {
    return true;
  }
  if (!fetchOptions.method) {
    return true;
  }
  return fetchOptions.method === 'GET';
}

export const cacheMiddleware = () => ({
  // @ts-ignore TODO: fix noImplicitAny error here
  dispatch,
  // @ts-ignore TODO: fix noImplicitAny error here
  getState,
  // @ts-ignore TODO: fix noImplicitAny error here
}) => next => action => {
  // Narrow the Action type to a FetchAction
  if (!isFetchAction(action)) {
    return next(action);
  }

  if (!isGetRequest(action)) {
    return next(action);
  }

  const state = getState();
  if (!state.global.features['frontbucket-fetch-cache']) {
    return next(action);
  }

  const { asyncAction, url, cache = { ttl: DEFAULT_TTL } } = action.meta;
  const cacheKey = cache.key || url;
  const cached = state.cache[cacheKey];

  if (action.type === asyncAction.REQUEST && cached) {
    if (cached.expires > Date.now()) {
      // There's still a need to dispatch REQUEST action -
      // without it APDEX won't work properly
      // we set `isCached` prop not to make request
      // in saga middleware
      next({
        ...action,
        meta: {
          ...action.meta,
          isCached: true,
        },
      });
      // Return the cached SUCCESS action.
      // However, the same URL could be used for multiple asyncActions, so we
      // should modify our return value to match the requested action
      return next({
        ...cached.action,
        type: asyncAction.SUCCESS,
        meta: {
          ...cached.action.meta,
          asyncAction,
        },
      });
    }
  } else if (action.type === asyncAction.SUCCESS) {
    const expires = new Date(Date.now() + cache.ttl * 1000);
    dispatch(setCache({ action, cacheKey, expires }));
  }

  return next(action);
};

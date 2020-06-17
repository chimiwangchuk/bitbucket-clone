import { useEffect, useReducer } from 'react';
import { Auth, MediaClientConfig } from '@atlaskit/media-core';

// Media tokens expire after 60 minutes
// https://developer.atlassian.com/platform/media/learning/auth/
// ** Media recommends against refreshing tokens via the expiry redirect URL **
const AUTH_EXPIRATION_MS = 3600000; // 60 minutes

export type Props = {
  repositoryFullSlug: string;
};

type MediaAuthApiResponse = {
  authProvider: Auth;
  userAuthProvider: Auth;
  collectionName: string;
};

type MediaAuthState = {
  requestId: number;
  isLoading: boolean;
  hasError: boolean;
  mediaClientConfig: undefined | MediaClientConfig;
  collectionName: null | string;
};

const initState = {
  requestId: 1,
  isLoading: true,
  hasError: false,
  mediaClientConfig: undefined,
  collectionName: null,
};

type SuccessAction = { type: 'success'; payload: MediaAuthApiResponse };
type ErrorAction = { type: 'error' };
type RefreshAction = { type: 'refresh-tokens' };

type MediaAuthAction = RefreshAction | SuccessAction | ErrorAction;

function mediaAuthReducer(state: MediaAuthState, action: MediaAuthAction) {
  switch (action.type) {
    case 'success':
      return {
        ...state,
        isLoading: false,
        hasError: false,
        mediaClientConfig: action.payload.authProvider && {
          authProvider: () => Promise.resolve(action.payload.authProvider),
          userAuthProvider:
            action.payload.userAuthProvider &&
            (() => Promise.resolve(action.payload.userAuthProvider)),
        },
        collectionName: action.payload.collectionName,
      };
    case 'error':
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    case 'refresh-tokens':
      return {
        ...state,
        isLoading: true,
        hasError: false,
        requestId: state.requestId + 1,
      };
    default:
      return state;
  }
}

export function useMediaAuth({ repositoryFullSlug }: Props) {
  const [state, dispatch] = useReducer(mediaAuthReducer, initState);

  useEffect(() => {
    let isCancelled = false;
    const url = `/!api/internal/repositories/${repositoryFullSlug}/media-authorization/`;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        const payload: MediaAuthApiResponse = await res.json();

        if (!isCancelled) {
          dispatch({ type: 'success', payload });
        }
      } catch (e) {
        if (!isCancelled) {
          dispatch({ type: 'error' });
        }
      }
    };

    fetchData();

    // cleanup
    return () => {
      isCancelled = true;
    };
  }, [repositoryFullSlug, state.requestId]);

  useEffect(() => {
    // @ts-ignore TODO: fix noImplicitAny error here
    let timeoutId;
    if (!state.isLoading) {
      timeoutId = setTimeout(() => {
        dispatch({ type: 'refresh-tokens' });
      }, AUTH_EXPIRATION_MS);
    }

    // cleanup
    return () => {
      // @ts-ignore TODO: fix noImplicitAny error here
      if (timeoutId) {
        // @ts-ignore TODO: fix noImplicitAny error here
        clearTimeout(timeoutId);
      }
    };
  }, [state.isLoading]);

  return {
    collectionName: state.collectionName,
    mediaClientConfig: state.mediaClientConfig,
    hasError: state.hasError,
    isLoading: state.isLoading,
  };
}

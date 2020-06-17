// @ts-ignore TODO: fix noImplicitAny error here
import cookie from 'cookie';

import { getDceEnv } from 'src/utils/bb-dce-env';

export const CSRF_COOKIE_NAME = 'csrftoken';
export const CSRF_HEADER_NAME = 'X-CSRFToken';

export const isSameDomain = (url: string) =>
  /^(?!https?:)/.test(url) || url.indexOf(window.location.origin) === 0;

export const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

type Options = Partial<RequestInit> & {
  headers?: Partial<HeadersInit>;
};

export const getRequestHeaders = (
  url: string,
  csrftoken: string = cookie.parse(document.cookie)[CSRF_COOKIE_NAME]
) => {
  const headers: HeadersInit = {
    // Required for Django's request.is_ajax to work properly in some of our legacy views
    'X-Requested-With': 'XMLHttpRequest',

    // Used by RequestMetaMiddleware to identify API requests originating from Frontbucket, for use
    // in analytic events (facts)
    'X-Bitbucket-Frontend': 'frontbucket',
  };

  if (getDceEnv() === 'DCE') {
    headers['X-Bitbucket-Destination'] = 'DCE';
  }

  // never send tokens cross-(sub)domain
  if (isSameDomain(url)) {
    headers[CSRF_HEADER_NAME] = csrftoken;
  }

  return headers;
};

export default function authRequest(url: string, options: Options = {}) {
  const headers = getRequestHeaders(url);

  return new Request(url, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });
}

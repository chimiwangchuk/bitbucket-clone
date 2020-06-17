// @ts-ignore TODO: fix noImplicitAny error here
import cookie from 'cookie';

export const CSRF_COOKIE_NAME = 'csrftoken';
export const CSRF_HEADER_NAME = 'X-CSRFToken';

export const isSameDomain = (url: string) =>
  /^(?!https?:)/.test(url) || url.indexOf(location.origin) === 0;

export type RequestOptionsHeaders = { [key: string]: string };

function authRequest(url: string, options: RequestInit) {
  const headers: RequestOptionsHeaders = {};

  // never send tokens cross-(sub)domain
  if (isSameDomain(url)) {
    headers[CSRF_HEADER_NAME] = cookie.parse(document.cookie)[CSRF_COOKIE_NAME];
  }

  return new Request(url, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

export default authRequest;

// Temporary copy of /src/utils/ssr.ts while feature flag 'connect-iframe-sandbox' is used
// Required as the above util is not an npm package whereas this is.

export const SSR_STATE_KEY = '__ssr_state__';
export const SSR_STATS_KEY = '__ssr_stats__';

/**
 * Gets the state fetched during ssr.
 */
export const getSsrState = () => window[SSR_STATE_KEY] || {};

/**
 * Private constant to make sure we don't need to keep calling Object.keys
 * but we can still mock the public API easily.
 */
const APP_DID_SSR = Object.keys(getSsrState()).length > 0;

/**
 * Public API for determining if the app was rendered on the server.
 */
export const appWasServerSideRendered = () => APP_DID_SSR;

/**
 * Gets hydrated redux store state or initial state depending on if the app was ssr'd or not.
 */
export const getInitialOrBucketState = () =>
  appWasServerSideRendered()
    ? getSsrState().reduxStoreState
    : // eslint-disable-next-line no-restricted-properties
      window.__initial_state__;

import { InitialState } from '../initial-state';
import { BucketState } from '../types/state';

export const SSR_STATE_KEY = '__ssr_state__';
export const SSR_STATS_KEY = '__ssr_stats__';

/**
 * Gets the state fetched during ssr.
 */
export const getSsrState = () => window[SSR_STATE_KEY] || {};

/**
 * Gets the stats for all of the measured services that ran when rendering the app on the server.
 */
// @ts-ignore TODO: fix noImplicitAny error here
export const getSsrStats = () => window[SSR_STATS_KEY] || {};

/**
 * Private constant to make sure we don't need to keep calling Object.keys
 * but we can still mock the public API easily.
 */
const APP_DID_SSR = Object.keys(getSsrState()).length > 0;

export const IS_SERVER = process.env.__SERVER__;

/**
 * Public API for determining if the app was rendered on the server.
 */
export const appWasServerSideRendered = () => APP_DID_SSR;

/**
 * Determines if the app can hydrate from state fetched on the server.
 */
export const canHydrateFromSsr = () => !IS_SERVER && appWasServerSideRendered();

/**
 * Gets hydrated redux store state or initial state depending on if the app was ssr'd or not.
 */
type HydratedState = Partial<BucketState> & {
  global: Partial<Required<InitialState>['global'] & BucketState['global']>;
  [k: string]: any;
};

export const getInitialOrBucketState = (): HydratedState =>
  appWasServerSideRendered()
    ? getSsrState().reduxStoreState
    : // eslint-disable-next-line no-restricted-properties
      window.__initial_state__;

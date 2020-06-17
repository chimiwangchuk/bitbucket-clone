import history from 'src/router/history';
import { isSupportedPath as isAtlaskitRouterPath } from 'src/router/utils/is-supported-path';
import {
  getIsAtlaskitRouterEnabled,
  getIsParcelBundlesEnabled,
  getIsAtlaskitRouterResourcesForDashboardEnabled,
} from 'src/selectors/feature-selectors';
import { BucketState } from '../types/state';
import { getInitialOrBucketState } from './ssr';

type SsrFeatures = {
  isAtlaskitRouterEnabled: boolean;
  isAtlaskitRouterResourcesForDashboardEnabled: boolean;
  shouldCurrentRouteUseAtlaskitRouter: boolean;
  isParcelBundlesEnabled: boolean;
};

/**
 * Internally handles checking SSR state if it exists or window initial state if it does not
 * for flags we need to check outside of the react lifecycle.
 */
export const getSsrFeatures = (): SsrFeatures => {
  const { location } = history;
  const state = getInitialOrBucketState() || {};
  const isAtlaskitRouterEnabled = getIsAtlaskitRouterEnabled(
    state as BucketState
  );
  const shouldCurrentRouteUseAtlaskitRouter =
    isAtlaskitRouterEnabled && isAtlaskitRouterPath(location.pathname);
  const isParcelBundlesEnabled = getIsParcelBundlesEnabled(
    state as BucketState
  );
  const isAtlaskitRouterResourcesForDashboardEnabled = getIsAtlaskitRouterResourcesForDashboardEnabled(
    state as BucketState
  );

  return {
    isAtlaskitRouterEnabled,
    isAtlaskitRouterResourcesForDashboardEnabled,
    shouldCurrentRouteUseAtlaskitRouter,
    isParcelBundlesEnabled,
  };
};

import {
  FF_ATLASKIT_ROUTER_ENABLED,
  FF_ATLASKIT_ROUTER_RESOURCES_DASHBOARD_ENABLED,
} from 'src/router/constants';
import { IS_PARCEL_BUNDLES_ENABLED } from 'src/constants/features';

import { getSsrStats, appWasServerSideRendered } from 'src/utils/ssr';

import initialViewName from 'src/utils/initial-view-name';
import { statsdApiClient } from 'src/utils/metrics';
import { getSsrFeatures } from 'src/utils/ssr-features';
import { isBrowserMonitoringEnabled } from 'src/components/performance-metrics/should-send-metrics';

/**
 * Convert performance.timing values to be relative to
 * the initiating event (performance.timing.navigationStart)
 */
function getNormalizedTimings() {
  const normalized = {};
  const { timing } = window.performance;
  const { navigationStart } = timing;

  // The performance.timing object inherits its properties
  for (const timingKey in timing) {
    // Take only the timing values, no functions.
    // @ts-ignore TODO: fix noImplicitAny error here
    if (typeof timing[timingKey] === 'number') {
      // @ts-ignore TODO: fix noImplicitAny error here
      normalized[`performance.${timingKey}`] =
        // Note: some values will be zero, so we just copy those
        // @ts-ignore TODO: fix noImplicitAny error here
        timing[timingKey] ? timing[timingKey] - navigationStart : 0;
    }
  }

  // Putting back the original navigationStart value.
  // Don't want to normalize the base timing point.
  // @ts-ignore TODO: fix noImplicitAny error here
  normalized['performance.navigationStart'] = navigationStart;

  return normalized;
}

function initPerformanceTimingMetrics() {
  const {
    isAtlaskitRouterEnabled,
    isAtlaskitRouterResourcesForDashboardEnabled,
    isParcelBundlesEnabled,
  } = getSsrFeatures();

  const featureFlagsToTrack = [
    {
      name: FF_ATLASKIT_ROUTER_ENABLED,
      value: isAtlaskitRouterEnabled,
    },
    {
      name: FF_ATLASKIT_ROUTER_RESOURCES_DASHBOARD_ENABLED,
      value: isAtlaskitRouterResourcesForDashboardEnabled,
    },
    {
      name: IS_PARCEL_BUNDLES_ENABLED,
      value: isParcelBundlesEnabled,
    },
  ];

  window.addEventListener('load', () => {
    const stats = { ...getNormalizedTimings(), ...getSsrStats() };

    function sendTimings() {
      if (document.hidden || !window.performance.okayToSendMetrics) {
        return;
      }

      statsdApiClient.histogram(stats, {
        tags: [
          'source:frontbucket',
          `loadType:full_page`,
          `view_name:${initialViewName}`,
          ...featureFlagsToTrack.map(({ name, value }) => `${name}:${value}`),
          `appWasServerSideRendered:${appWasServerSideRendered()}`,
        ],
      });
    }

    // Using setTimeout to make sure this executes after load
    // event callbacks have finished firing (so that
    // 'performance.timing.loadEventEnd' will have a value)
    setTimeout(sendTimings, 0);
  });
}

if (window.performance.okayToSendMetrics && isBrowserMonitoringEnabled()) {
  initPerformanceTimingMetrics();
}

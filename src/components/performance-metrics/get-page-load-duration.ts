import * as Sentry from '@sentry/browser';
import { shouldSendMetrics } from './should-send-metrics';
import { getPageLoadType } from './get-page-load-type';

// One minute max
const METRICS_MAX_TIME = 60000;

/**
 * Send a metric with the extra metadata of the page load type
 * Note: This has side effects - it gets both the timing info and sets marks and measures
 * (but then clears them from the performance.timing entries)
 *
 * @param metricName - The name of the metric to identify it in analytics dashboards
 * @param customStartEvent - The event to start measuring from, defaults to requestStart
 * @param customEndEvent - A specific performance mark entry name that can be used to override the end time - used for measuring marks from SSR
 */
export function getPageLoadDuration(
  metricName: string,
  customStartEvent?: keyof PerformanceTiming,
  customEndEvent?: string
): null | number {
  let startEvent;

  if (!shouldSendMetrics()) {
    return null;
  }

  // Set the end time for the current metric immediately
  const { performance } = window;
  performance.mark('ENDTIME');

  // For ease of reading in Dev Tools performance profiling
  const metricNameUppercase = metricName.toUpperCase();

  const loadType = getPageLoadType();
  if (!loadType) {
    return null;
  }

  // Determine where to measure from
  if (customStartEvent) {
    startEvent = customStartEvent;
  } else if (loadType === 'client_side_routing') {
    startEvent = 'ROUTECHANGE';
  } else {
    startEvent = 'requestStart';
  }

  const endEvent = customEndEvent || 'ENDTIME';

  performance.measure(metricNameUppercase, startEvent, endEvent);

  const measures = performance.getEntriesByName(metricNameUppercase, 'measure');

  performance.clearMarks('ENDTIME');
  performance.clearMeasures(metricNameUppercase);

  // There should only ever be one measure matching
  // the metricNameUppercase name.  If there's not
  // exactly one, something's gone wrong so don't
  // send a metric.
  if (measures.length !== 1) {
    Sentry.withScope(scope => {
      scope.setTag('metricName', metricName);
      scope.setTag('loadType', loadType);
      Sentry.captureMessage('METRIC_MEASURE_MISSING');
    });
    return null;
  }

  const { duration } = measures[0];

  // Exclude outliers
  if (Number.isNaN(duration) || duration < 0 || duration > METRICS_MAX_TIME) {
    Sentry.withScope(scope => {
      scope.setTag(metricName, `${duration}`);
      scope.setTag('METRICS_MAX_TIME', `${METRICS_MAX_TIME}`);
      Sentry.captureMessage('METRIC_OUTLIER');
    });

    return null;
  }

  return duration;
}

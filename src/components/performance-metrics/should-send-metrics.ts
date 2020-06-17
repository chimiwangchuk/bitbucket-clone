import { getInitialOrBucketState } from 'src/utils/ssr';

/**
 * Note: The flag 'window.performance.okayToSendMetrics' is
 * set inside 'performance-timing-init.jinja' in Backbucket.
 */

export const isBrowserMonitoringEnabled = () => {
  const state = getInitialOrBucketState();

  return state && state.global
    ? !!state.global.browser_monitoring || !!state.global.browserMonitoring
    : false;
};

export function shouldSendMetrics() {
  // eslint-disable-next-line @typescript-eslint/camelcase
  const { performance } = window;

  // There's a switch in Django to turn of metrics
  const browserMonitoringSwitchEnabled = isBrowserMonitoringEnabled();
  if (!browserMonitoringSwitchEnabled) {
    return false;
  }

  // Guard for old browsers, e.g. Safari <= v10, to avoid polluting Sentry with errors
  if (typeof performance.mark !== 'function') {
    return false;
  }

  // Block sending a metric if tab has been backgrounded
  if (document.hidden || !performance.okayToSendMetrics) {
    return false;
  }

  return true;
}

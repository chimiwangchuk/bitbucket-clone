import { shouldSendMetrics } from './should-send-metrics';

type PageLoadType = 'full_page' | 'client_side_routing';
/**
 * Returns whether the page load a whole page load or a SPA transition
 */
export function getPageLoadType(): PageLoadType | null {
  if (!shouldSendMetrics()) {
    return null;
  }

  // Existence of a ROUTECHANGE event means it was a SPA transition
  const { performance } = window;
  const marks = performance.getEntriesByName('ROUTECHANGE', 'mark');

  // No ROUTECHANGE exists: it's a whole page load
  if (marks.length === 0) {
    return 'full_page';

    // One ROUTECHANGE exists: SPA transition
  } else if (marks.length === 1) {
    return 'client_side_routing';
  }

  // Multiple ROUTECHANGE events exist: somethings's gone wrong.
  // Prevent pollution of analytics by blocking sending of the metrics.
  return null;
}

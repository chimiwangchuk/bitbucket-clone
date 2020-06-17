import initialViewName from 'src/utils/initial-view-name';
import { statsdApiClient } from 'src/utils/metrics';
import { getPageLoadDuration } from './get-page-load-duration';
import { getPageLoadType } from './get-page-load-type';
import { shouldSendMetrics } from './should-send-metrics';

export function sendPageLoadMetric(
  metricName: string,
  customStartEvent?: keyof PerformanceTiming
) {
  if (!shouldSendMetrics()) {
    return;
  }

  const loadType = getPageLoadType();
  const duration = getPageLoadDuration(metricName, customStartEvent);

  if (!duration || !loadType) {
    return;
  }

  const tags = ['source:frontbucket', `loadType:${loadType}`];

  if (loadType === 'full_page') {
    tags.push(`view_name:${initialViewName}`);
  }

  statsdApiClient.histogram({ [metricName]: duration }, { tags });
}

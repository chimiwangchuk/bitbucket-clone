import initialViewName from 'src/utils/initial-view-name';
import { statsdApiClient } from 'src/utils/metrics';
import { appWasServerSideRendered } from 'src/utils/ssr';
import { getPageLoadDuration } from './get-page-load-duration';
import { getPageLoadType } from './get-page-load-type';
import { shouldSendMetrics } from './should-send-metrics';

// @ts-ignore TODO: fix noImplicitAny error here
const buildCustomTags = customTags =>
  customTags
    ? customTags.map(({ namespace, tag }: any) => `${namespace}:${tag}`)
    : [];

export function sendPageLoadMetricWithCustomTags({
  metricName,
  customStartEvent,
  customTags,
  customEndEvent,
}: {
  metricName: string;
  customStartEvent?: keyof PerformanceTiming;
  customTags?: Array<{ namespace: string; tag: string }>;
  customEndEvent?: string;
}) {
  if (!shouldSendMetrics()) {
    return;
  }

  const loadType = getPageLoadType();
  const duration = getPageLoadDuration(
    metricName,
    customStartEvent,
    customEndEvent
  );

  if (!duration || !loadType) {
    return;
  }

  const tags = [
    'source:frontbucket',
    `loadType:${loadType}`,
    `appWasServerSideRendered:${appWasServerSideRendered()}`,
  ];

  if (loadType === 'full_page') {
    tags.push(`view_name:${initialViewName}`);
  }

  statsdApiClient.histogram(
    { [metricName]: duration },
    { tags: [...tags, ...buildCustomTags(customTags)] }
  );
}

export function sendPageLoadMetricWithFeatureFlags({
  metricName,
  customStartEvent,
  featureFlags,
  customEndEvent,
}: {
  metricName: string;
  customStartEvent?: keyof PerformanceTiming;
  featureFlags: Array<{ name: string; isEnabled: boolean }>;
  customEndEvent?: string;
}) {
  const customTags = featureFlags.map(({ name, isEnabled }) => ({
    namespace: name,
    tag: isEnabled.toString(),
  }));

  sendPageLoadMetricWithCustomTags({
    metricName,
    customStartEvent,
    customTags,
    customEndEvent,
  });
}

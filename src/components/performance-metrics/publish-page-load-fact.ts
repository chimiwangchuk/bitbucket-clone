import Fact from '@atlassian/bitkit-analytics';
import { publishFact } from 'src/utils/analytics/publish';
import { getPageLoadDuration } from './get-page-load-duration';
import { getPageLoadType } from './get-page-load-type';
import { shouldSendMetrics } from './should-send-metrics';

export function publishPageLoadFact(
  factName: string,
  FactClass: Fact<any>,
  customStartEvent?: keyof PerformanceTiming,
  extraFactData?: object
) {
  if (!shouldSendMetrics()) {
    return;
  }

  const loadType = getPageLoadType();
  const duration = getPageLoadDuration('factMetric', customStartEvent);
  if (!loadType || !duration) {
    return;
  }

  const factData = {
    duration: Math.ceil(duration),
    load_type: loadType,
    ...extraFactData,
  };

  // @ts-ignore
  publishFact(new FactClass(factName, factData));
}

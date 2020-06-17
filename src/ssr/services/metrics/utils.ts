import { appWasServerSideRendered } from 'src/utils/ssr';
import { Metrics, RenderServiceOutput, Stats } from '../../common/types';
import {
  DEFAULT_PERFORMANCE_MARK_NAMESPACE,
  PERFORMANCE_MARK_SSR_HTML,
} from './constants';

/**
 * Higher order function that standardises the measuring of service functionality.
 *
 */
export const withMetrics = <A = any>(service: Function) => async (
  ...args: A[]
): Promise<Metrics> => {
  const start = Date.now();
  const result = await service(...args);
  const end = Date.now();
  const total = end - start;

  return { start, end, total, result };
};

/**
 * Creates an object of all SSR metrics totals.
 *
 */
export const getMetricsTotals = (renderOutput: RenderServiceOutput): Stats =>
  (Object.keys(renderOutput) as Array<keyof typeof renderOutput>).reduce(
    (acc, key) => {
      if (renderOutput[key]) {
        const { total } = renderOutput[key];

        acc[key] = total;
        acc.total += total;
      }

      return acc;
    },
    { state: 0, html: 0, styles: 0, prewarm: 0, total: 0 }
  );

/**
 * Gets the entry name for an SSR performance mark entry.
 */
export const getSsrPerformanceMarkEntryName = (
  name: string,
  namespace = DEFAULT_PERFORMANCE_MARK_NAMESPACE
): string => `SSR_${namespace}_${name}`;

/**
 * If the app was server-side rendered, gets the entry name for the performance mark entry representing page load end.
 */
export const getSsrPageLoadMarkEntryName = (
  namespace = DEFAULT_PERFORMANCE_MARK_NAMESPACE
): string | undefined => {
  if (appWasServerSideRendered()) {
    return getSsrPerformanceMarkEntryName(PERFORMANCE_MARK_SSR_HTML, namespace);
  }
  return undefined;
};

/**
 * Creates a script tag that contains a performance mark
 *
 */
export const createPerformanceMarkScript = (
  name: string,
  nonce: string,
  namespace = DEFAULT_PERFORMANCE_MARK_NAMESPACE
): string =>
  `<script nonce="${nonce}" data-defer-skip>window.performance && window.performance.mark("${getSsrPerformanceMarkEntryName(
    name,
    namespace
  )}")</script>`;

import {
  Metric,
  ObjectMap,
  StatsdApiClientOptions,
  StatsdCounterData,
  StatsdData,
  StatsdOptions,
  StatsdPayload,
} from './types';
import timedBatch from './utils/timed-batch';

function extractSampleRate(options: StatsdOptions = {}): number {
  return typeof options.sampleRate === 'number' ? options.sampleRate : 1;
}

function normalizeCounterData(data: StatsdCounterData): ObjectMap<number> {
  if (typeof data === 'string') {
    return { [data]: 1 };
  } else if (Array.isArray(data)) {
    return data.reduce((acc, v) => ({ ...acc, [v]: 1 }), {});
  }

  return data;
}

/**
 * This simulates the same sampling that datadog's statsd agent performs,
 * while obviating the need to send all metrics to the server, only to
 * have them filtered out by the sample rate, i.e. no-ops.
 * See: https://github.com/DataDog/dd-agent/blob/331c507f164ec7bd256a32beb3889d4fafb0ba7e/aggregator.py#L205
 */
function amplifySamples(
  data: ObjectMap<number>,
  sampleRate: number
): ObjectMap<number> {
  const amplifiedData = {};
  Object.keys(data).forEach(k => {
    // @ts-ignore TODO: fix noImplicitAny error here
    amplifiedData[k] = data[k] * Math.floor(1 / sampleRate);
  });
  return amplifiedData;
}

export default class StatsdApiClient {
  authRequest: { url: string; init: RequestInit };
  options: StatsdApiClientOptions;

  addToApiBatch = timedBatch(this.post.bind(this), { timeout: 1000 });

  constructor(
    authRequest: { url: string; init: RequestInit },
    options: StatsdApiClientOptions = {}
  ) {
    this.authRequest = authRequest;
    this.options = options;
  }

  post(data: StatsdPayload | Array<StatsdPayload>) {
    if (this.authRequest) {
      fetch(this.authRequest.url, {
        method: 'POST',
        body: JSON.stringify(data),
        ...this.authRequest.init,
      })
        .then(response => (response.ok ? response.json() : Promise.reject()))
        .catch(e => {
          // Only handle exceptions for now (continue ignoring non-2XX responses)
          if (e && this.options.onError) {
            this.options.onError(e);
          }
        });
    }
  }

  sendMetric(
    metric: Metric,
    data: StatsdData,
    options: StatsdOptions = {}
  ): boolean {
    const sampleRate = extractSampleRate(options);
    const include = Math.random() < sampleRate;

    if (include) {
      const payload = { data, metric, tags: options.tags || [] };

      if (options.eager) {
        this.post(payload);
      } else {
        // This simulates the same sampling that datadog's statsd agent performs,
        // while obviating the need to send all metrics to the server, only to
        // have them filtered out by the sample rate, i.e. no-ops.
        // See: https://github.com/DataDog/dd-agent/blob/331c507f164ec7bd256a32beb3889d4fafb0ba7e/aggregator.py#L205
        this.addToApiBatch(payload);
      }
    }

    return include;
  }

  event(title: string, text: string, options?: StatsdOptions) {
    return this.sendMetric('event', { title, text }, options);
  }

  increment(data: StatsdCounterData, options?: StatsdOptions) {
    const amplifiedData = amplifySamples(
      normalizeCounterData(data),
      extractSampleRate(options)
    );
    return this.sendMetric('increment', amplifiedData, options);
  }

  decrement(data: StatsdCounterData, options?: StatsdOptions) {
    const amplifiedData = amplifySamples(
      normalizeCounterData(data),
      extractSampleRate(options)
    );
    return this.sendMetric('decrement', amplifiedData, options);
  }

  gauge(data: ObjectMap<number>, options?: StatsdOptions) {
    return this.sendMetric('gauge', data, options);
  }

  histogram(data: ObjectMap<number>, options?: StatsdOptions) {
    return this.sendMetric('histogram', data, options);
  }

  set(data: ObjectMap<number | string>, options?: StatsdOptions) {
    return this.sendMetric('set', data, options);
  }
}

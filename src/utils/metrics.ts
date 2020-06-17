import StatsdApiClient from '@atlassian/bitbucket-metrics';
import settings from 'src/settings';
import { captureExceptionWithTags } from 'src/utils/sentry';

const onError = (e: Error) =>
  captureExceptionWithTags(e, { component: 'metrics' });

const request = {
  url: `${settings.API_CANON_URL}/internal/metrics/statsd/`,
  init: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

export const statsdApiClient = new StatsdApiClient(request, { onError });

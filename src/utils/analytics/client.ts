import { connect } from 'react-redux';
import {
  AnalyticsClientManager,
  createAnalyticsClient,
} from '@atlassian/bitkit-analytics';
import locale from 'src/locale';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { BbEnv, getBbEnv } from 'src/utils/bb-env';
import { BucketState } from 'src/types/state';

let globalAnalyticsClient: any = null;

const initAnalyticsClient = () => {
  const hashMeta =
    document.querySelector('meta[name="bitbucket-commit-hash"]') ||
    document.querySelector('meta[name="bb-commit-hash"]'); // This "bb-commit-hash" can be removed after backbucket deploys the meta tag change
  const hash = hashMeta ? hashMeta.getAttribute('content') : null;
  const env = getBbEnv();

  globalAnalyticsClient = createAnalyticsClient(
    env || BbEnv.Development,
    hash || 'unknown-version',
    locale.locale
  );

  // Get the current user anonymousId. If the "ajs_anonymous_id" cookie is not
  // set yet, this will set it. We currently use it in the backend for track
  // events. See docs: https://segment.com/docs/sources/website/analytics.js/#retrieving-the-anonymous-id
  // We can remove this if we ever switch to sending track events with the
  // client directly.

  // eslint-disable-next-line no-underscore-dangle
  globalAnalyticsClient._analytics.user().anonymousId();
};

/**
 * Get the analytics client, initializing it if it's the first time this
 * function is called.
 */
export const analyticsClient = (): any => {
  if (!globalAnalyticsClient) {
    initAnalyticsClient();
  }

  return globalAnalyticsClient;
};

const mapStateToProps = (state: BucketState) => {
  const user = getCurrentUser(state);
  return { user };
};

// @ts-ignore TODO: fix noImplicitAny error here
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  analyticsClient: analyticsClient(),
  ...ownProps,
});

export const AnalyticsClientInit = connect(
  mapStateToProps,
  null,
  mergeProps
)(AnalyticsClientManager);

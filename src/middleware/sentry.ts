import * as Sentry from '@sentry/browser';
// @ts-ignore TODO: fix noImplicitAny error here
import createSentryMiddleware from 'redux-sentry-middleware';

const sentryMiddleware = createSentryMiddleware(Sentry, {
  // This controls what gets set as `extra.lastAction` on each Sentry error event
  // We only record the action "type" to avoid leaking PII
  // @ts-ignore TODO: fix noImplicitAny error here
  actionTransformer: action => action.type,
  // This controls what gets set as `extra.state` on each Sentry error event
  // We omit this data entirely (for now) to avoid leaking PII
  stateTransformer: () => 'INTENTIONALLY_REMOVED',
});

export default sentryMiddleware;

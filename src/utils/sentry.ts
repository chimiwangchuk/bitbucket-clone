import * as Sentry from '@sentry/browser';

export const captureExceptionWithTags = (
  e: Error,
  tags: { [tagName: string]: string }
) => {
  Sentry.withScope(scope => {
    Object.keys(tags).forEach(key => {
      scope.setTag(key, tags[key]);
    });
    Sentry.captureException(e);
  });
};

export async function captureMessageForResponse(
  response: Response,
  message: string
) {
  const { status } = response;
  // @ts-ignore TODO: fix noImplicitAny error here
  let body;
  try {
    body = await response.text();
  } catch (e) {
    body = '';
  }

  Sentry.withScope(scope => {
    // Error body is extremely useful to be able to diagnose a problem. We don't
    // want it in the message because we don't want slightly different responses
    // to break grouping.
    // @ts-ignore TODO: fix noImplicitAny error here
    scope.setExtra('response', body);
    const messageWithStatus = `${message}: status ${status}`;
    // By default, Sentry groups similar messages (e.g. when only the status changes).
    // Disable that for this, we want to group by status.
    scope.setFingerprint([messageWithStatus]);
    // We tried captureException here to have a file path, but the exception
    // stack trace is weird because this is in an async function.
    Sentry.captureMessage(messageWithStatus);
  });
}

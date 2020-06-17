import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

if (window.__sentry__) {
  const config = window.__sentry__ as Sentry.BrowserOptions;

  const blacklistUrls = [
    ...(config.blacklistUrls || []),
    /localhost:3000/,
    // This isn't covered by Sentry's built-in browser extension detection, for some reason
    /^chrome-extension:\/\//i,
  ];

  const ignoreErrors = [
    ...(config.ignoreErrors || []),
    /**
     * This covers 2 separate exceptions that we see but are out of our control:
     *
     * - "TypeError: Failed to construct 'Request': Request cannot be constructed from a URL that includes credentials: <url>"
     * - "TypeError: Failed to execute 'fetch' on 'Window': Request cannot be constructed from a URL that includes credentials: <url>"
     *
     * We don't ever build URLs that include a username and password in them, so these are likely caused by browser extensions,
     * bookmarklets, a user script, etc. The 3rd party code itself could be constructing `Request` objects or making `fetch` requests
     * with URLs containing credentials, overriding the native behavior of `fetch`, or even navigating to a Bitbucket page with
     * credentials inserted. `fetch` requests to relative URLs carry over the username and password used on the current page rather than
     * dropping them, which could inadvertently add those to the `fetch` requests our code tries to make.
     */
    'Request cannot be constructed from a URL that includes credentials',
    // (likely) Caused by ad-blocking in Firefox (only occurs for requests made to our metrics endpoint)
    'AbortError: The operation was aborted',
    // (likely) Caused by ad-blocking in IE11 (only occurs for requests made to our metrics endpoint)
    'Network request failed',
    // Caused by ad-blocking in Firefox
    'NetworkError when attempting to fetch resource',
    // Caused by ad-blocking in Safari and Edge
    'Resource blocked by content blocker',
    /**
     * This is thrown by `window.fetch`, but not for non-2XX responses. It's only thrown when fetch itself breaks, which could be
     * caused by:
     *
     *   - DNS issues
     *   - Bad HTTP headers
     *   - Malformed URL
     *   - The request was aborted by the browser (user navigates to another page before the request completes)
     *   - The request was blocked by an extension (i.e., an ad-blocker)
     *
     * Source: https://stackoverflow.com/questions/45383874/fetch-api-yields-typeerror-failed-to-fetch/47423883#47423883
     *
     * As of the date this comment was written, 97% of these errors are caused by requests to our metrics endpoint. This rules out
     * the first 3. The 4th is unlikely because it's not a slow request to make, which leaves ad-blocking as the most likely
     * source.
     */
    'Failed to fetch',
  ];

  const nrWrapperPattern = /\bnrWrapper\b/;

  const rewriteFrames = new Integrations.RewriteFrames({
    iteratee: frame => {
      // 'nrWrapper' is from NewRelic and in the stack trace, it would show up with the filename being the current URL
      // (including things like the repository slug). That meant that every stack trace was different, breaking Sentry's
      // grouping of errors. So rewrite those frames to fix that, see https://github.com/getsentry/sentry/issues/7709
      if (frame.function && nrWrapperPattern.test(frame.function)) {
        frame.filename = '?';
        frame.lineno = 0;
        frame.colno = 0;
        frame.in_app = false;
      }
      return frame;
    },
  });

  Sentry.init({
    ...config,
    release: process.env.FRONTBUCKET_SENTRY_RELEASE,
    blacklistUrls,
    ignoreErrors,
    integrations: [
      new Integrations.Dedupe(),
      new Integrations.ExtraErrorData(),
      rewriteFrames,
    ],
  });
}

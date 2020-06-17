/**
 * Based on Confluence's error boundary code:
 * https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/browse/packages/confluence-shared-components/src/ErrorBoundary/ErrorBoundaryComponent.js
 *
 * Wrap this component around pieces of functionality to limit the blast radius of an error.
 */
import React, { PureComponent, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Sentry from '@sentry/browser';
import Button from '@atlaskit/button';
import * as styles from './global-error-boundary.style';
import messages from './global-error-boundary.i18n';
import globalErrorImageUrl from './global-error-image.svg';

type GlobalErrorBoundaryProps = {
  children: ReactNode;
};

type GlobalErrorBoundaryState = {
  hasError: boolean;
};

export class GlobalErrorBoundary extends PureComponent<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  // handles fallback rendering only and does not allow side-effects
  // @ts-ignore TODO: fix noImplicitAny error here
  static getDerivedStateFromError(error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return {
      hasError: true,
    };
  }

  state = {
    hasError: false,
  };

  // recommended method for side effects
  // @ts-ignore TODO: fix noImplicitAny error here
  componentDidCatch(error) {
    Sentry.captureException(error);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (!hasError) {
      return children;
    }

    return (
      <styles.ErrorPage>
        <styles.Center>
          <styles.ErrorImage>
            <img
              alt={messages.alertSymbol.defaultMessage}
              src={globalErrorImageUrl}
            />
          </styles.ErrorImage>

          <FormattedMessage {...messages.notice} tagName="p" />

          <FormattedMessage
            {...messages.keepsHappening}
            values={{
              supportResourcesLink: (
                <a href="https://support.atlassian.com/bitbucket-cloud/">
                  <FormattedMessage {...messages.supportResourcesLink} />
                </a>
              ),
            }}
            tagName="p"
          />

          <styles.TryAgainButton>
            <Button onClick={() => window.location.reload(true)}>
              <FormattedMessage {...messages.tryAgainButton} />
            </Button>
          </styles.TryAgainButton>
        </styles.Center>
      </styles.ErrorPage>
    );
  }
}

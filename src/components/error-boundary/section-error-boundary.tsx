import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import SectionMessage from '@atlaskit/section-message';
import * as Sentry from '@sentry/browser';

import messages from './section-error-boundary.i18n';
import * as styles from './section-error-boundary.style';

type Props = {
  intl: InjectedIntl;
  sectionHeading?: JSX.Element;
};

type State = {
  hasError: boolean;
};

export const SectionErrorBoundary = injectIntl(
  class extends PureComponent<Props, State> {
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

    // @ts-ignore TODO: fix noImplicitAny error here
    componentDidCatch(error) {
      Sentry.captureException(error);
    }

    render() {
      const { hasError } = this.state;
      const { children, intl, sectionHeading } = this.props;

      if (!hasError) {
        return children;
      }

      return (
        <styles.SectionErrorContainer>
          {sectionHeading}
          <SectionMessage
            appearance="error"
            title={intl.formatMessage(messages.title)}
          >
            <styles.SectionMessageContainer>
              <FormattedMessage
                {...messages.keepsHappening}
                values={{
                  supportResourcesLink: (
                    <styles.SupportResourcesLink href="https://support.atlassian.com/bitbucket-cloud/">
                      <FormattedMessage {...messages.supportResourcesLink} />
                    </styles.SupportResourcesLink>
                  ),
                  tryAgainLink: (
                    <styles.TryAgainLink
                      onClick={() => window.location.reload(true)}
                      appearance="link"
                      spacing="none"
                    >
                      <FormattedMessage {...messages.tryAgainLink} />
                    </styles.TryAgainLink>
                  ),
                  ifThisKeepsHappening: (
                    <styles.TextContainer>
                      <FormattedMessage {...messages.ifThisKeepsHappening} />
                    </styles.TextContainer>
                  ),
                  or: (
                    <styles.TextContainer>
                      <FormattedMessage {...messages.or} />
                    </styles.TextContainer>
                  ),
                }}
                tagName="p"
              />
            </styles.SectionMessageContainer>
          </SectionMessage>
        </styles.SectionErrorContainer>
      );
    }
  }
);

import React, { PureComponent } from 'react';
import { Modal } from '@atlaskit/onboarding';
import { connect } from 'react-redux';
import { FormattedMessage, InjectedIntl, injectIntl } from 'react-intl';
import { BucketState } from 'src/types/state';
import isMobile from 'src/utils/is-mobile';
import authRequest from 'src/utils/fetch';
import {
  publishScreenEvent,
  publishUiEvent,
} from 'src/utils/analytics/publish';
import messages from './terms-and-conditions.i18n';
import tosImage from './termsofservice_modalimage.png';

type Props = {
  intl: InjectedIntl;
  showTermsAndConditions: boolean;
};

type State = {
  hasTriggered: boolean;
  active: boolean;
};

// @ts-ignore TODO: fix noImplicitAny error here
function publishEvent(actionSubjectId) {
  publishUiEvent({
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId,
    source: 'termsAndConditionsModal',
  });
}

export class TermsAndConditionsModal extends PureComponent<Props, State> {
  state = { active: true, hasTriggered: false };

  componentDidMount() {
    this.publishScreenEvent();
  }

  componentDidUpdate() {
    this.publishScreenEvent();
  }

  publishScreenEvent() {
    if (
      this.props.showTermsAndConditions &&
      this.state.hasTriggered === false
    ) {
      this.setState({ hasTriggered: true });
      publishScreenEvent('termsAndConditionsModal');
    }
  }

  submit = async () => {
    try {
      await fetch(
        authRequest('/!api/internal/user/consent', {
          method: 'POST',
          body: JSON.stringify(['termsOfService']),
        })
      );
    } catch (e) {
      // Silently fail for now
    }

    publishEvent('acceptButton');
    this.setState({ active: false });
  };

  snooze = async () => {
    try {
      await fetch(
        authRequest('/!api/internal/user/terms/snooze', { method: 'POST' })
      );
    } catch (e) {
      // Silently fail for now
    }

    publishEvent('dismissButton');
    this.setState({ active: false });
  };

  render() {
    const { active } = this.state;
    const { intl, showTermsAndConditions } = this.props;

    if (!showTermsAndConditions || !active) {
      return null;
    }

    const termsLink = (
      <a
        href="https://www.atlassian.com/legal/cloud-terms-of-service"
        target="_blank"
      >
        {intl.formatMessage(messages.link)}
      </a>
    );

    const summaryLink = (
      <a
        href="https://www.atlassian.com/legal/summary-of-changes"
        target="_blank"
      >
        {intl.formatMessage(messages.summaryLink)}
      </a>
    );

    return (
      <Modal
        actions={[
          {
            onClick: this.submit,
            text: intl.formatMessage(messages.agree),
          },
          {
            onClick: this.snooze,
            text: intl.formatMessage(messages.remindMeLater),
          },
        ]}
        heading={intl.formatMessage(messages.title)}
        image={tosImage}
      >
        <FormattedMessage
          {...messages.description}
          values={{ termsLink, summaryLink }}
        />
      </Modal>
    );
  }
}

const mapStateToProps = (state: BucketState) => ({
  showTermsAndConditions: !!state.global.needsTermsAndConditions && !isMobile(),
});

export default connect(mapStateToProps)(injectIntl(TermsAndConditionsModal));

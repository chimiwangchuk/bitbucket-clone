import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntl } from 'react-intl';
import Flag from '@atlaskit/flag';
import Spinner from '@atlaskit/spinner';
import Info from '@atlaskit/icon/glyph/info';
import { colors } from '@atlaskit/theme';
import toggleMarketingConsentNeeded from 'src/redux/global/actions/marketing-consent';
import authRequest from 'src/utils/fetch';
import { ComponentFlagProps } from 'src/redux/flags/types';
import { BucketState } from 'src/types/state';
import messages from './marketing-consent.i18n';
import * as styles from './marketing-consent-flag.style';

type MarketingConsentFlagProps = ComponentFlagProps & {
  intl: InjectedIntl;
  geoipCountry: string;
  onDismissed: (id: string) => void;
};

type MarketingConsentFlagState = {
  isSubmitting: boolean;
  submitFailed: boolean;
};

export class MarketingConsentFlag extends PureComponent<
  MarketingConsentFlagProps,
  MarketingConsentFlagState
> {
  state = {
    isSubmitting: false,
    submitFailed: false,
  };

  submitConsent = (consent: boolean) => async () => {
    const {
      geoipCountry,
      intl: { formatMessage },
    } = this.props;
    const { isSubmitting } = this.state;
    if (isSubmitting) {
      return;
    }

    this.setState({ isSubmitting: true });

    try {
      const resp = await fetch(
        authRequest('/!api/internal/user/marketing_consent', {
          method: 'POST',
          body: JSON.stringify({
            marketing_consent: consent,
            marketing_consent_locale: geoipCountry,
            marketing_consent_verbiage: formatMessage(
              messages.marketingConsentDescription
            ),
          }),
        })
      );

      if (resp.ok) {
        this.closeFlag();
      } else {
        this.showErrorMessage();
      }
    } catch (error) {
      this.showErrorMessage();
    }
  };

  showErrorMessage = () => {
    this.setState({
      isSubmitting: false,
      submitFailed: true,
    });
  };

  closeFlag = () => {
    toggleMarketingConsentNeeded(false);
    this.props.onDismissed(this.props.id);
  };

  render() {
    const {
      geoipCountry,
      intl: { formatMessage },
      ...flagProps
    } = this.props;
    const { isSubmitting, submitFailed } = this.state;

    return (
      <styles.FlagWrapper>
        <Flag
          appearance="normal"
          title={
            submitFailed
              ? formatMessage(messages.marketingConsentFailedTitle)
              : formatMessage(messages.marketingConsentTitle)
          }
          description={
            submitFailed
              ? formatMessage(messages.marketingConsentSubmitFailedDescription)
              : formatMessage(messages.marketingConsentDescription)
          }
          icon={
            isSubmitting ? (
              <Spinner size="small" />
            ) : (
              <Info label="" primaryColor={colors.P300} size="medium" />
            )
          }
          actions={
            submitFailed
              ? [
                  {
                    content: formatMessage(
                      messages.marketingConsentSubmitFailedButton
                    ),
                    onClick: this.closeFlag,
                  },
                ]
              : [
                  {
                    content: formatMessage(messages.marketingConsentButtonYes),
                    onClick: this.submitConsent(true),
                  },
                  {
                    content: formatMessage(messages.marketingConsentButtonNo),
                    onClick: this.submitConsent(false),
                  },
                ]
          }
          // Pass on remaining props to AkFlag set by AkFlagGroup
          {...flagProps}
          // This is a private AK prop, but we are applying it to this snowflake component
          isDismissAllowed={false}
        />
      </styles.FlagWrapper>
    );
  }
}

const mapStateToProps = (state: BucketState) => ({
  geoipCountry: state.global.geoipCountry,
});

export default connect(mapStateToProps, {})(injectIntl(MarketingConsentFlag));

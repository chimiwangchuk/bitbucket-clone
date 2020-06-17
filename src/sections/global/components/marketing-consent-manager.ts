import { PureComponent } from 'react';

type Props = {
  needsMarketingConsent: boolean;
  showMarketingConsentFlag: () => void;
};

export class MarketingConsentManager extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.needsMarketingConsent) {
      this.props.showMarketingConsentFlag();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { needsMarketingConsent } = this.props;
    if (
      needsMarketingConsent &&
      prevProps.needsMarketingConsent !== needsMarketingConsent
    ) {
      this.props.showMarketingConsentFlag();
    }
  }

  render() {
    return null;
  }
}

import { connect } from 'react-redux';
import { showFlagComponent } from 'src/redux/flags';
import { getIsMobileHeaderActive } from 'src/selectors/global-selectors';
import { BucketState, BucketDispatch } from 'src/types/state';
import { MarketingConsentManager } from '../components/marketing-consent-manager';

const mapStateToProps = (state: BucketState) => ({
  needsMarketingConsent:
    !getIsMobileHeaderActive(state) && state.global.needsMarketingConsent,
});

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  showMarketingConsentFlag: () => {
    dispatch(showFlagComponent('marketing-consent'));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketingConsentManager);

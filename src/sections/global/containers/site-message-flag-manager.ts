import { connect } from 'react-redux';
import { dismissFlag, showFlagComponent } from 'src/redux/flags';
import { getSiteMessageFlag } from 'src/selectors/global-selectors';
import { BucketState } from 'src/types/state';
import { SiteMessageFlagManager } from '../components/site-message-flag-manager';

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  dismissSiteMessageFlag: () => {
    dispatch(dismissFlag('site-message'));
  },
  showSiteMessageFlag: () => {
    dispatch(showFlagComponent('site-message'));
  },
});

const mapStateToProps = (state: BucketState) => ({
  siteMessageFlag: !!getSiteMessageFlag(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteMessageFlagManager);

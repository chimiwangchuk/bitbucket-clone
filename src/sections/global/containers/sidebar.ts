import { connect } from 'react-redux';
import { getSiteMessageBanner } from 'src/selectors/global-selectors';
import { BucketState } from 'src/types/state';
import Sidebar from '../components/sidebar';

const mapStateToProps = (state: BucketState) => ({
  isBannerOpen: Boolean(getSiteMessageBanner(state)),
});

export default connect(mapStateToProps)(Sidebar);

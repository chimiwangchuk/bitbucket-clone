import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { getSiteMessageBanner } from 'src/selectors/global-selectors';
import SiteBanner from 'src/components/site-banner';
import { BucketState } from 'src/types/state';

const mapStateToProps = (state: BucketState) => ({
  siteMessage: getSiteMessageBanner(state),
});

export default connect(mapStateToProps)(injectIntl(SiteBanner));

import { connect } from 'react-redux';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import { getTargetUserKey } from 'src/selectors/user-selectors';
import { BucketState } from 'src/types/state';
import ConnectPullRequestSummaryActions from '../components/pull-request-summary-actions';

const mapStateToProps = (state: BucketState) => ({
  principalId: getTargetUserKey(state),
  target: getCurrentPullRequest(state),
});

export default connect(mapStateToProps)(ConnectPullRequestSummaryActions);

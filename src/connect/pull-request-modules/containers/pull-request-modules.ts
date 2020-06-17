import { connect } from 'react-redux';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import { getTargetUserKey } from 'src/selectors/user-selectors';
import { BucketState } from 'src/types/state';
import ConnectPullRequestModules from '../components/pull-request-modules';

const mapStateToProps = (state: BucketState) => ({
  principalId: getTargetUserKey(state),
  target: getCurrentPullRequest(state),
});

export default connect(mapStateToProps)(ConnectPullRequestModules);

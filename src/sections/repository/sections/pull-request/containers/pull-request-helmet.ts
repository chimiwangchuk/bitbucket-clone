import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import PullRequestHelmet from '../components/pull-request-helmet';

const mapStateToProps = (state: BucketState) => {
  return {
    currentPullRequest: getCurrentPullRequest(state),
  };
};

export default connect(mapStateToProps)(PullRequestHelmet);

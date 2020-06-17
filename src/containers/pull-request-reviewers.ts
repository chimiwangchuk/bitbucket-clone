import { connect } from 'react-redux';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import { BucketState } from 'src/types/state';
import Reviewers from './reviewers';

const mapStateToProps = (state: BucketState) => ({
  pullRequest: getCurrentPullRequest(state),
});

export const PullRequestReviewers = connect(mapStateToProps)(Reviewers);

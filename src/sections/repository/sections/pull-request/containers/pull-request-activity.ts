import { connect } from 'react-redux';

import { getCurrentUser } from 'src/selectors/user-selectors';
import {
  getCurrentPullRequestActivityError,
  getCurrentPullRequestActivityLoadingState,
  getPullRequestActivityFeed,
} from 'src/redux/pull-request/selectors/activity-selectors';
import { BucketState, BucketDispatch } from 'src/types/state';
import { FETCH_ACTIVITY } from 'src/redux/pull-request/activity-reducer';
import { PullRequestActivity } from '../components/pull-request-activity/pull-request-activity';

const mapStateToProps = (state: BucketState) => {
  const activityEntries = getPullRequestActivityFeed(state);
  const hasError = getCurrentPullRequestActivityError(state);
  const isLoading = getCurrentPullRequestActivityLoadingState(state);
  const currentUser = getCurrentUser(state);

  return {
    activityEntries,
    hasError,
    isLoading,
    uuid: currentUser ? currentUser.uuid : undefined,
  };
};

export const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  retryFetchActivity: () => dispatch({ type: FETCH_ACTIVITY.REQUEST }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PullRequestActivity);

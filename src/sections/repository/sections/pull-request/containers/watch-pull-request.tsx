import React from 'react';
import { connect } from 'react-redux';
import {
  getWatch,
  getWatchActionLoading,
} from 'src/redux/pull-request/selectors';
import { START_WATCH, STOP_WATCH } from 'src/redux/pull-request/actions';
import { BucketState, BucketDispatch } from 'src/types/state';
import messages from '../components/header-actions/header-actions.i18n';
import WatchPullRequest from '../components/watch-pull-request';

const mapStateToProps = (state: BucketState) => {
  const isLoading = getWatchActionLoading(state);
  const isWatching = getWatch(state);
  const message = isWatching
    ? messages.stopWatchingPullRequestAction
    : messages.watchPullRequestAction;
  return {
    isLoading,
    isWatching,
    message,
  };
};

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  startWatch: () => dispatch({ type: START_WATCH.BEGIN }),
  stopWatch: () => dispatch({ type: STOP_WATCH.BEGIN }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(props => <WatchPullRequest {...props} />);

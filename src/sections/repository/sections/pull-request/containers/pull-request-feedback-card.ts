import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { BucketState } from 'src/types/state';
import {
  getPullRequestDestinationRepo,
  getPullRequestSourceRepo,
  getCurrentPullRequestId,
  getPullRequestDiffFileCount,
  getPullRequestDiffLinesCount,
  getPullRequestDiffRenderedFileCount,
  getPullRequestDiffRenderedLinesCount,
} from 'src/redux/pull-request/selectors';
import { getIsMobileHeaderActive } from 'src/selectors/global-selectors';
import {
  getIsNewCodeReviewEnabled,
  getIsNewCodeReviewEnabledForTeam,
} from 'src/selectors/feature-selectors';
import PullRequestFeedbackCard from '../components/pull-request-feedback-card';

export const mapStateToProps = (state: BucketState) => {
  return {
    sourceRepo: getPullRequestSourceRepo(state),
    destRepo: getPullRequestDestinationRepo(state),
    pullRequestId: getCurrentPullRequestId(state),
    numDiffFiles: getPullRequestDiffFileCount(state),
    numDiffFilesRendered: getPullRequestDiffRenderedFileCount(state),
    numDiffLines: getPullRequestDiffLinesCount(state),
    numDiffLinesRendered: getPullRequestDiffRenderedLinesCount(state),
    isBrowserMsie11: state.global.isBrowserMsie11,
    isMobileHeaderActive: getIsMobileHeaderActive(state),
    isNewCodeReviewFeatureEnabledForUser: getIsNewCodeReviewEnabled(state),
    isNewCodeReviewFeatureEnabledForTeam: getIsNewCodeReviewEnabledForTeam(
      state
    ),
  };
};

export default compose<any, any, any>(
  withRouter,
  connect(mapStateToProps)
)(PullRequestFeedbackCard);

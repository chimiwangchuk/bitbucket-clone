import { connect } from 'react-redux';
import { match as Match, withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { BuildStatus } from 'src/components/types';
import { ResizeProps } from 'src/components/sidebar';
import urls from 'src/redux/pull-request/urls';
import {
  updateBuilds,
  setWelcomeTourActive,
} from 'src/redux/pull-request/actions';
import {
  isCodeReviewSidebarOpen,
  updateSidebarState,
  getCodeReviewSidebarWidth,
} from 'src/redux/sidebar';
import {
  getCurrentPullRequest,
  getCurrentPullRequestBuilds,
  getIsCorrectPullRequest,
  getIsWelcomeTourActive,
} from 'src/redux/pull-request/selectors';
import { getIsMobileHeaderActive } from 'src/selectors/global-selectors';
import { getCurrentRepository } from 'src/selectors/repository-selectors';
import { BucketState, BucketDispatch } from 'src/types/state';
import PullRequestSidebar from '../components/sidebar';

type RouteParams = {
  repositoryOwner: string;
  repositorySlug: string;
  pullRequestId: string;
};

const mapStateToProps = (
  state: BucketState,
  ownProps: { match: Match<RouteParams> }
) => {
  const { match } = ownProps;
  const {
    repositoryOwner: ownerFromRoute,
    repositorySlug: slugFromRoute,
    pullRequestId: idFromRoute,
  } = match.params;
  const oldPullRequestUrl = urls.ui.oldpullrequest(
    ownerFromRoute || '',
    slugFromRoute || '',
    parseInt(idFromRoute, 10)
  );

  const pullRequestInStateMatchesRoute = getIsCorrectPullRequest(
    state,
    match.params
  );

  return {
    oldPullRequestUrl,
    pullRequestInStateMatchesRoute,
    expandedWidth: getCodeReviewSidebarWidth(state),
    isCollapsed: getIsMobileHeaderActive(state)
      ? false
      : !isCodeReviewSidebarOpen(state),
    pullRequest: getCurrentPullRequest(state),
    repository: getCurrentRepository(state),
    hasMergeChecklistFeature:
      state.global.features['new-code-review-merge-checklist'],
    builds: getCurrentPullRequestBuilds(state),
    isWelcomeTourActive: getIsWelcomeTourActive(state),
  };
};

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onResize: (resizeProps: ResizeProps) =>
    dispatch(
      updateSidebarState({
        isOpen: !resizeProps.isCollapsed,
        width: resizeProps.width,
        sidebarType: 'code-review',
      })
    ),
  toggleSidebar: () =>
    dispatch(updateSidebarState({ sidebarType: 'code-review' })),
  updateBuilds: (builds: BuildStatus[]) => dispatch(updateBuilds(builds)),
  endTour: () => dispatch(setWelcomeTourActive(false)),
});

export default compose<any, any, any>(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PullRequestSidebar);

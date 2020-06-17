import { connect } from 'react-redux';
import { BucketState, BucketDispatch } from 'src/types/state';
import { fetchPendingMergeStatus } from 'src/redux/pull-request/merge-reducer';
import { SIDEBAR_COLLAPSED_WIDTH } from 'src/sections/global/constants';
import {
  getCodeReviewSidebarWidth,
  isCodeReviewSidebarOpen,
} from 'src/redux/sidebar';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import {
  getIsMobileHeaderActive,
  getCombinedBannerAndHorizontalNavHeight,
} from 'src/selectors/global-selectors';
import { getIsHorizontalNavEnabled } from 'src/selectors/feature-selectors';

import Header, { HeaderProps } from '../components/header';

const mapStateToProps = (state: BucketState): Omit<HeaderProps, 'intl'> => ({
  currentPullRequest: getCurrentPullRequest(state),
  hasCreatePendingMergeFeature:
    state.global.targetFeatures?.pr_post_build_merge || false,
  isMobileHeaderActive: getIsMobileHeaderActive(state),
  sidebarWidth: isCodeReviewSidebarOpen(state)
    ? getCodeReviewSidebarWidth(state)
    : SIDEBAR_COLLAPSED_WIDTH,
  isHorizontalNavEnabled: getIsHorizontalNavEnabled(state),
  stickHeaderTopOffset: getCombinedBannerAndHorizontalNavHeight(state, false),
});

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onFetchPendingMergeStatus: () => dispatch(fetchPendingMergeStatus()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

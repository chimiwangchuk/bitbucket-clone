import { compose } from 'redux';
import { connect } from 'react-redux';
import { get, isEqual } from 'lodash-es';
import { uncurlyUuid } from '@atlassian/bitkit-analytics';
import { withFact } from 'src/components/performance-metrics/with-fact';
import { withApdexAndFeatureFlags } from 'src/components/apdex/with-apdex';
import { withStatsdAndFeatureFlags } from 'src/components/performance-metrics/with-statsd';
import {
  IS_PARCEL_BUNDLES_ENABLED,
  IS_SINGLE_FILE_MODE_ACTIVE,
  IS_SINGLE_FILE_MODE_ELIGIBLE,
} from 'src/constants/features';
import { PullRequestFact } from 'src/sections/repository/sections/pull-request/facts';
import {
  DIFFS_HAVE_RENDERED,
  HIGHLIGHT_ACTIVE_TREE_ITEM,
  INITIAL_DIFFS_RENDERED,
  RESET_ACTIVE_TREE_ITEM,
  publishPullRequestTrackEvent,
  TOGGLE_SINGLE_FILE_MODE_SETTINGS_HEADER_VISIBILITY,
} from 'src/redux/pull-request/actions';
import {
  getActivePermalink,
  getCurrentPullRequestId,
  getDiffsExpansions,
  getPullRequestSourceRepo,
  getPullRequestDestinationRepo,
  getActiveDiff,
  getIsSingleFileModeActive,
  getIsSingleFileModeEligible,
  getPullRequestDiffLinesCount,
  getUntruncatedPullRequestDiffFileCount,
} from 'src/redux/pull-request/selectors';
import { ApdexTask } from 'src/types/apdex';
import { BucketState, BucketDispatch } from 'src/types/state';

import {
  getSkipExcessiveDiffs,
  getIsParcelBundlesEnabled,
  getIsCodeReviewSingleFileModeEnabled,
} from 'src/selectors/feature-selectors';
import { getCombinedBannerAndHorizontalNavHeight } from 'src/selectors/global-selectors';
import DiffSet, { DiffSetStateProps } from '../components/diff-set';

// Note! When adding something here check if you need to add it to "areStatesEqual" below
export const mapStateToProps = (state: BucketState): DiffSetStateProps => {
  const pullRequestId = getCurrentPullRequestId(state);
  const sourceRepo = getPullRequestSourceRepo(state);
  const destRepo = getPullRequestDestinationRepo(state);
  const isSingleFileModeActive =
    getIsCodeReviewSingleFileModeEnabled(state) &&
    getIsSingleFileModeActive(state);
  const isSingleFileModeEligible = getIsSingleFileModeEligible(state);
  const untruncatedDiffFileCount = getUntruncatedPullRequestDiffFileCount(
    state
  );
  const untruncatedPullRequestLinesChanged = getPullRequestDiffLinesCount(
    state
  );
  const pullRequestFilemode = isSingleFileModeActive
    ? 'singleFileMode'
    : 'allFilesMode';

  const factData = {
    from_repository_uuid: uncurlyUuid(get(sourceRepo, 'uuid', '')),
    pull_request_id: pullRequestId,
    to_repository_uuid: uncurlyUuid(get(destRepo, 'uuid', '')),
    to_repository_owner_uuid: uncurlyUuid(get(destRepo, 'owner.uuid', '')),
  };

  return {
    activeDiff: getActiveDiff(state),
    diffsExpansionState: getDiffsExpansions(state),
    pullRequestFilemode,
    factData,
    skipExcessiveDiffs: getSkipExcessiveDiffs(state),
    isSingleFileModeEligible,
    isSingleFileModeActive,
    anchorTopOffset: getCombinedBannerAndHorizontalNavHeight(state, false),
    untruncatedPullRequestLinesChanged,
    untruncatedDiffFileCount,
  };
};

/**
 * This blocks the infinite loop bug caused by the intersection observer
 * code in diff-set triggering a state change during a render phase.
 */
function areStatesEqual(next: BucketState, prev: BucketState) {
  // Note: this does not compare the factData values.
  // None of those can change without a reload of the whole PR.

  return (
    getIsSingleFileModeActive(prev) === getIsSingleFileModeActive(next) &&
    isEqual(getDiffsExpansions(prev), getDiffsExpansions(next)) &&
    isEqual(getActivePermalink(prev), getActivePermalink(next))
  );
}

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  dispatchSettingsHeaderVisibilityChanged: (isVisible: boolean) =>
    dispatch({
      type: TOGGLE_SINGLE_FILE_MODE_SETTINGS_HEADER_VISIBILITY,
      payload: isVisible,
    }),
  dispatchDiffsHaveRendered: () => dispatch({ type: DIFFS_HAVE_RENDERED }),
  dispatchInitialDiffsRendered: (attributes?: object) => {
    dispatch({ type: INITIAL_DIFFS_RENDERED });
    dispatch(
      publishPullRequestTrackEvent({
        action: 'rendered',
        actionSubject: 'pullRequestDiff',
        actionSubjectId: '',
        attributes,
      })
    );
  },
  onDiffScrolledIntoView: (activeDiff: string) =>
    dispatch({
      type: HIGHLIGHT_ACTIVE_TREE_ITEM,
      payload: activeDiff,
    }),

  onDiffScrolledOutOfView: (inactiveDiff: string) =>
    dispatch({
      type: RESET_ACTIVE_TREE_ITEM,
      payload: inactiveDiff,
    }),
});

const featureFlagNamesToSelectors = [
  { name: IS_PARCEL_BUNDLES_ENABLED, selector: getIsParcelBundlesEnabled },
  // For single file mode, we want to know whether the mode is "single file" or "all files" (IS_SINGLE_FILE_MODE_ACTIVE)
  // and also want to know whether the PR is big enough for single file mode to be relevant in the first place (IS_SINGLE_FILE_MODE_ELIGIBLE)
  // so that the diff rendering time comparison is meaningful.
  { name: IS_SINGLE_FILE_MODE_ACTIVE, selector: getIsSingleFileModeActive },
  { name: IS_SINGLE_FILE_MODE_ELIGIBLE, selector: getIsSingleFileModeEligible },
];

export default compose<any, any, any, any, any>(
  withStatsdAndFeatureFlags({
    metricName: 'performance.diffs.rendered',
    featureFlagNamesToSelectors,
  }),
  withApdexAndFeatureFlags({
    eventName: ApdexTask.PullRequest,
    featureFlagNamesToSelectors,
  }),
  connect(mapStateToProps, mapDispatchToProps, null, {
    areStatesEqual,
  }),
  // @ts-ignore
  withFact('bitbucket.pullrequests.diffs.rendered', PullRequestFact)
)(DiffSet);

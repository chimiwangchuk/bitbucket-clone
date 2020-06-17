import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import {
  requestMerge,
  createPendingMerge,
  cancelPendingMerge,
  closeDialog,
  getCanCreatePendingMerge,
  getIsMergeRequesting,
  getIsRequestingPendingMerge,
  getIsMergeErrored,
  getIsMergePending,
  getMergeErrorMessage,
  getMergeInfo,
  getStackedPullRequestsCount,
} from 'src/redux/pull-request/merge-reducer';
import {
  getCurrentPullRequest,
  getCurrentPullRequestApprovers,
  getCanDeleteSourceBranch,
  getCountFailedPullRequestMergeChecks,
  getPullRequestMergeChecksIsMergeable,
} from 'src/redux/pull-request/selectors';
import { getCurrentPullRequestCommits } from 'src/redux/pr-commits/selectors';
import { getSiteMessageBanner } from 'src/selectors/global-selectors';
import { transitionIssues } from 'src/redux/jira/actions';
import {
  getIssueTransitionForm,
  getPullRequestJiraIssuesByType,
} from 'src/redux/jira/selectors/jira-issue-selectors';
import { withFeature, FeatureKeys } from '@atlassian/bitbucket-features';
import MergeDialog from '../components/merge-dialog/merge-dialog';

const mapStateToProps = (state: BucketState) => ({
  canCreatePendingMerge: getCanCreatePendingMerge(state),
  isMergePending: getIsMergePending(state),
  currentPullRequest: getCurrentPullRequest(state),
  approvers: getCurrentPullRequestApprovers(state),
  commits: getCurrentPullRequestCommits(state),
  isRequesting: getIsMergeRequesting(state),
  isRequestingPendingMerge: getIsRequestingPendingMerge(state),
  isErrored: getIsMergeErrored(state),
  errorMessage: getMergeErrorMessage(state),
  mergeInfo: getMergeInfo(state),
  defaultMergeStrategy: state.repository.pullRequest.defaultMergeStrategy,
  isBannerOpen: Boolean(getSiteMessageBanner(state)),
  stackedPullRequestsCount: getStackedPullRequestsCount(state),
  canDeleteSourceBranch: getCanDeleteSourceBranch(state),
  countFailedChecks: getCountFailedPullRequestMergeChecks(state),
  isMergeable: getPullRequestMergeChecksIsMergeable(state),
  issueTransitionForm: getIssueTransitionForm(state),
  pullRequestJiraIssues: getPullRequestJiraIssuesByType(state, 'PrIssue'),
});

const mapDispatchToProps = {
  transitionIssues,
  mergePullRequest: requestMerge,
  onCreatePendingMerge: createPendingMerge,
  onCancelPendingMerge: cancelPendingMerge,
  onClose: closeDialog,
};

export default withFeature(
  FeatureKeys.isIssueTransitionOnMergeEnabled,
  false
)(connect(mapStateToProps, mapDispatchToProps)(MergeDialog));

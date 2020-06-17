import { defineMessages } from 'react-intl';

export default defineMessages({
  mergePullRequestAction: {
    id: 'frontbucket.repository.pullRequest.mergePullRequest',
    description: 'Action to merge a pull request',
    defaultMessage: 'Merge',
  },
  mergeDialogTitle: {
    id: 'frontbucket.repository.pullRequest.mergePullRequestDialog',
    description: 'Title of merge dialog for a pull request',
    defaultMessage: 'Merge pull request',
  },
  mergeDialogCommitMessageLabel: {
    id: 'frontbucket.repository.pullRequest.mergeDialogCommitMessageLabel',
    description: 'Label the merge dialog commit message text area',
    defaultMessage: 'Commit message',
  },
  mergeDialogMergeStrategyLabel: {
    id: 'frontbucket.repository.pullRequest.mergeDialogMergeStrategyLabel',
    description: 'Label the merge strategy selecter',
    defaultMessage: 'Merge strategy',
  },
  sourceBranch: {
    id: 'frontbucket.repository.pullRequest.mergeDialogSourceBranch',
    description: 'Label the source branch',
    defaultMessage: 'Source',
  },
  destinationBranch: {
    id: 'frontbucket.repository.pullRequest.mergeDialogDestinationBranch',
    description: 'Label the destination branch',
    defaultMessage: 'Destination',
  },
  closeSourceBranch: {
    id: 'frontbucket.repository.pullRequest.closeSourceBranch',
    description: 'Label for close source branch checkbox',
    defaultMessage: 'Close source branch',
  },
  closeSourceBranchAndRetargetStackedPullRequests: {
    id:
      'frontbucket.repository.pullRequest.closeSourceBranchAndRetargetStackedPullRequests',
    description:
      'Label for close source branch checkbox when there is at least one stacked pull request',
    defaultMessage: 'Close source branch and retarget {stackedPullRequests}',
  },
  stackedPullRequestsLink: {
    id: 'frontbucket.repository.pullRequest.stackedPullRequestsLink',
    description: 'Link to the list of stacked pull requests',
    defaultMessage:
      '{count, plural, one {{count} affected pull request} other {{count} affected pull requests}}',
  },
  mergedInLabel: {
    id: 'frontbucket.respository.pullRequest.mergedInLabel',
    description:
      'Label for the merged-in section of the default commit message',
    defaultMessage: 'Merged in',
  },
  approvedByLabel: {
    id: 'frontbucket.respository.pullRequest.approvedByLabel',
    description:
      'Label for the approved-by section of the default commit message',
    defaultMessage: 'Approved-by:',
  },
  pullRequestLabel: {
    id: 'frontbucket.respository.pullRequest.pullRequestLabel',
    description:
      'Label for the pull request section of the default commit message',
    defaultMessage: 'pull request',
  },
  createPendingMergeHeading: {
    id: 'frontbucket.respository.pullRequest.createPendingMergeTitle',
    description: 'Heading for create a pending merge option',
    defaultMessage: `All builds need to pass before merge`,
  },
  createPendingMergeDescription: {
    id: 'frontbucket.respository.pullRequest.createPendingMergeDescription',
    description:
      'Description for notice that the pull request can be merged automatically once builds pass',
    defaultMessage: `You can schedule to automatically merge the pull request if all builds are successful.`,
  },
  createPendingMergeAction: {
    id: 'frontbucket.repository.pullRequest.createPendingMergeAction',
    description: 'Action to automically merge a pull request when possible',
    defaultMessage: 'Merge when builds pass',
  },
  cancelPendingMergeHeading: {
    id: 'frontbucket.respository.pullRequest.cancelPendingMergeTitle',
    description: 'Heading for cancel a pending merge option',
    defaultMessage: `You’ve got a pending merge`,
  },
  cancelPendingMergeDescription: {
    id: 'frontbucket.respository.pullRequest.cancelPendingMergeDescription',
    description:
      'Description for notice that a merge is pending and can be cancelled',
    defaultMessage: `We'll merge this pull request automatically if all builds are successful.`,
  },
  cancelPendingMergeAction: {
    id: 'frontbucket.repository.pullRequest.cancelPendingMergeAction',
    description: 'Action to cancel a pending merge',
    defaultMessage: 'Stop pending merge',
  },
  mergeWarningLinkText: {
    id: 'frontbucket.repository.pullRequest.mergeWarningLinkText',
    description: 'Learn more link text',
    defaultMessage: 'Learn more',
  },
  mergeWarningText: {
    id: 'frontbucket.repository.pullRequest.mergeWarningText',
    description: 'Text of merge warning',
    defaultMessage:
      'The source branch has failed merge checks that need to be resolved.',
  },
  mergeWarningTitle: {
    id: 'frontbucket.repository.pullRequest.mergeWarningTitle',
    description: 'Title of merge warning',
    defaultMessage:
      '{countFailedChecks, plural, one {{countFailedChecks} failed merge check} other {{countFailedChecks} failed merge checks}}',
  },
  mergeWarningTooltip: {
    id: 'frontbucket.repository.pullRequest.mergeWarningTooltip',
    description: 'Text of tooltip',
    defaultMessage: 'Must pass merge checks before merging',
  },
});

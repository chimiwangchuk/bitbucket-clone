import { defineMessages } from 'react-intl';

export default defineMessages({
  mergePullRequestAction: {
    id: 'frontbucket.repository.pullRequest.mergePullRequest',
    description: 'Action to merge a pull request',
    defaultMessage: 'Merge',
  },
  editPullRequestAction: {
    id: 'frontbucket.repository.pullRequest.editPullRequest',
    description: 'Action to edit a pull request',
    defaultMessage: 'Edit',
  },
  declinePullRequestAction: {
    id: 'frontbucket.repository.pullRequest.declinePullRequest',
    description: 'Action to decline a pull request',
    defaultMessage: 'Decline',
  },
  declineDialogTitle: {
    id: 'frontbucket.repository.pullRequest.declinePullRequestDialog',
    description: 'Title of decline dialog for a pull request',
    defaultMessage: 'Decline pull request',
  },
  declineDialogInfo: {
    id: 'frontbucket.repository.pullRequest.declineDialogInfo',
    description: 'Informational text inside the decline dialog',
    defaultMessage:
      'No one can reopen a declined pull request, but you can create a new pull request from the same branch. If you have feedback for the author, leave comments on this pull request instead.',
  },
  declineDialogLabel: {
    id: 'frontbucket.repository.pullRequest.declineLabel',
    description: 'Label the decline dialog reason',
    defaultMessage: 'Why are you declining this pull request?',
  },
  watchPullRequestAction: {
    id: 'frontbucket.repository.pullRequest.watchPullRequest',
    description: 'Action to watch a pull request',
    defaultMessage: 'Watch',
  },
  stopWatchingPullRequestAction: {
    id: 'frontbucket.repository.pullRequest.stopWatchingPullRequest',
    description: 'Action to stop watching a pull request',
    defaultMessage: 'Stop watching',
  },
  reviewersListLabel: {
    id: 'frontbucket.repository.pullRequest.reviewersListLabel',
    description: 'Label for list of reviewers',
    defaultMessage: 'Reviewers list',
  },
});

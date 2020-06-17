import { defineMessages } from 'react-intl';

export default defineMessages({
  approveAction: {
    id: 'frontbucket.repository.pullRequest.approvePullRequest',
    description: 'Action to approve a pull request.',
    defaultMessage: 'Approve',
  },
  unapproveAction: {
    id: 'frontbucket.repository.pullRequest.unapprovePullRequest',
    description: 'Action to unapprove a pull request.',
    defaultMessage: 'Unapprove',
  },
  approveLabel: {
    id: 'frontbucket.repository.pullRequest.label.approvePullRequest',
    description: 'Label for action to approve a pull request.',
    defaultMessage: 'Approve this pull request',
  },
  unapproveLabel: {
    id: 'frontbucket.repository.pullRequest.label.unapprovePullRequest',
    description: 'Label for action to unapprove a pull request.',
    defaultMessage: 'Unapprove this pull request',
  },
});

import { defineMessages } from 'react-intl';

export default defineMessages({
  showMore: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.expander.showMore',
    description:
      'Label for a button which allows the user to expand a list of issues',
    defaultMessage: 'Show {formattedCount} more',
  },
  errorRetry: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.expander.retry',
    description:
      'Label for a button which allows the user to retry fetching a list of issues',
    defaultMessage: 'Try again',
  },
  errorHeading: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.expander.error',
    description: 'Generic error message',
    defaultMessage: "Couldn't load content",
  },
  emptyHeader: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.expander.emptyHeader',
    description: 'Heading informing user that they have no linked issues',
    defaultMessage: 'No issues linked',
  },
  emptyBody: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.expander.emptyBody',
    description: 'Information on how to link issues',
    defaultMessage:
      'Link some issues to this pull request, its branches, or commits to see it here.',
  },
  emptyAction: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.expander.emptyAction',
    description: 'Link to further information',
    defaultMessage: 'Learn more',
  },
  show: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.expander.show',
    description:
      'Label for a button which allows user to reveal a list of issues',
    defaultMessage: 'Show',
  },
  hide: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.expander.hide',
    description:
      'Label for a button which allows user to hide a list of issues',
    defaultMessage: 'Hide',
  },
  createdInPr: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.expander.createdInPr',
    description: 'Heading for a list of issues created within a pull request',
    defaultMessage: 'Created in this PR ({formattedCount})',
  },
});

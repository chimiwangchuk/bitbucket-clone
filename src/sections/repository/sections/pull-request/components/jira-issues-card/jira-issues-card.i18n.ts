import { defineMessages } from 'react-intl';

export default defineMessages({
  ariaLabel: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.ariaLabel',
    description:
      'Label for a sidebar card showing a list of related Jira Issues.',
    defaultMessage: 'Jira issues',
  },
  issueCount: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.issueCount',
    description:
      'Label for displaying the number of issues related to this pull request.',
    defaultMessage:
      '{total, plural, one {{formattedCount} Jira issue} other {{formattedCount} Jira issues}}',
  },
  createdInPrHeading: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.createdInPr.heading',
    description:
      'Text for heading of a list which contains issues created within this pull request',
    defaultMessage: `Couldn't load contents`,
  },
  errorHeading: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.error.heading',
    description:
      'Text for error state showing that there was a problem loading the issues',
    defaultMessage: `Couldn't load contents`,
  },
  errorAction: {
    id: 'frontbucket.repository.pullRequest.jiraIssues.error.action',
    description:
      'Click action for error state showing that there was a problem loading the issues',
    defaultMessage: 'Try again',
  },
});

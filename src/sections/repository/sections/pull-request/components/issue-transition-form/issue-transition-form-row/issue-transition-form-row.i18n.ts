import { defineMessages } from 'react-intl';

export default defineMessages({
  transitionIssues: {
    id: 'frontbucket.repository.pullRequest.merge.transitionIssues',
    description:
      'Message showing the user that they can change the status of an issue',
    defaultMessage: 'Transition',
  },
  to: {
    id: 'frontbucket.repository.pullRequest.merge.to',
    description: 'to',
    defaultMessage: ' to ',
  },
  issue: {
    id: 'frontbucket.repository.pullRequest.merge.issue',
    description: 'A jira issue',
    defaultMessage: 'Issue',
  },
  status: {
    id: 'frontbucket.repository.pullRequest.merge.status',
    description:
      'A status which can be assigned to a Jira issue, such as "in progress"',
    defaultMessage: 'Status',
  },
});

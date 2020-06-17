import { defineMessages } from 'react-intl';

export default defineMessages({
  pullRequestCreated: {
    id: 'frontbucket.repository.pullRequest.pullRequestCreated',
    description: 'Text for tooltip showing when a pull request was created',
    defaultMessage: 'Pull request created {formattedDate}',
  },
  pullRequestMerged: {
    id: 'frontbucket.repository.pullRequest.pullRequestMerged',
    description: 'Text for tooltip showing when a pull request was merged',
    defaultMessage: 'Pull request merged {formattedDate}',
  },
  pullRequestDeclined: {
    id: 'frontbucket.repository.pullRequest.pullRequestDeclined',
    description: 'Text for tooltip showing when a pull request was declined',
    defaultMessage: 'Pull request declined {formattedDate}',
  },
  pullRequestOpenLabel: {
    id: 'frontbucket.repository.pullRequest.pullRequestOpenLabel',
    description: 'Text for state lozenge showing a pull request is open',
    defaultMessage: 'Open',
  },
  pullRequestMergedLabel: {
    id: 'frontbucket.repository.pullRequest.pullRequestMergedLabel',
    description: 'Text for state lozenge showing a pull request is merged',
    defaultMessage: 'Merged',
  },
  pullRequestDeclinedLabel: {
    id: 'frontbucket.repository.pullRequest.pullRequestDeclinedLabel',
    description: 'Text for state lozenge showing a pull request is declined',
    defaultMessage: 'Declined',
  },
});

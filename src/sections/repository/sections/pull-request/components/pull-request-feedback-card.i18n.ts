import { defineMessages } from 'react-intl';

export default defineMessages({
  feedbackCardLabel: {
    id: 'frontbucket.repository.pullRequest.feedbackCardLabel',
    defaultMessage: 'Help and feedback',
    description:
      'Label of the new pull request UI feedback and information card',
  },
  feedbackCardAriaLabel: {
    id: 'frontbucket.repository.pullRequest.feedbackCardAriaLabel',
    defaultMessage: 'Feedback and temporary opt out',
    description:
      'Label for a card requesting feedback on the new user interface, and providing a link to opt-out of the new interface.',
  },
  feedbackCardMessage: {
    id: 'frontbucket.repository.pullRequest.feedbackCardMessage',
    defaultMessage: `Care to share your thoughts about the new pull request experience?`,
    description: 'A message suggesting to share thoughts about new PR view',
  },
  feedbackCardOptOutText: {
    id: 'frontbucket.repository.pullRequest.feedbackCardOptOutText',
    defaultMessage:
      'Would you like to see this pull request in the old experience?',
    description: 'Text for opt-ing out of the new pull request UI',
  },
  feedbackCardOptOutLinkText: {
    id: 'frontbucket.repository.pullRequest.feedbackCardOptOutLinkText',
    defaultMessage: 'View this pull request in the old experience',
    description: 'Link text for opt-ing out of the new pull request UI',
  },
  feedbackCardDocumentationMessage: {
    id: 'frontbucket.repository.pullRequest.feedbackCardDocumentationMessage',
    defaultMessage: `To go back to using the old pull request experience, go to {bitbucketLabsLink}. For more details about the new pull request experience, see our help documentation. {learnMoreLink}`,
    description:
      'A message explaining where to find information about the new pull request UI including how to disable it',
  },
  feedbackCardDocumentationLinkText: {
    id: 'frontbucket.repository.pullRequest.feedbackCardDocumentationLinkText',
    defaultMessage: 'Learn more',
    description:
      'Link text for viewing documentation about the new pull request UI',
  },
  feedbackCardLabsLinkText: {
    id: 'frontbucket.repository.pullRequest.feedbackCardLabsLinkText',
    defaultMessage: 'Bitbucket Labs',
    description: 'Text for link to Bitbucket Labs',
  },
});

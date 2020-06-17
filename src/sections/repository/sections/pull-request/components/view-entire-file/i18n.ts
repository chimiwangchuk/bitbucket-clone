import { defineMessages } from 'react-intl';

export default defineMessages({
  learnMoreLink: {
    id: 'frontbucket.repository.pullRequest.diff.viewEntireFile.learnMoreLink',
    description:
      'Text for a link to documentation about rendering limits for large diffs',
    defaultMessage: 'Learn more',
  },
  tooLargeHeader: {
    id: 'frontbucket.repository.pullRequest.diff.viewEntireFile.tooLargeHeader',
    description:
      'The header of the "View entire file" modal if the file is too large to render',
    defaultMessage: 'File is too large to display',
  },
  tooLargeMessage: {
    id:
      'frontbucket.repository.pullRequest.diff.viewEntireFile.tooLargeMessage',
    description:
      'Message displayed in the "View entire file" modal if the file is too large to render',
    defaultMessage:
      'This file is too large for Bitbucket to display. You can view the full file using the following command in your local {scm} client:',
  },
  serverError: {
    id: 'frontbucket.repository.pullRequest.diff.viewEntireFile.serverError',
    description:
      'Message displayed in the "View entire file" modal if there\'s an error when retrieving the file data',
    defaultMessage:
      'Wait a few moments, then try again. If this keeps happening, check the {statusLink} to ensure there are no outages or performance issues.',
  },
  confirmButton: {
    id: 'frontbucket.repository.pullRequest.diff.viewEntireFile.confirmButton',
    description:
      'Message displayed on the button in the "view entire file" modal when there is an error',
    defaultMessage: 'Got it',
  },
  bitbucketStatusPage: {
    id:
      'frontbucket.repository.pullRequest.diff.viewEntireFile.bitbucketStatusPage',
    description: 'the link text to send a user to the bitbucket status page.',
    defaultMessage: 'Bitbucket status page',
  },
});

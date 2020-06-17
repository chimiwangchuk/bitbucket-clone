import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  trigger: {
    id: 'frontbucket.repository.pullRequest.outdatedComments.trigger',
    description: 'Number of outdated comments on this file',
    defaultMessage:
      '{number_of_outdated_comments, plural, one {{number_of_outdated_comments} outdated comment} other {{number_of_outdated_comments} outdated comments}}',
  },
});

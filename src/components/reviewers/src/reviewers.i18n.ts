import { defineMessages } from 'react-intl';

export default defineMessages({
  noReviewers: {
    id: 'frontbucket.components.reviewers.noReviewers',
    description: 'Text for label when there are no reviewers on a pull request',
    defaultMessage: 'No reviewers',
  },
  approved: {
    id: 'frontbucket.components.reviewers.approved',
    description:
      'Label for the avatar of a user that has approved a pull request',
    defaultMessage: '{display_name} approved {datetime}',
  },
});

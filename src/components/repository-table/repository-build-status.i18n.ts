import { defineMessages } from 'react-intl';

export default defineMessages({
  buildFailureTitle: {
    id: 'frontbucket.repositoryTable.buildFailure',
    description: 'Title text to display when loading the build statuses fails.',
    defaultMessage: 'Oops!',
  },
  buildFailureDescription: {
    id: 'frontbucket.repositoryTable.buildFailureDescription',
    description:
      'Descriptive text to display when loading the build statuses fails.',
    defaultMessage: `We couldn’t load commit statuses for that repository`,
  },
});

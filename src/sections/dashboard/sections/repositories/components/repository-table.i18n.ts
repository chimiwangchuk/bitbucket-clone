import { defineMessages } from 'react-intl';

export default defineMessages({
  emptyStateWithSearch: {
    id: 'frontbucket.dashboard.repositories.emptyStateWithSearch',
    description:
      'Message displayed in the repository list when you must updated filter criteria ',
    defaultMessage: `Try modifying your filter criteria or {createRepositoryLink}.`,
  },
  emptyResultsHeading: {
    id: 'frontbucket.dashboard.repositories.emptyResultsHeading',
    description:
      'Message displayed in the repository list when you must updated filter criteria ',
    defaultMessage: `No repositories match`,
  },
  createLink: {
    id: 'frontbucket.dashboard.repositories.createLink',
    description: 'Link to create a repository',
    defaultMessage: 'Create your own repository',
  },
});

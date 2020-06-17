import { defineMessages } from 'react-intl';

export default defineMessages({
  filterLabel: {
    id: 'frontbucket.dashboard.repositories.filter.label',
    description: 'Label for the dashboard repositories page filter',
    defaultMessage: 'Filter by:',
  },
  filterProject: {
    id: 'frontbucket.dashboard.repositories.filter.projects',
    description: 'Filter for showing repository projects',
    defaultMessage: 'Project',
  },
  filterProjectLoading: {
    id: 'frontbucket.dashboard.repositories.filter.projects.loading',
    description:
      'Message shown in the project filter when it is loading the initial options',
    defaultMessage: 'Loading...',
  },
  filterNoOptions: {
    id: 'frontbucket.dashboard.repositories.filter.projects.empty',
    description:
      'The message displayed in the project filter when no projects are found',
    defaultMessage: 'Continue typing to search for the project',
  },
  filterError: {
    id: 'frontbucket.dashboard.repositories.filter.projects.error',
    description:
      'The message displayed in the project filter when the projects are failed to load',
    defaultMessage:
      'We couldn’t get the list of projects. Try refreshing the page.',
  },
});

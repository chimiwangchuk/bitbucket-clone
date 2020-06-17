import { defineMessages } from 'react-intl';

export default defineMessages({
  createLink: {
    id: 'frontbucket.components.repositoryTable.createLink',
    description: 'Link to create a repository',
    defaultMessage: 'Create your own repository',
  },
  emptyState: {
    id: 'frontbucket.components.repositoryTable.emptyState',
    description:
      'Message displayed in the repository list when a user does not have access to any',
    defaultMessage: `You don't have access to any recently updated repositories. {createRepositoryLink} instead.`,
  },
  tableHeaderSummary: {
    id: 'frontbucket.components.repositoryTable.tableHeaderSummary',
    description: 'Table header text for list of repositories.',
    defaultMessage: 'Summary',
  },
  tableHeaderDescription: {
    id: 'frontbucket.components.repositoryTable.tableHeaderDescription',
    description:
      'Table header text for description in the list of repositories.',
    defaultMessage: 'Description',
  },
  tableHeaderLastUpdated: {
    id: 'frontbucket.components.repositoryTable.tableHeaderLastUpdated',
    description:
      'Table header text for last updated column in the list of repositories.',
    defaultMessage: 'Last updated',
  },
  tableHeaderBuilds: {
    id: 'frontbucket.components.repositoryTable.tableHeaderBuilds',
    description:
      'Table header text for builds column in the list of repositories.',
    defaultMessage: 'Builds',
  },
});

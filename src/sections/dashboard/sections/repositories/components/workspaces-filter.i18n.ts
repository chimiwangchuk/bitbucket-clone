import { defineMessages } from 'react-intl';

export default defineMessages({
  filterWorkspace: {
    id: 'frontbucket.dashboard.repositories.workspaceFilter',
    description:
      'Filter for showing the repositories which match the selected workspace.',
    defaultMessage: 'Workspace',
  },
  filterWorkspaceLoading: {
    id: 'frontbucket.dashboard.repositories.workspaceFilter.loading',
    description:
      'Message shown in the workspace filter when it is loading the initial option if the one is provided',
    defaultMessage: 'Loading ...',
  },
  filterWorkspaceNoOptions: {
    id: 'frontbucket.dashboard.repositories.workspaceFilter.empty',
    description:
      'The message displayed in the workspace filter when no workspaces are returned based on the search criteria',
    defaultMessage: 'Continue typing to search for a workspace.',
  },
  filterWorkspaceError: {
    id: 'frontbucket.dashboard.repositories.workspaceFilter.error',
    description:
      'The message displayed in the workspace filter when the workspaces have failed to load',
    defaultMessage:
      'We couldn’t get the list of workspaces. Try refreshing the page.',
  },
});

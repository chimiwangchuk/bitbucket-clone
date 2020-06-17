import { defineMessages } from 'react-intl';

export default defineMessages({
  deleteMessageSuccessTitle: {
    id: 'frontbucket.dashboard.deleteMessageSuccessTitle',
    description: 'Text for the title of the delete repo success message',
    defaultMessage: 'Repository deleted',
  },
  deleteMessageDescription: {
    id: 'frontbucket.dashboard.deleteMessageDescription',
    description: 'Text for the description of the delete repo success message',
    defaultMessage: '{repoName} was successfully deleted.',
  },
  deleteUnknownRepoDescription: {
    id: 'frontbucket.dashboard.deleteUnknownRepoDescription',
    description: 'Text for the description of the delete repo success message',
    defaultMessage: 'Repository was successfully deleted.',
  },
});

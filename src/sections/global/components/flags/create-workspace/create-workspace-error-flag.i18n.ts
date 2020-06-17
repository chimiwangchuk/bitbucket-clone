import { defineMessages } from 'react-intl';

export default defineMessages({
  workspaceCreateErrorTitle: {
    id: 'frontbucket.workspace.createWorkspaceError.title',
    description: 'Text for the title of the create workspace error',
    defaultMessage: `We couldn't create a workspace`,
  },
  workspaceCreateErrorDescription: {
    id: 'frontbucket.workspace.createWorkspaceError.description',
    description: 'Text for the description of the create workspace error',
    defaultMessage: 'If this keeps happening, {checkStatus}.',
  },
  workspaceCreateCheckStatusPage: {
    id: 'frontbucket.workspace.createWorkspaceError.checkStatusPage',
    description:
      'Text for the link in the description of the create workspace error',
    defaultMessage: 'check our status page',
  },
});

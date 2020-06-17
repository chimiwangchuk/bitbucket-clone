import { defineMessages } from 'react-intl';

export default defineMessages({
  heading: {
    id: 'frontbucket.repository.syncDialog.heading',
    description:
      'Heading of the modal dialog when syncing a repository fork to its parent',
    defaultMessage: 'Sync repository',
  },
  mergeError: {
    id: 'frontbucket.repository.syncDialog.mergeError',
    description:
      'Error message if an unknown error occurs when syncing a repository fork to its parent',
    defaultMessage: 'An unexpected error occurred',
  },
  mergeConflictError: {
    id: 'frontbucket.repository.syncDialog.mergeConflictError',
    description:
      'Error message if a merge conflict would occur when syncing a repository fork to its parent',
    defaultMessage:
      'We ran into some merge conflicts. Resolve {viewConflictLink} and try again.',
  },
  successFlagDescription: {
    id: 'frontbucket.repository.syncDialog.successFlagDescription',
    description:
      'Message displayed after successfully syncing a repository fork to its parent',
    defaultMessage:
      'You successfully synced {repositoryName} with commits from {repositoryParentName}',
  },
  successFlagTitle: {
    id: 'frontbucket.repository.syncDialog.successFlagTitle',
    description:
      'Title of the message displayed after successfully syncing a repository fork to its parent',
    defaultMessage: 'Your repository is now up-to-date',
  },
  syncButton: {
    id: 'frontbucket.repository.syncDialog.syncButton',
    description:
      'Text for the button that syncs a repository fork to its parent',
    defaultMessage: 'Sync',
  },
  viewConflictLink: {
    id: 'frontbucket.repository.mergeDialog.viewConflictLink',
    description:
      'Link to view the conflicts that would result from an attempted merge',
    defaultMessage: 'the conflicts',
  },
});

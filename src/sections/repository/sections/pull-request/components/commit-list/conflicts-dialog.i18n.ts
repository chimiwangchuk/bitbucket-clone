import { defineMessages } from 'react-intl';

export default defineMessages({
  conflictsDialogTitle: {
    id: 'frontbucket.repository.pullRequest.conflictsDialogTitle',
    description: 'Text for conflicts dialog title',
    defaultMessage: 'Syncing this branch will result in merge conflicts',
  },
  conflictsDialogMessage: {
    id: 'frontbucket.repository.pullRequest.conflictsDialogMessage',
    description: 'Text for conflicts dialog message',
    defaultMessage:
      'Resolve the merge conflicts before attempting to sync this branch.',
  },
  conflictsDialogInstruction: {
    id: 'frontbucket.repository.pullRequest.conflictsDialogInstruction',
    description: 'Text for conflicts dialog guide on how to resolve conflicts',
    defaultMessage:
      'To manually merge these changes into "{branch}", run the following commands:',
  },
  conflictsDialogWarning: {
    id: 'frontbucket.repository.pullRequest.conflictsDialogWarning',
    description: 'Text for conflicts dialog warning about git command',
    defaultMessage: 'Note: This will create a detached head!',
  },
  closeConflictsDialogButton: {
    id: 'frontbucket.repository.pullRequest.closeConflictsDialogButton',
    description: 'Text for the close button in the conflicts dialog',
    defaultMessage: 'Close',
  },
});

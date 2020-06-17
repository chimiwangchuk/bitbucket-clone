import { defineMessages } from 'react-intl';

export default defineMessages({
  sourceBranch: {
    id: 'frontbucket.branches.mergeDialogSourceBranch',
    description: 'Text for the destination branch label',
    defaultMessage: 'Source',
  },
  destinationBranch: {
    id: 'frontbucket.branches.mergeDialogDestinationBranch',
    description: 'Text for the source branch label',
    defaultMessage: 'Destination',
  },
  closeButton: {
    id: 'frontbucket.branches.closeDialogButton',
    description: 'Text for the close button in the merge dialog',
    defaultMessage: 'Close',
  },
  commitMessageLabel: {
    id: 'frontbucket.branches.commitMessageLabel',
    description: 'Text for the commit message label in the merge dialog',
    defaultMessage: 'Commit message',
  },
});

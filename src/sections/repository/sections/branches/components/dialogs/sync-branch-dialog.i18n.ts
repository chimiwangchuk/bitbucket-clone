import { defineMessages } from 'react-intl';

export default defineMessages({
  dialogTitle: {
    id: 'frontbucket.branches.syncDialogTitle',
    description: 'Text for the sync dialog title',
    defaultMessage: 'Sync branch',
  },
  actionName: {
    id: 'frontbucket.branches.syncActionName',
    description: 'Text for the sync button in the sync dialog',
    defaultMessage: 'Sync',
  },
  commitMessage: {
    id: 'frontbucket.branches.commitMessage',
    description: 'Text for the commit message in the sync dialog',
    defaultMessage: 'Merged {sourceBranchName} into {destinationBranchName}',
  },
});

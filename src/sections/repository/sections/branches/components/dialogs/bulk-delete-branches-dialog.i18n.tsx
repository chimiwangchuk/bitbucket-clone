import { defineMessages } from 'react-intl';

export default defineMessages({
  cancelButton: {
    id: 'frontbucket.branches.bulkDeleteBranchesDialog.cancelButton',
    description: 'Cancel button labe for the bulk delete branches dialog.',
    defaultMessage: 'Cancel',
  },
  dialogTitle: {
    id: 'frontbucket.branches.bulkDeleteBranches.dialogTitle',
    description: 'Title for the bulk delete branches dialog',
    defaultMessage: 'Delete branches',
  },
  dialogDescription: {
    id: 'frontbucket.branches.bulkDeleteBranches.dialogDescription',
    description: 'The message in the delete branches dialog',
    defaultMessage: 'Are you sure you want to delete the selected branches?',
  },
  deleteButton: {
    id: 'frontbucket.branches.bulkDeleteBranches.deleteButton',
    description: 'Delete button label for the delete branches dialog',
    defaultMessage: 'Delete',
  },
  showBranchesToBeDeletedHeader: {
    id: 'frontbucket.branches.bulkDeleteBranches.showBranchesToBeDeletedHeader',
    description:
      'Panel header which displays the list of branches to be deleted.',
    defaultMessage: 'Branches about to be deleted',
  },
  deleteSuccessTitle: {
    id: 'frontbucket.branches.bulkDeleteBranches.deleteSuccessTitle',
    description: 'Delete success flag title.',
    defaultMessage: 'Deleted successfully',
  },
  deleteSuccessDescription: {
    id: 'frontbucket.branches.bulkDeleteBranches.deleteSuccessDescription',
    description: 'Delete success flag description.',
    defaultMessage: 'All the selected branches have been deleted successfully.',
  },
  deleteFailedTitle: {
    id: 'frontbucket.branches.bulkDeleteBranches.deleteFailedTitle',
    description: 'Delete failed flag title.',
    defaultMessage: 'Failed to delete branches',
  },
  deleteFailedDescription: {
    id: 'frontbucket.branches.bulkDeleteBranches.deleteFailedDescription',
    description: 'Delete failed flag description.',
    defaultMessage:
      'We have failed to delete the selected branches. Please try again!',
  },
});

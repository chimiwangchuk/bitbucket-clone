import { defineMessages } from 'react-intl';

export default defineMessages({
  revertDialogTitle: {
    id: 'frontbucket.repository.pullRequest.revertDialogTitle',
    description: 'Title for revert PR dialog',
    defaultMessage: 'Revert pull request',
  },
  revertDialogGuide: {
    id: 'frontbucket.repository.pullRequest.revertDialogGuide',
    description: 'Title for the guide shown in revert dialog',
    defaultMessage: `Reverting a pull request creates a new branch and pull request to reverse the merged commit. You can update the branch name or use the one we created for you.`,
  },
  revertDialogAction: {
    id: 'frontbucket.repository.pullRequest.revertDialogAction',
    description: 'Text for the action to revert PR in dialog',
    defaultMessage: 'Revert',
  },
  revertDialogBranchName: {
    id: 'frontbucket.repository.pullRequest.revertDialogBranchName',
    description: 'Text for the label of the field with branch name',
    defaultMessage: 'Branch name',
  },
  revertDialogCommitMessage: {
    id: 'frontbucket.repository.pullRequest.revertDialogCommitMessage',
    description: 'Text for the label of the field with commit message',
    defaultMessage: 'Commit message',
  },
});

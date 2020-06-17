import { defineMessages } from 'react-intl';

const sync = defineMessages({
  compareBranchesSuccessTitle: {
    id: 'frontbucket.branches.syncBranchSuccessTitle',
    description: 'Text for the title of the branch sync success message',
    defaultMessage: 'Branch synced',
  },
  compareBranchesSuccessDescription: {
    id: 'frontbucket.branches.syncBranchSuccessDescription',
    description: 'Text for the description of the branch sync success message',
    defaultMessage:
      '{destinationBranch} successfully synced with {sourceBranch}',
  },
});

const merge = defineMessages({
  compareBranchesSuccessTitle: {
    id: 'frontbucket.branches.mergeBranchSuccessTitle',
    description: 'Text for the title of the branch merge success message',
    defaultMessage: 'Branch merged',
  },
  compareBranchesSuccessDescription: {
    id: 'frontbucket.branches.mergeBranchSuccessDescription',
    description: 'Text for the description of the branch merge success message',
    defaultMessage:
      '{sourceBranch} successfully merged into {destinationBranch}',
  },
});

export default {
  sync,
  merge,
};

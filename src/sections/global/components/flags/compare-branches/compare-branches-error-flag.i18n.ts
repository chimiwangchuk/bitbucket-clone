import { defineMessages } from 'react-intl';

const sync = defineMessages({
  compareBranchesErrorTitle: {
    id: 'frontbucket.branches.syncBranchErrorTitle',
    description: 'Text for the title of the branch sync error message',
    defaultMessage: 'Unable to sync branch',
  },
  compareBranchesErrorDescription: {
    id: 'frontbucket.branches.syncBranchErrorDescription',
    description: 'Text for the description of the branch sync error message',
    defaultMessage: `{destinationBranch} wasn't synced with {sourceBranch}`,
  },
});

const merge = defineMessages({
  compareBranchesErrorTitle: {
    id: 'frontbucket.branches.mergeBranchErrorTitle',
    description: 'Text for the title of the branch merge error message',
    defaultMessage: 'Unable to merge branch',
  },
  compareBranchesErrorDescription: {
    id: 'frontbucket.branches.mergeBranchErrorDescription',
    description: 'Text for the description of the branch merge error message',
    defaultMessage: `{sourceBranch} wasn't merged into {destinationBranch}`,
  },
});

export default {
  sync,
  merge,
};

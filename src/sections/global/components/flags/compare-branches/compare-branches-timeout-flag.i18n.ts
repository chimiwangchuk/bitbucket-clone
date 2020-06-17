import { defineMessages } from 'react-intl';

const sync = defineMessages({
  compareBranchesTimeoutTitle: {
    id: 'frontbucket.branches.syncBranchTimeoutTitle',
    description: 'Text for the title of the branch sync timeout message',
    defaultMessage: 'Branch sync',
  },
  compareBranchesTimeoutDescription: {
    id: 'frontbucket.branches.syncBranchTimeoutDescription',
    description: 'Text for the description of the branch sync timeout message',
    defaultMessage: `We’re having trouble retrieving some information. Try refreshing the page.`,
  },
  compareBranchesTimeoutAction: {
    id: 'frontbucket.branches.syncBranchTimeoutAction',
    description: 'Text for action to reload the page',
    defaultMessage: `Refresh`,
  },
});

const merge = defineMessages({
  compareBranchesTimeoutTitle: {
    id: 'frontbucket.branches.mergeBranchTimeoutTitle',
    description: 'Text for the title of the branch merge timeout message',
    defaultMessage: 'Branch merge',
  },
  compareBranchesTimeoutDescription: {
    id: 'frontbucket.branches.mergeBranchTimeoutDescription',
    description: 'Text for the description of the branch merge timeout message',
    defaultMessage: `We’re having trouble retrieving some information. Try refreshing the page.`,
  },
  compareBranchesTimeoutAction: {
    id: 'frontbucket.branches.mergeBranchTimeoutAction',
    description: 'Text for action to reload the page',
    defaultMessage: `Refresh`,
  },
});

export default {
  sync,
  merge,
};

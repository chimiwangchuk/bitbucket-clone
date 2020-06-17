import { defineMessages } from 'react-intl';

export default defineMessages({
  createBranchSuccessTitle: {
    id: 'frontbucket.branches.createBranchSuccessTitle',
    description: 'Text for the title of the create branch success message',
    defaultMessage: 'Branch created',
  },
  createBranchSuccessDescription: {
    id: 'frontbucket.branches.createBranchSuccessDescription',
    description: 'Text for the body of the create branch success message',
    defaultMessage: 'You successfully created the {branchLabel} branch.',
  },
  createBranchSuccessLinkText: {
    id: 'frontbucket.branches.createBranchSuccessLinkText',
    description:
      'Text for the link that takes the user to the branch they created',
    defaultMessage: 'Go to it',
  },
});

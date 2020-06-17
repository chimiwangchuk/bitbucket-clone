import { defineMessages } from 'react-intl';

const git = defineMessages({
  deleteBranchSuccessTitle: {
    id: 'frontbucket.branches.deleteBranchSuccessTitle',
    description:
      'Text for the title of the delete branch success message for a git repository',
    defaultMessage: 'Branch deleted',
  },
  deleteBranchSuccessDescription: {
    id: 'frontbucket.branches.deleteBranchSuccessDescription',
    description:
      'Text for the body of the delete branch success message for a git repository',
    defaultMessage: 'You successfully deleted the {branchLabel} branch.',
  },
});

const hg = defineMessages({
  deleteBranchSuccessTitle: {
    id: 'frontbucket.branches.closeBranchSuccessTitle',
    description:
      'Text for the title of the close branch success message for a mercurial repository',
    defaultMessage: 'Branch closed',
  },
  deleteBranchSuccessDescription: {
    id: 'frontbucket.branches.closeBranchSuccessDescription',
    description:
      'Text for the body of the close branch success message for a mercurial repository',
    defaultMessage: 'You successfully closed the {branchLabel} branch.',
  },
});

export default { git, hg };

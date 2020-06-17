import { defineMessages } from 'react-intl';

const git = defineMessages({
  deleteBranchErrorTitle: {
    id: 'frontbucket.branches.deleteBranchErrorTitle',
    description:
      'Text for the title of the delete branch error message for a git repository',
    defaultMessage: 'Unable to delete branch',
  },
  deleteBranchErrorDescriptionNotFound: {
    id: 'frontbucket.branches.deleteBranchErrorDescriptionNotFound',
    description:
      'Text for the body of the delete branch error message for a git repository',
    defaultMessage:
      "We couldn't find the {branchLabel} branch.  It might have already been deleted.",
  },
  deleteBranchErrorDescriptionAccessDenied: {
    id: 'frontbucket.branches.deleteBranchErrorDescriptionAccessDenied',
    description:
      'Text for the body of the delete branch error message for a git repository',
    defaultMessage:
      'You do not have permission to delete the {branchLabel} branch.',
  },
  deleteBranchErrorDescriptionGeneric: {
    id: 'frontbucket.branches.deleteBranchErrorDescriptionGeneric',
    description:
      'Text for the body of the delete branch error message for a git repository',
    defaultMessage: 'We were unable to delete the {branchLabel} branch.',
  },
});

const hg = defineMessages({
  deleteBranchErrorTitle: {
    id: 'frontbucket.branches.closeBranchErrorTitle',
    description:
      'Text for the title of the close branch error message for a mercurial repository',
    defaultMessage: 'Unable to close branch',
  },
  deleteBranchErrorDescriptionNotFound: {
    id: 'frontbucket.branches.closeBranchErrorDescriptionNotFound',
    description:
      'Text for the body of the close branch error message for a mercurial repository',
    defaultMessage:
      "We couldn't find the {branchLabel} branch.  It might have already been closed.",
  },
  deleteBranchErrorDescriptionAccessDenied: {
    id: 'frontbucket.branches.closeBranchErrorDescriptionAccessDenied',
    description:
      'Text for the body of the close branch error message for a mercurial repository',
    defaultMessage:
      'You do not have permission to close the {branchLabel} branch.',
  },
  deleteBranchErrorDescriptionGeneric: {
    id: 'frontbucket.branches.closeBranchErrorDescriptionGeneric',
    description:
      'Text for the body of the close branch error message for a mercurial repository',
    defaultMessage: 'We were unable to close the {branchLabel} branch.',
  },
});

export default { git, hg };

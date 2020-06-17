import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'frontbucket.pullRequest.outdatedCommentsDialogTitle',
    description: 'Title for the outdated comments dialog',
    defaultMessage: 'Comments on outdated versions',
  },
  subtitle: {
    id: 'frontbucket.pullRequest.outdatedCommentsDialogSubtitle',
    description: 'Description of who commented on the file',
    defaultMessage: '{name} commented on a file',
  },
  discardCommentsModalBody: {
    id: 'frontbucket.pullRequest.outdatedCommentsDialogDiscardWarning',
    description:
      'Body text of a confirmation dialog. Explains that unsaved comments will be lost upon closing the "outdated comments" modal.',
    defaultMessage:
      'Closing the {outdatedCommentsDialogTitle} dialog discards your unsaved comments.',
  },
  fileHeaderLozenge: {
    id: 'frontbucket.pullRequest.outdatedCommentsDialogFileHeaderLozenge',
    description:
      'Text for the lozenge in the file header of the outdated comments dialog',
    defaultMessage: 'Outdated',
  },
});

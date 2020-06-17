import { defineMessages } from 'react-intl';

export default defineMessages({
  diffSetLabel: {
    id: 'frontbucket.repository.pullRequest.diffSetLabel',
    description: 'Label for the page area showing the diffs in a pull request',
    defaultMessage: 'Diffs',
  },
  diffFileTitle: {
    id: 'frontbucket.repository.pullRequest.diffFileTitle',
    description: 'Title for the diff of a single file',
    defaultMessage: 'Diff of file {filepath}',
  },
  thisFile: {
    id: 'frontbucket.repository.pullRequest.diff.thisFile',
    description:
      'Label to indicate that the follow actions are for the current file only',
    defaultMessage: 'This file',
  },
  fileCount: {
    id: 'frontbucket.repository.pullRequest.diff.fileCount',
    description:
      'Header text for the diff files (lists the number of files in the diff)',
    defaultMessage: '{fileCount} {fileCount, plural, one {file} other {files}}',
  },
  fileRenamed: {
    id: 'frontbucket.repository.pullRequest.diff.fileRenamed',
    description: 'Text for empty renamed file diff',
    defaultMessage: 'File renamed but contents unchanged',
  },
  allFiles: {
    id: 'frontbucket.repository.pullRequest.diff.allFiles',
    description:
      'Label to indicate that the follow actions are for all files in this diff',
    defaultMessage: 'All files',
  },
  sideBySide: {
    id: 'frontbucket.repository.pullRequest.diff.sideBySide',
    description: 'Text for option to show side-by-side diffs',
    defaultMessage: 'View side-by-side',
  },
  unifiedDiff: {
    id: 'frontbucket.repository.pullRequest.diff.unifiedDiff',
    description: 'Text for option to show unified diffs',
    defaultMessage: 'View unified',
  },
  viewFile: {
    id: 'frontbucket.repository.pullRequest.diff.viewFile',
    description:
      'Text for option to view the diff of the file in the "Source" section of the repository',
    defaultMessage: 'Open in Source',
  },
  comment: {
    id: 'frontbucket.repository.pullRequest.diff.comment',
    description: 'Text for option to add a comment on a diffed file',
    defaultMessage: 'Add comment',
  },
  editFile: {
    id: 'frontbucket.repository.pullRequest.diff.editFile',
    description: 'Text for option to edit diffed files',
    defaultMessage: 'Edit file',
  },
  hideWordDiff: {
    id: 'frontbucket.repository.pullRequest.diff.hideWordDiff',
    description: 'Text for option to hide words in diffed files',
    defaultMessage: 'Hide word diff',
  },
  expandAll: {
    id: 'frontbucket.repository.pullRequest.diff.expandAll',
    description: 'Text for option to expand all diffed files',
    defaultMessage: 'Expand all files',
  },
  collapseAll: {
    id: 'frontbucket.repository.pullRequest.diff.collapseAll',
    description: 'Text for option to collapse all diffed files',
    defaultMessage: 'Collapse all files',
  },
  diffActionsButtonLabel: {
    id: 'frontbucket.repository.pullRequest.diff.actions.menu.label',
    description: 'Accessibility text label for diff actions menu',
    defaultMessage: 'Diff actions',
  },
  viewEntireFile: {
    id: 'frontbucket.repository.pullRequest.diff.viewEntireFile',
    description:
      'Text for option to load the entire contents of the diffed file, not just the changes and surrounding context',
    defaultMessage: 'View entire file',
  },
  missingDiffs: {
    id: 'frontbucket.repository.pullRequest.missingDiffs',
    description:
      'Description of a pull request diff section that has nothing to show',
    defaultMessage:
      'The source or destination branch was deleted, or these changes already exist in the destination repository.',
  },
  missingDiffsTitle: {
    id: 'frontbucket.repository.pullRequest.missingDiffsTitle',
    description:
      'Title of a pull request diff section that has nothing to show',
    defaultMessage: 'Nothing to merge',
  },
  diffError: {
    id: 'frontbucket.repository.pullRequest.diffError',
    description:
      'Description of a pull request diff section that has had an error',
    defaultMessage:
      'Wait a few moments, then try again. If this keeps happening, let us know at {contactLink}.',
  },
  noFiles: {
    id: 'frontbucket.repository.pullRequest.noFiles',
    description:
      'Description of a pull request diff section that has no modified files',
    defaultMessage: 'This pull request has no changed files to display.',
  },
  noFilesTitle: {
    id: 'frontbucket.repository.pullRequest.noFilesTitle',
    description:
      'Title of a pull request diff section that has no modified files',
    defaultMessage: 'Nothing has changed',
  },

  /*
   * Copy for diff alert modals.
   */
  discardCommentsModalTitle: {
    id: 'frontbucket.repository.pullRequest.discardCommentsModal.title',
    description:
      'Title of a confirmation dialog explaining that unsaved comments will be lost upon clicking the "Discard" button.',
    defaultMessage: 'Discard unsaved comments?',
  },
  discardCommentsModalDiscardButton: {
    id: 'frontbucket.repository.pullRequest.discardCommentsModal.discard',
    description:
      'Text for a button to discard unsaved comments, and proceed with the attempted action.',
    defaultMessage: 'Discard',
  },
  discardCommentsModalCancelButton: {
    id: 'frontbucket.repository.pullRequest.discardCommentsModal.cancel',
    description:
      'Text for a button to cancel an action, and prevent discarding unsaved comments.',
    defaultMessage: 'Cancel',
  },

  discardCommentsModalBody__SideBySideToggle: {
    id:
      'frontbucket.repository.pullRequest.discardCommentsModal.body.sideBySideToggle',
    description:
      'Body text of a confirmation dialog. Explains that unsaved comments will be lost upon changing to side-by-side view.',
    defaultMessage:
      'Changing to side-by-side view discards your unsaved comments.',
  },

  discardCommentsModalBody__ExpandContext: {
    id:
      'frontbucket.repository.pullRequest.discardCommentsModal.body.expandContext',
    description:
      'Body text of a confirmation dialog. Explains that unsaved comments will be lost upon showing more lines in the current view.',
    defaultMessage: 'Showing more lines discards your unsaved comments.',
  },

  discardCommentsModalBody__SameFileComment: {
    id:
      'frontbucket.repository.pullRequest.discardCommentsModal.body.sameFileComment',
    description:
      'Body text of a confirmation dialog. Explains that unsaved comments will be lost when user adds new comment in the same file.',
    defaultMessage:
      'Adding a new comment in the same file discards any unsaved comments.',
  },
});

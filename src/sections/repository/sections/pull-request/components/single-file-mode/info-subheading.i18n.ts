import { defineMessages } from 'react-intl';

export default defineMessages({
  introSingleFileMode: {
    id:
      'frontbucket.repository.pullRequest.singleFileModeInfoSubheading.introSingleFileMode',
    description:
      'Text to display to indicate to user they are in single file mode.',
    defaultMessage:
      'This is a {modeSubject}. Files will be loaded individually.',
  },
  introShortSingleFileMode: {
    id:
      'frontbucket.repository.pullRequest.singleFileModeInfoSubheading.introShortSingleFileMode',
    description:
      'Text to display to indicate to user they are in single file mode.',
    defaultMessage: 'This is a {modeSubject}',
  },
  largePr: {
    id:
      'frontbucket.repository.pullRequest.singleFileModeInfoSubheading.largePr',
    description: 'Text for large pull request.',
    defaultMessage: 'large pull request',
  },
  introAllFileMode: {
    id:
      'frontbucket.repository.pullRequest.singleFileModeInfoSubheading.introAllFileMode',
    description:
      'Text to display to indicate to user they are in all file mode.',
    defaultMessage: "You're viewing all files in a {modeSubject}.",
  },
  dialogMsgSingleFileMode: {
    id:
      'frontbucket.repository.pullRequest.singleFileModeInfoSubheading.dialogMsgSingleFileMode',
    description: 'Text to display in dialog of single file mode subheading.',
    defaultMessage:
      'You are viewing a large pull request. To view another file, use the file tree in the right sidebar or navigational buttons above the file.',
  },
  dialogMsgSingleFileModeStickyHeader: {
    id:
      'frontbucket.repository.pullRequest.singleFileModeInfoSubheading.dialogMsgSingleFileModeStickyHeader',
    description:
      'Text to display in dialog of single file mode subheading when in sticky header.',
    defaultMessage:
      'You are viewing a large pull request. To view another file, use the file tree in the right sidebar or navigational buttons in the header.',
  },
  dialogMsgAllFileMode: {
    id:
      'frontbucket.repository.pullRequest.singleFileModeInfoSubheading.dialogMsgAllFileMode',
    description: 'Text to display in dialog of single file mode subheading.',
    defaultMessage:
      "If you're having performance issues, try loading files individually.",
  },
  triggerBtnLabel: {
    id:
      'frontbucket.repository.pullRequest.singleFileModeInfoSubheading.triggerBtnLabel',
    description:
      'Text to be used for aria-label for button to trigger info dialog.',
    defaultMessage:
      'Button to open a dialog that provides info about current file view for large PRs.',
  },
});

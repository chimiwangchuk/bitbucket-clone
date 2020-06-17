import { defineMessages } from 'react-intl';

export default defineMessages({
  colorAccessibilityLabel: {
    id: 'frontbucket.pullRequest.settings.colorAccessibilityFiled',
    description: 'Label for the "color accessibility" form field',
    defaultMessage: 'Enable color accessibility',
  },
  diffViewModeLabel: {
    id: 'frontbucket.pullRequest.settings.diffViewModeLabel',
    description:
      'Label for the diff view mode form field ("unified" vs. "side by side")',
    defaultMessage: 'Diff view',
  },
  diffViewModeLabelSideBySide: {
    id: 'frontbucket.pullRequest.settings.diffViewModeLabelSideBySide',
    description: 'Label for the "side-by-side" diff view mode option',
    defaultMessage: 'Side-by-side',
  },
  diffViewModeLabelUnified: {
    id: 'frontbucket.pullRequest.settings.diffViewModeLabelUnified',
    description: 'Label for the "unified" diff view mode option',
    defaultMessage: 'Unified',
  },
  errorFlagDescription: {
    id: 'frontbucket.pullRequest.settings.errorFlagDescription',
    description:
      'The description text in the flag that appears after an attempt to update pull request settings fails',
    defaultMessage:
      'Some of the updates to your viewing preferences may not have been saved.',
  },
  errorFlagRetryButton: {
    id: 'frontbucket.pullRequest.settings.errorFlagRetryButton',
    description:
      'A button in the flag that appears after an attempt to update pull request settings fails. The button re-opens the settings modal.',
    defaultMessage: 'Try again',
  },
  errorFlagTitle: {
    id: 'frontbucket.pullRequest.settings.errorFlagTitle',
    description:
      'Title in the flag that appears after an attempt to update pull request settings fails',
    defaultMessage: 'Something went wrong',
  },
  iconLabel: {
    id: 'frontbucket.pullRequest.settings.iconLabel',
    description: 'Label for the pull request settings icon',
    defaultMessage: 'Pull request settings',
  },
  ignoreWhitespaceLabel: {
    id: 'frontbucket.pullRequest.settings.ignoreWhitespaceLabel',
    description: 'Label for the "ignore whitespace" form field',
    defaultMessage: 'Ignore whitespace',
  },
  modalHeading: {
    id: 'frontbucket.pullRequest.settings.modalHeading',
    description:
      'Heading text for the pull request settings modal. Also serves as the tooltip for the button that opens the modal.',
    defaultMessage: 'Viewing preferences',
  },
  successFlagDescription: {
    id: 'frontbucket.pullRequest.settings.successFlagDescription',
    description:
      'The description text in the flag that appears after succesfully updating pull request settings',
    defaultMessage: 'Your updated viewing preferences have been saved.',
  },
  wordDiffLabel: {
    id: 'frontbucket.pullRequest.settings.wordDiffLabel',
    description: 'Label for the "enable word diff" form field',
    defaultMessage: 'Enable word diff',
  },
  annotationsLabel: {
    id: 'frontbucket.pullRequest.settings.annotationsLabel',
    description: 'Label for the "enable annotations" form field',
    defaultMessage: 'Enable annotations',
  },
});

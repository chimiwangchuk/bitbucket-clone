import { defineMessages } from 'react-intl';

export default defineMessages({
  heading: {
    id: 'frontbucket.diff.excessiveDiff.heading',
    description: 'Diff view heading for excessively large diffs',
    defaultMessage: 'Diff too large',
  },
  description: {
    id: 'frontbucket.diff.excessiveDiff.description',
    description: 'Diff view message for excessively large diffs',
    defaultMessage:
      'The diff for this file is too large to render ({size} bytes).',
  },
  action: {
    id: 'frontbucket.diff.excessiveDiff.action',
    description: 'Wording for link to open a diff of the file',
    defaultMessage: "Open file's diff",
  },
  excludedFilesLinkText: {
    id: 'frontbucket.diff.excessiveDiff.excludedFilesLinkText',
    description:
      'Text for the link on an excessively large diff to learn about excluded files',
    defaultMessage: 'Learn how to always exclude this file',
  },
});

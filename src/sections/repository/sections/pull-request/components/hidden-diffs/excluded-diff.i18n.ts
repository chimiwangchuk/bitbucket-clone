import { defineMessages } from 'react-intl';

export default defineMessages({
  heading: {
    id: 'frontbucket.diff.excludeDiff.heading',
    description: 'Excluded diff view heading',
    defaultMessage: 'Excluded diff',
  },
  description: {
    id: 'frontbucket.diff.excludeDiff.description',
    description: 'Excluded diff view description',
    defaultMessage:
      'The diff for this file was excluded by the pattern "{pattern}".',
  },
  defaultLinkText: {
    id: 'frontbucket.diff.excludeDiff.defaultLinkText',
    description:
      'Text for the link that should appear on excluded diffs for non-admin users',
    defaultMessage: 'Learn more',
  },
  adminLinkText: {
    id: 'frontbucket.diff.excludeDiff.adminLinkText',
    description:
      'Text for the link that should appear on excluded diffs for repo admins',
    defaultMessage: 'Configure excluded files',
  },
  action: {
    id: 'frontbucket.diff.excludeDiff.action',
    description: 'Wording for link to open a diff of the file',
    defaultMessage: "Open file's diff",
  },
});

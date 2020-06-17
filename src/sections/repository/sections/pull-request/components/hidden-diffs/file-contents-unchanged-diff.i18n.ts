import { defineMessages } from 'react-intl';

export default defineMessages({
  heading: {
    id: 'frontbucket.diff.fileContentsUnchangedDiff.heading',
    description: 'File contents unchanged diff view heading',
    defaultMessage: 'File contents unchanged',
  },
  description: {
    id: 'frontbucket.diff.fileContentsUnchangedDiff.description',
    description: 'File contents unchanged diff view description',
    defaultMessage: 'There are only whitespace differences to display.',
  },
  action: {
    id: 'frontbucket.diff.fileContentsUnchangedDiff.action',
    description: 'Wording for link to show whitespace in the diff',
    defaultMessage: 'Show whitespace',
  },
});

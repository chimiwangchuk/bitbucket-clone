import { defineMessages } from 'react-intl';

export default defineMessages({
  heading: {
    id: 'frontbucket.diff.binary.heading',
    description: 'Binary diff view heading',
    defaultMessage: 'Binary file',
  },
  description: {
    id: 'frontbucket.diff.binary.description',
    description: 'Binary diff view description',
    defaultMessage:
      "We can't show you the diff for this binary file here, but you can open the diff in a new tab instead.",
  },
  action: {
    id: 'frontbucket.diff.binary.action',
    description: 'Wording for link to open a file',
    defaultMessage: "Open file's diff",
  },
});

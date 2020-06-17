import { defineMessages } from 'react-intl';

export default defineMessages({
  dialogHeading: {
    id: 'frontbucket.diffCommentDialog.heading',
    description: 'Diff comment dialog heading',
    defaultMessage:
      '{commentsCount, plural, one { Comment on {filepath}} other { Comments on {filepath}}}',
  },
});

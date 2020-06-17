import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'frontbucket.diffCommentDialogTrigger.title',
    description:
      'Wording for link button to open a modal with the comments for the file',
    defaultMessage:
      '{commentsCount, plural, one {View ({commentsCount}) comment } other {View ({commentsCount}) comments }}',
  },
});

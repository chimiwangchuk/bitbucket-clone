import { defineMessages } from 'react-intl';

export default defineMessages({
  likeCommentLabel: {
    id: 'frontbucket.repository.pullRequestConversation.likeCommentLabel',
    description:
      'Label for button which likes a comment in the pull request comments section',
    defaultMessage: 'Like',
  },
  unlikeCommentLabel: {
    id: 'frontbucket.repository.pullRequestConversation.unlikeCommentLabel',
    description:
      'Label for button which unlikes a comment in the pull request comments section',
    defaultMessage: 'Unlike',
  },
  numberOfLikes: {
    id: 'frontbucket.repository.pullRequestConversation.numberOfLikes',
    description: 'Number of likes on a pull request comment',
    defaultMessage:
      '{numberOfLikes, plural, one {{numberOfLikes} like} other {{numberOfLikes} likes}}',
  },
  likersLabel: {
    id: 'frontbucket.repository.pullRequestConversation.likersLabel',
    description: 'Label in the tooltip that displays the likers of a comment',
    defaultMessage: 'People who liked this',
  },
});

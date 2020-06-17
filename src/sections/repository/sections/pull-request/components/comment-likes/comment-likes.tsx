import React from 'react';
import LikeIcon from '@atlaskit/icon/glyph/like';
import Tooltip from '@atlaskit/tooltip';
import { FormattedMessage } from 'react-intl';
import { CommentLikes } from 'src/components/conversation-provider/types';
import { User } from 'src/components/types';
import messages from './comment-likes.i18n';
import { isCommentLikedByUser, getCommentLikers } from './utils';

type Props = {
  commentId: number;
  commentLikes?: CommentLikes[];
  currentUser?: User | null;
};

export const PullRequestCommentLikeButton = React.memo((props: Props) => {
  const { commentId, commentLikes, currentUser } = props;
  if (isCommentLikedByUser(commentId, commentLikes, currentUser)) {
    return <FormattedMessage {...messages.unlikeCommentLabel} />;
  }
  return <FormattedMessage {...messages.likeCommentLabel} />;
});

const NumberOfLikesLabel = React.memo((props: { likers: User[] }) => {
  const { likers } = props;
  const messageProps = {
    ...messages.numberOfLikes,
    values: {
      numberOfLikes: likers.length,
    },
  };
  return <FormattedMessage {...messageProps} />;
});

export const PullRequestCommentLikers = React.memo((props: Props) => {
  const { commentId, commentLikes } = props;
  const likers = getCommentLikers(commentId, commentLikes);

  return (
    <Tooltip
      content={
        <React.Fragment>
          <FormattedMessage {...messages.likersLabel} />
          {likers.map(liker => (
            <div key={`comment-${commentId}-like-${liker.uuid}`}>
              {liker.display_name}
            </div>
          ))}
        </React.Fragment>
      }
    >
      <React.Fragment>
        <LikeIcon label="" size="small" />
        <NumberOfLikesLabel likers={likers} />
      </React.Fragment>
    </Tooltip>
  );
});

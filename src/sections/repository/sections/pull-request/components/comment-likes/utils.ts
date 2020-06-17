import { CommentLikes } from 'src/components/conversation-provider/types';
import { User } from 'src/components/types';
import { TOGGLE_COMMENT_LIKE } from 'src/redux/pull-request/actions';
import { commentLikes as commentLikesSchema } from 'src/redux/pull-request/schemas';
import { publishUiEvent } from 'src/utils/analytics/publish';

export const isCommentLikedByUser = (
  commentId: number,
  commentLikes?: CommentLikes[],
  currentUser?: User | null
): boolean => {
  if (!commentLikes || !currentUser) {
    return false;
  }
  const likes = commentLikes.find(
    commentLike => commentLike.commentId === commentId
  );
  if (likes) {
    return !!likes.users.find(user => user.uuid === currentUser?.uuid);
  }
  return false;
};

export const getCommentLikers = (
  commentId: number,
  commentLikes?: CommentLikes[]
): User[] => {
  if (!commentId || !commentLikes || commentLikes.length === 0) {
    return [];
  }
  const likes = commentLikes.find(
    commentLike => commentLike.commentId === commentId
  );
  return likes ? likes.users : [];
};

export const toggledCommentLike = (
  commentId: number,
  commentLikes?: CommentLikes[],
  currentUser?: User | null
) => {
  if (!currentUser || !commentLikes) {
    return {};
  }
  const likers = getCommentLikers(commentId, commentLikes);

  if (likers.find(user => user.uuid === currentUser.uuid)) {
    return {
      commentId,
      users: likers.filter(user => user.uuid !== currentUser.uuid),
    };
  }
  return {
    commentId,
    users: [...likers, currentUser],
  };
};

export const toggleCommentLikeAction = (
  commentId: number,
  commentLikes?: CommentLikes[],
  currentUser?: User | null
) => ({
  type: TOGGLE_COMMENT_LIKE.REQUEST,
  payload: {
    commentId,
    setToLike: !isCommentLikedByUser(commentId, commentLikes, currentUser),
    commentLike: toggledCommentLike(commentId, commentLikes, currentUser),
  },
  meta: {
    schema: {
      commentLike: commentLikesSchema,
    },
  },
});

export const publishCommentLikesUiEvent = (
  repoUUID: string,
  prId: string,
  commentId: number,
  setToLike: boolean
) => {
  publishUiEvent({
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'likePullRequestCommentButton',
    source: 'pullRequestScreen',
    objectId: `${repoUUID}/${prId}`,
    objectType: 'repository',
    attributes: {
      action: setToLike ? 'liked' : 'unlike',
      commentId,
    },
  });
};

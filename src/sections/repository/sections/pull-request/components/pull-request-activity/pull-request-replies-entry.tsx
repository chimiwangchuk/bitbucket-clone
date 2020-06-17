import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  FabricConversation,
  FabricComment,
} from 'src/components/conversation-provider/types';
import messages from './pull-request-activity-events.i18n';
import * as styles from './pull-request-event.styled';
import { CommentContextMessage } from './comment-context-message';
import { usePublishActivityUiEvent } from './hooks';

type Props = {
  event: FabricConversation;
};

const toIds = (comment: FabricComment) => comment.createdBy.id;
const unique = (value: unknown, index: number, array: unknown[]) =>
  array.indexOf(value) === index;
const isNotDeleted = (comment: FabricComment) => !comment.deleted;

const uniqueAuthors = (comments: FabricComment[]) => {
  return comments
    .slice(1) // Ignore the root comment author
    .filter(isNotDeleted) // Don't count deleted comments
    .map(toIds) // Get author ids
    .filter(unique).length; // Only care about how many unique ones
};

export const PullRequestRepliesEntry = ({ event }: Props) => {
  const publish = usePublishActivityUiEvent('comment-replies');
  const { meta, comments } = event;

  const latestComment = comments.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )[comments.length - 1];
  const actorName = latestComment.createdBy.name;
  const otherAuthors = uniqueAuthors(comments) - 1;

  return (
    <styles.RightToLeftContainer>
      {actorName}{' '}
      {otherAuthors > 0 && (
        <FormattedMessage
          {...messages.repliesConjunction}
          values={{ authors: otherAuthors }}
        >
          {(...text) => <Fragment>{text} </Fragment>}
        </FormattedMessage>
      )}
      <FormattedMessage {...messages.repliesMessage} />{' '}
      <CommentContextMessage
        meta={meta}
        id={latestComment.commentId}
        onPermalinkClick={publish}
      />
    </styles.RightToLeftContainer>
  );
};

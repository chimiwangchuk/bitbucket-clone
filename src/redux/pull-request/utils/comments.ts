import {
  FabricConversation,
  CodeReviewConversation,
  ApiComment,
} from 'src/components/conversation-provider/types';
import {
  buildInlineConversations,
  getNumOfComments,
  toConversation,
} from 'src/components/conversation-provider/utils';
import { getCreatedBy } from 'src/components/conversation-provider/utils/get-created-by';

function isGlobalComment(comment: ApiComment) {
  return !comment.inline;
}

// This function is exported so it can be used in tests that need to mock CodeReviewConversations
export function getMinimalConversationData(
  conversation: FabricConversation
): CodeReviewConversation {
  const { conversationId, meta, createdAt, comments } = conversation;
  const commentMetaData = comments.map(comment => {
    const { commentId } = comment;
    return {
      id: commentId,
      permalink: `comment-${commentId}`,
      authorUuid: comment.createdBy.id,
    };
  });

  return {
    conversationId,
    comments: commentMetaData,
    meta,
    numOfComments: getNumOfComments(conversation),
    createdAt,
    createdBy: getCreatedBy(conversation),
  };
}

export function formatAllComments(
  commentValues: ApiComment[] = [],
  containerId: string
) {
  const globalComments = commentValues.filter(isGlobalComment);
  const globalConversation = toConversation(globalComments, containerId);

  const inlineConversations = buildInlineConversations(
    commentValues,
    containerId
  );

  // Global Convo must go first!
  const fabricConversations = globalConversation
    ? [globalConversation, ...inlineConversations]
    : inlineConversations;

  return {
    fabricConversations,
    conversations: fabricConversations.map(getMinimalConversationData) || [],
  };
}

export function isFileLevelComment(conversation: CodeReviewConversation) {
  return (
    conversation.meta.from === null &&
    conversation.meta.to === null &&
    conversation.meta.path
  );
}

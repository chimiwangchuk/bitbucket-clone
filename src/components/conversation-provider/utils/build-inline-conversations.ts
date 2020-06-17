import { FabricConversation, ApiComment } from '../types';
import { extractCommentThread } from './extract-comment-thread';
import { toConversation } from './to-conversation';

const isTopLevelInlineComment = (comment: ApiComment) =>
  !comment.parent && comment.inline;

export function buildInlineConversations(
  allComments: ApiComment[],
  containerId: string
): FabricConversation[] {
  const topLevelInlineComments = allComments.filter(isTopLevelInlineComment);

  const commentThreads = topLevelInlineComments.map(comment =>
    extractCommentThread(allComments, comment)
  );

  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }

  const inlineConversations = commentThreads
    .map(thread => toConversation(thread, containerId))
    .filter(notEmpty);

  return inlineConversations;
}

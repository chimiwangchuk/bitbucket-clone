import { FabricConversation } from '../types';

export const getNumOfComments = (
  conversation: FabricConversation | null | undefined
) => {
  if (!conversation) {
    return 0;
  }

  return conversation.comments.reduce(
    (count, comment) => (comment.deleted ? count : count + 1),
    0
  );
};

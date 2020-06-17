import { CodeReviewConversation } from 'src/components/conversation-provider/types';

export const parseId = (c: CodeReviewConversation): string =>
  c.conversationId.replace('conversation-', '');

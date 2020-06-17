import {
  ConversationResource,
  FETCH_CONVERSATIONS_SUCCESS as FABRIC_FETCH_CONVERSATIONS_SUCCESS,
} from '@atlaskit/conversation';
import { ProviderConfig, FabricConversation } from '../types';
import { toFabricUser } from '../utils';
import { addComment } from './add-comment';
import { create } from './create';
import { deleteComment } from './delete-comment';
import { updateComment } from './update-comment';

export class ConversationProvider extends ConversationResource {
  static getProvider(config: ProviderConfig) {
    // @ts-ignore
    return new ConversationProvider({
      ...config,
      // @ts-ignore
      user: config.user ? toFabricUser(config.user) : null,
    });
  }

  // @ts-ignore
  addComment = addComment;
  // @ts-ignore
  create = create;

  deleteComment = deleteComment;

  // @ts-ignore
  getConversations(conversations: FabricConversation[]) {
    const { dispatch } = this;

    // Updates fabric internal store (excluding outdated comments)
    dispatch({
      type: FABRIC_FETCH_CONVERSATIONS_SUCCESS,
      payload: conversations,
    });

    return Promise.resolve(conversations);
  }

  getConversation(conversationId: string) {
    // @ts-ignore
    const [conversation] = this.store
      .getState()
      .conversations.filter(c => c.conversationId === conversationId);

    return conversation;
  }
  // @ts-ignore
  updateComment = updateComment;
}

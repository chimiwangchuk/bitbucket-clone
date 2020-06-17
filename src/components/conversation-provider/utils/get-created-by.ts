import { FabricConversation, FabricUser } from '../types';
import { toFabricUser } from './user-utils';

export const getCreatedBy = (conversation: FabricConversation): FabricUser => {
  const user: Maybe<FabricUser> = conversation.comments
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map(comment => comment.createdBy)[0];
  // If we didn't find a creator we just use a "blank" fabric user
  return user || toFabricUser(null);
};

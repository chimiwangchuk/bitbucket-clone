import { FabricComment, ApiComment } from '../types';
import { parse } from '../serializer';
import { toFabricUser } from './user-utils';

export function toComment(
  comment: ApiComment,
  conversationId: string
): FabricComment {
  const { id, created_on: createdAt, user, parent, deleted } = comment;
  let doc;

  if (!deleted) {
    doc = {
      adf: {
        version: 1,
        ...parse(comment.content.html),
      },
    };
  }

  return {
    conversationId,
    commentId: id,
    localId: id,
    parentId: parent ? parent.id : undefined,
    createdAt,
    createdBy: toFabricUser(user),
    deleted,
    document: doc as any,
  };
}

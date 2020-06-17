import {
  FabricComment,
  FabricConversation,
  InlineField,
  ApiComment,
} from '../types';
import { toComment } from './to-comment';

// @ts-ignore TODO: fix noImplicitAny error here
function hasValidChildren(
  currentComment: ApiComment,
  rawComments: ApiComment[]
) {
  const children = rawComments.filter(
    comment => comment.parent && comment.parent.id === currentComment.id
  );

  if (children.some(c => !c.deleted)) {
    // If any immediate children are undeleted then we know we need to render
    return true;
  }

  // Check children at depth
  return children.some(childComment =>
    hasValidChildren(childComment, rawComments)
  );
}

/* Note: Order of the incoming comments matters.  Parents must come before
 * children in the array.  The original fetch of the comments returns them
 * in the correct expected order.
 */
export function toConversation(
  rawComments: ApiComment[],
  containerId: string,
  localId?: string
): FabricConversation | undefined {
  if (!rawComments.length) {
    return undefined;
  }

  const [firstComment] = rawComments;
  const conversationId = `conversation-${firstComment.id}`;

  // TODO: THIS NEEDS OPTIMIZING
  const children = rawComments.reduce(
    (processedComments: FabricComment[], currentComment: ApiComment) => {
      const { parent } = currentComment;
      const isTopLevel = !parent;

      if (
        !currentComment.deleted ||
        hasValidChildren(currentComment, rawComments)
      ) {
        const isDescendant = () =>
          processedComments.some(
            fabricComment => !!parent && fabricComment.commentId === parent.id
          );

        if (isTopLevel || isDescendant()) {
          processedComments.push(toComment(currentComment, conversationId));
        }
      }

      return processedComments;
    },
    []
  );

  if (!children.length) {
    return undefined;
  }

  return {
    containerId,
    conversationId,
    localId,
    meta: firstComment.inline || ({} as InlineField),
    comments: children,
    createdAt: firstComment.created_on,
  };
}

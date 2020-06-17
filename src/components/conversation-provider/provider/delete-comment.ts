import { DELETE_COMMENT_SUCCESS as FABRIC_DELETE_COMMENT_SUCCESS } from '@atlaskit/conversation';
import authRequest, { jsonHeaders } from 'src/utils/fetch';

/**
 * Deletes a comment based on ID. Returns updated comment.
 */
export async function deleteComment(conversationId: string, commentId: string) {
  // eslint-disable-next-line babel/no-invalid-this
  const { config } = this;
  const { urls, onDeleteComment } = config;

  const response = await fetch(
    authRequest(urls.commentDelete(commentId), {
      method: 'DELETE',
      headers: jsonHeaders,
    })
  );

  if (!response.ok) {
    throw Error(response.statusText);
  }

  // eslint-disable-next-line babel/no-invalid-this
  const { dispatch: internalDispatch } = this;
  const payload = {
    commentId,
    conversationId,
    deleted: true,
    document: {},
  };

  // Updates internal store
  internalDispatch({ type: FABRIC_DELETE_COMMENT_SUCCESS, payload });

  // Update frontbucket's store
  if (onDeleteComment) {
    onDeleteComment({ id: commentId });
  }

  return payload;
}

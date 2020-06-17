import {
  ADD_COMMENT_SUCCESS as FABRIC_ADD_COMMENT_SUCCESS,
  ADD_COMMENT_REQUEST as FABRIC_ADD_COMMENT_REQUEST,
} from '@atlaskit/conversation';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { encode } from '../serializer';
import { toComment } from '../utils';
import { ADF, ApiComment, ProviderConfig } from '../types';

/**
 * Adds a comment to a conversation.
 */
export async function addComment(
  conversationId: string,
  parentId: string,
  doc: ADF
) {
  // eslint-disable-next-line babel/no-invalid-this
  const { config, dispatch: internalDispatch } = this;
  const { urls, onAddComment, anchor, destRev } = config as ProviderConfig;

  // eslint-disable-next-line babel/no-invalid-this
  const tempComment = this.createComment(conversationId, parentId, doc);
  const { localId } = tempComment;

  if (tempComment) {
    internalDispatch({
      type: FABRIC_ADD_COMMENT_REQUEST,
      payload: tempComment,
    });
  }

  const md = encode(doc);
  // eslint-disable-next-line babel/no-invalid-this
  const conversation = this.getConversation(conversationId);
  const { meta } = conversation;

  const inline = meta && meta.path ? { path: meta.path } : undefined;

  const response = await fetch(
    authRequest(urls.commentSave(), {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        content: {
          raw: md,
        },
        parent: parseInt(parentId, 10) ? { id: parentId } : undefined,
        inline,
        anchor,
        dest_rev: destRev,
      }),
    })
  );

  if (!response.ok) {
    throw Error(response.statusText);
  }

  const result: ApiComment = await response.json();

  // Never treat a comment we just created as outdated.
  // (See COREX-1933)
  if (result.inline && result.inline.outdated) {
    result.inline.outdated = false;
  }

  const comment = toComment(result, conversationId);

  // Update internal store
  internalDispatch({
    type: FABRIC_ADD_COMMENT_SUCCESS,
    payload: {
      ...comment,
      localId,
    },
  });

  // Update frontbucket's store
  if (onAddComment) {
    onAddComment(result);
  }

  return comment;
}

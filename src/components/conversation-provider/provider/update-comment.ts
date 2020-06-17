import {
  UPDATE_COMMENT_REQUEST as FABRIC_UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS as FABRIC_UPDATE_COMMENT_SUCCESS,
} from '@atlaskit/conversation';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { encode } from '../serializer';
import { toComment } from '../utils';
import { ADF } from '../types';

/**
 * Updates a comment based on ID. Returns updated content
 */
export async function updateComment(
  conversationId: string,
  commentId: string,
  doc: ADF
) {
  // eslint-disable-next-line babel/no-invalid-this
  const { config, dispatch } = this;
  const { urls } = config;

  // eslint-disable-next-line babel/no-invalid-this
  const tempComment = this.getComment(conversationId, commentId);
  if (tempComment) {
    dispatch({
      type: FABRIC_UPDATE_COMMENT_REQUEST,
      payload: {
        ...tempComment,
        document: {
          adf: doc,
        },
      },
    });
  }

  const md = encode(doc);

  const response = await fetch(
    authRequest(urls.commentUpdate(commentId), {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify({
        content: {
          raw: md,
        },
      }),
    })
  );

  if (!response.ok) {
    throw Error(response.statusText);
  }

  const result = await response.json();
  const comment = toComment(result, conversationId);

  // UPDATE INTERNAL STORE
  dispatch({ type: FABRIC_UPDATE_COMMENT_SUCCESS, payload: comment });

  return comment;
}

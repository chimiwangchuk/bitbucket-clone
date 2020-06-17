import {
  CREATE_CONVERSATION_SUCCESS as FABRIC_CREATE_CONVERSATION_SUCCESS,
  CREATE_CONVERSATION_REQUEST as FABRIC_CREATE_CONVERSATION_REQUEST,
} from '@atlaskit/conversation';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { encode } from '../serializer';
import { toConversation } from '../utils';
import { ADF } from '../types';

/**
 * Creates a new Conversation and associates it with the containerId provided.
 */
export async function create(
  localId: string,
  value: ADF,
  meta: any,
  objectId: any,
  containerId: string
) {
  // eslint-disable-next-line babel/no-invalid-this
  const { config, dispatch: internalDispatch } = this;
  const { urls, onAddComment, anchor, destRev } = config;

  const metaData = {
    ...meta,
  };

  if (metaData.to === null) {
    delete metaData.to;
  }

  if (metaData.from === null) {
    delete metaData.from;
  }

  // eslint-disable-next-line babel/no-invalid-this
  const tempConversation = this.createConversation(
    localId,
    value,
    meta,
    objectId,
    containerId
  );

  if (tempConversation) {
    internalDispatch({
      type: FABRIC_CREATE_CONVERSATION_REQUEST,
      payload: {
        ...tempConversation,
      },
    });
  }

  const md = encode(value);
  const isInlineComment = Object.keys(metaData).length > 0;

  const response = await fetch(
    authRequest(urls.commentSave(), {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        content: {
          raw: md,
        },
        inline: isInlineComment ? metaData : undefined,
        anchor,
        dest_rev: destRev,
      }),
    })
  );

  if (!response.ok) {
    throw Error(response.statusText);
  }

  const result = await response.json();

  // Never treat a comment we just created as outdated.
  // (See COREX-1933)
  if (result.inline && result.inline.outdated) {
    result.inline.outdated = false;
  }

  const conversation = toConversation([result], containerId, localId);

  if (conversation) {
    // Update internal store
    internalDispatch({
      type: FABRIC_CREATE_CONVERSATION_SUCCESS,
      payload: conversation,
    });

    // Update frontbucket's store
    if (onAddComment) {
      onAddComment(result);
    }
  }

  return conversation;
}

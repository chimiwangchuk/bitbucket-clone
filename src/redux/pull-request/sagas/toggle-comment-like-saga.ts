import { call, select, put } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import urls from 'src/redux/pull-request/urls';
import authRequest from 'src/utils/fetch';
import { Action } from 'src/types/state';
import { commentLikes as commentLikesSchema } from 'src/redux/pull-request/schemas';
import { getCurrentUser } from 'src/selectors/user-selectors';
import {
  toggledCommentLike,
  publishCommentLikesUiEvent,
} from 'src/sections/repository/sections/pull-request/components/comment-likes/utils';
import { getCurrentRepositoryUuid } from 'src/selectors/repository-selectors';
import { TOGGLE_COMMENT_LIKE } from '../actions';
import {
  getCurrentPullRequestUrlPieces,
  getCommentLikes,
  getCurrentPullRequestId,
} from '../selectors';

export function* toggleCommentLike(action: Action) {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const {
    result: { commentId, setToLike },
  } = action.payload;

  const commentLikesUrl = urls.api.internal.likeComment(
    owner,
    slug,
    id,
    commentId
  );
  const authUrl = authRequest(commentLikesUrl, {
    method: setToLike ? 'POST' : 'DELETE',
  });

  const repoUUID = yield select(getCurrentRepositoryUuid);
  const prId = yield select(getCurrentPullRequestId);
  publishCommentLikesUiEvent(repoUUID, prId, commentId, setToLike);

  const currentUser = yield select(getCurrentUser);
  const commentLikes = yield select(getCommentLikes, [{ id: commentId }]);

  try {
    const response = yield call(fetch, authUrl);
    if (response.ok) {
      yield put({
        type: TOGGLE_COMMENT_LIKE.SUCCESS,
      });
    } else if (
      (setToLike && response.status === 400) ||
      (!setToLike && response.status === 500)
    ) {
      // COREX-2086: Comment Likes API should not emit 500 if a comment is already unliked
      // Comment was already liked / unliked
      yield put({
        type: TOGGLE_COMMENT_LIKE.SUCCESS,
      });
    } else {
      // An unknown situation occured, reverse the pre-emptive comment likes change
      yield put({
        type: TOGGLE_COMMENT_LIKE.ERROR,
        payload: toggledCommentLike(commentId, commentLikes, currentUser),
        meta: {
          schema: commentLikesSchema,
        },
      });
    }
  } catch (e) {
    yield put({
      type: TOGGLE_COMMENT_LIKE.ERROR,
      payload: toggledCommentLike(commentId, commentLikes, currentUser),
      meta: {
        schema: commentLikesSchema,
      },
    });
    Sentry.captureException(e);
  }
}

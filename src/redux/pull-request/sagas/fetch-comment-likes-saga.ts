import * as Sentry from '@sentry/browser';
import { put, call, select } from 'redux-saga/effects';
import urls from 'src/redux/pull-request/urls';
import { FETCH_COMMENT_LIKES } from 'src/redux/pull-request/actions';
import { commentLikes as commentLikesSchema } from 'src/redux/pull-request/schemas';
import { getPullRequestApis } from 'src/sagas/helpers';
import { ApiCommentLikes } from 'src/components/conversation-provider/types';
import { getCurrentPullRequestUrlPieces } from '../selectors';

export function* fetchCommentLikesPage(url: string): any {
  if (!url) {
    return;
  }
  const api = yield* getPullRequestApis();
  try {
    const response = yield call(api.getCommentLikes, url);
    const commentLikes = response.values.map((clEntry: ApiCommentLikes) => ({
      commentId: clEntry.comment_id,
      users: clEntry.users,
    }));

    yield put({
      type: FETCH_COMMENT_LIKES.SUCCESS,
      payload: {
        commentLikes,
      },
      meta: {
        schema: {
          commentLikes: [commentLikesSchema],
        },
      },
    });
    yield* fetchCommentLikesPage(response.next);
  } catch (e) {
    yield put({
      type: FETCH_COMMENT_LIKES.ERROR,
    });
  }
}

export function* fetchCommentLikes() {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);

  if (!owner || !slug || !id) {
    Sentry.captureMessage(
      `Tried to fetch comment likes but lacked something ${JSON.stringify({
        owner,
        slug,
        id,
      })}`
    );
    return;
  }

  const commentLikesFirstPageUrl = urls.api.internal.commentLikes(
    owner,
    slug,
    id
  );
  yield* fetchCommentLikesPage(commentLikesFirstPageUrl);
}

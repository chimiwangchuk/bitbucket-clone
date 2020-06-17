import { put, select, fork } from 'redux-saga/effects';
import { FETCH_COMMENTS } from 'src/redux/pull-request/actions';
import {
  getCurrentPullRequestUrlPieces,
  getContainerId,
} from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import { fetchComments } from 'src/sagas/fetch-comments-saga';
import { ApiComment } from 'src/components/conversation-provider/types';

type Args = {
  containerId: string;
  url: string;
  previousPagesComments?: ApiComment[];
};

// @ts-ignore TODO: fix noImplicitAny error here
function* completeComments({
  containerId,
  url,
  previousPagesComments = [],
}: Args) {
  const {
    nextUrl,
    commentValues,
    error,
  }: {
    nextUrl?: string;
    commentValues?: ApiComment[];
    error?: string;
  } = yield* fetchComments({
    url,
  });

  if (error) {
    yield put({
      type: FETCH_COMMENTS.ERROR,
      error: true,
    });
    return;
  }

  const isDoneFetching = !nextUrl;
  const allComments = [...previousPagesComments, ...commentValues];

  if (isDoneFetching) {
    yield put({
      type: FETCH_COMMENTS.SUCCESS,
      payload: {
        rawComments: allComments,
      },
    });
  } else {
    yield fork(completeComments, {
      containerId,
      url: nextUrl,
      // Conversations need all parents to build threads correctly
      previousPagesComments: allComments,
    });
  }
}

// Intended to fire after a PullRequest is successfully fetch, so state holds the info we need
export function* fetchPullRequestComments() {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const containerId = yield select(getContainerId);

  const url = urls.api.internal.orderedCommentsFetch(owner, slug, id);

  yield* completeComments({ containerId, url });
}

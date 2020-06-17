import { all, call, select, take, put } from 'redux-saga/effects';
import { ParametricSelector } from 'reselect';
import {
  FETCH_OUTDATED_COMMENT_CONTEXT,
  FETCH_LARGE_FILE_COMMENT_CONTEXT,
} from 'src/redux/pull-request/actions';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import {
  getOutdatedConversationsForFile,
  getAllConversationsForFile,
} from 'src/selectors/conversation-selectors';
import { CommentByIdApiType } from 'src/redux/pull-request/api';
import { parseId } from 'src/redux/pull-request/sagas/utils/conversations';
import { AsyncAction } from 'src/redux/actions';
import { CodeReviewConversation } from 'src/components/conversation-provider/types';

import { BucketState } from 'src/types/state';
import { DiffPaths } from 'src/utils/extract-file-path';

type SelectorParameter = {
  file: DiffPaths;
};

function createFetchCommentContextSaga(
  action: AsyncAction,
  conversationsSelector: ParametricSelector<
    BucketState,
    SelectorParameter,
    CodeReviewConversation[]
  >
) {
  return function*(getCommentById: CommentByIdApiType) {
    while (true) {
      try {
        const { payload } = yield take(action.REQUEST);
        const { owner, slug, id } = yield select(
          getCurrentPullRequestUrlPieces
        );
        const conversations = yield select(conversationsSelector, payload);

        // @ts-ignore TODO: fix noImplicitAny error here
        const conversationsWithoutContext = conversations.filter(c => {
          return c.meta && c.meta.context_lines === undefined;
        });

        // If none need updating then bail out
        if (conversationsWithoutContext.length === 0) {
          continue;
        }

        const contextsResults = yield all(
          // @ts-ignore TODO: fix noImplicitAny error here
          conversationsWithoutContext.map(c =>
            call(getCommentById, owner, slug, id, parseId(c))
          )
        );

        // @ts-ignore TODO: fix noImplicitAny error here
        const contexts = contextsResults.map(cr => {
          if ('status' in cr) {
            return {
              inline: {
                context_lines: '',
              },
            };
          } else {
            return cr;
          }
        });

        const updatedConversations = conversationsWithoutContext.map(
          // @ts-ignore TODO: fix noImplicitAny error here
          (cv, i) => ({
            ...cv,
            meta: {
              ...cv.meta,
              context_lines: contexts[i].inline.context_lines,
            },
          })
        );

        yield put({
          type: action.SUCCESS,
          payload: updatedConversations,
        });
      } catch (e) {
        // do nothing
      }
    }
  };
}

export const fetchOutdatedCommentContext = createFetchCommentContextSaga(
  FETCH_OUTDATED_COMMENT_CONTEXT,
  getOutdatedConversationsForFile
);

export const fetchCommentContext = createFetchCommentContextSaga(
  FETCH_LARGE_FILE_COMMENT_CONTEXT,
  getAllConversationsForFile
);

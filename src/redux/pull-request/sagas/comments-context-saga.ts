import { inRange, unescape } from 'lodash-es';
import { Task } from 'redux-saga';
import {
  all,
  take,
  select,
  call,
  put,
  spawn,
  race,
  fork,
  TakeEffect,
} from 'redux-saga/effects';
import { LoadGlobal } from 'src/redux/global/actions';
import { ChunkEntry } from '@atlassian/bitkit-diff';
import {
  FETCH_COMMENTS,
  FETCH_DIFF,
  LOAD_DIFFSTAT,
  FETCH_COMMENT_CONTEXT,
  ENTERED_CODE_REVIEW,
  REFRESH_CODE_REVIEW_DATA_FROM_POLL_RESULTS,
} from 'src/redux/pull-request/actions';
import {
  getCurrentPullRequestUrlPieces,
  getRenderedPullRequestDiff,
} from 'src/redux/pull-request/selectors';
import {
  getGlobalShouldIgnoreWhitespace,
  UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS,
} from 'src/redux/pull-request-settings';
import { getConversations } from 'src/selectors/conversation-selectors';
import { Diff } from 'src/types/pull-request';
import { isFileLevelComment } from 'src/redux/pull-request/utils/comments';
import { CodeReviewConversation } from 'src/components/conversation-provider/types';
import authRequest from 'src/utils/fetch';
import urls from '../urls';
import { buildChunk } from './utils/build-a-chunk';
import { ApiContextLine } from './expand-context-saga';

type DiffAwareCommentFilter = (
  diffs: Diff[]
) => (conversation: CodeReviewConversation) => boolean;

type CommentWithClosestChunkMapper = (
  diffs: Diff[]
) => (conversation: CodeReviewConversation) => CommentWithClosestChunk;

type CommentWithClosestChunk = {
  conversation: CodeReviewConversation;
  chunk?: ChunkEntry;
};

const isIncompleteConversation = (conversation: CodeReviewConversation) =>
  !(conversation.meta.from !== null && conversation.meta.to !== null);

const none = (array: any[], predicate: (x: any) => boolean) =>
  !array.some(predicate);

const containsConversation = (conversation: CodeReviewConversation) => (
  chunk: ChunkEntry
) => {
  // FROM | TO are the terms for the gutter column line numbers
  const fromStart = chunk.oldStart;
  const fromEnd = chunk.oldStart + chunk.oldLines - 1;
  const toStart = chunk.newStart;
  const toEnd = chunk.newStart + chunk.newLines - 1;

  const { from: convoFrom, to: convoTo } = conversation.meta;

  // This is redundant if the consumer has already checked this but this function doesn't know
  const isFileOrGlobalComment = convoFrom === null && convoTo === null;
  if (isFileOrGlobalComment) {
    return false;
  }

  const isFromLineInChunk =
    convoFrom !== null && inRange(convoFrom, fromStart, fromEnd + 1);
  const isToLineInChunk =
    convoTo !== null && inRange(convoTo, toStart, toEnd + 1);

  return isFromLineInChunk || isToLineInChunk;
};

const needsRendered: DiffAwareCommentFilter = diffs => conversation => {
  const { path, outdated } = conversation.meta;
  const relevantDiff = diffs.find(diff => diff.to === path);
  if (!relevantDiff) {
    return false;
  }

  const { chunks } = relevantDiff;

  return (
    !outdated &&
    !isFileLevelComment(conversation) &&
    none(chunks, containsConversation(conversation))
  );
};

const getCommentWithClosestChunk: CommentWithClosestChunkMapper = diffs => conversation => {
  const { path } = conversation.meta;
  const relevantDiff = diffs.find(diff => diff.to === path)!;
  const { chunks } = relevantDiff;

  let minDistToChunk = Number.MAX_SAFE_INTEGER;
  let closestChunk: ChunkEntry;

  // find closest chunk above the convo if any
  chunks.forEach(chunk => {
    const { from: convoFrom, to: convoTo } = conversation.meta;
    // incomplete convo will have either a non-null "from" or "to" field
    if (convoFrom !== null) {
      const fromEnd = chunk.oldStart + chunk.oldLines - 1;
      if (convoFrom > fromEnd) {
        const currDist = Math.abs(fromEnd - convoFrom);
        if (currDist < minDistToChunk) {
          minDistToChunk = currDist;
          closestChunk = chunk;
        }
      }
    } else if (convoTo !== null) {
      const toEnd = chunk.newStart + chunk.newLines - 1;
      if (convoTo > toEnd) {
        const currDist = Math.abs(toEnd - convoTo);
        if (currDist < minDistToChunk) {
          minDistToChunk = currDist;
          closestChunk = chunk;
        }
      }
    }
  });

  return {
    conversation,
    // @ts-ignore closestChunk will be non-null
    chunk: closestChunk,
  };
};

// @ts-ignore TODO: fix noImplicitAny error here
function* fetchContextLines(
  path: string,
  // @ts-ignore TODO: fix noImplicitAny error here
  linesRange,
  retries = 2
) {
  if (retries <= 0) {
    // Fail-safe because recursion
    return;
  }

  const ignoreWhitespace = yield select(getGlobalShouldIgnoreWhitespace);
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const url = urls.api.internal.context(
    { owner, slug, id, filepath: path },
    linesRange,
    { ignoreWhitespace }
  );

  const response = yield call(fetch, authRequest(url));
  if (!response.ok) {
    // Lots of safety valve magic for internal endpoint usage
    const sameStartingLines = {
      startingFrom: linesRange.startingFrom,
      startingTo: linesRange.startingTo,
    };
    const fromRange = linesRange.startingFrom - linesRange.endingFrom;
    const endingFrom =
      linesRange.endingFrom === undefined || fromRange <= 2
        ? undefined
        : linesRange.endingFrom - 1;

    const toRange = linesRange.startingTo - linesRange.endingTo;
    const endingTo =
      linesRange.endingTo === undefined || toRange <= 2
        ? undefined
        : linesRange.endingTo - 1;

    const guessWithLessLines = {
      ...sameStartingLines,
      endingFrom,
      endingTo,
    };
    // eslint-disable-next-line consistent-return
    return yield* fetchContextLines(path, guessWithLessLines, retries - 1);
  }

  const json: { lines: ApiContextLine[] } =
    response.status === 200
      ? yield response.json()
      : yield Promise.resolve({ lines: [] });

  const { lines } = json;
  const decodedLines = lines.map(line => ({
    ...line,
    content: unescape(line.content),
  }));

  yield put({
    type: FETCH_COMMENT_CONTEXT.SUCCESS,
    payload: {
      path,
      // @ts-ignore We don't actually need the CONFLICT field in this builder
      newChunk: buildChunk(decodedLines),
    },
  });
}

// These conversations will necessarily be in the "context lines" area
// So we can assume the delta between their FROM & TO line numbers
// is true of their neighboring line-number pairs.
// i.e. if this convo is on 4 | 5, then we know 3 | 4 and 5 | 6 should be
// safe to request so long as they don't cross into chunks we already render
// which are chunks this could contain diff changes.
function* fetchConversationContext(
  conversationWithChunk: CommentWithClosestChunk
) {
  const EXTRA_LINES = 2;
  const { from, to, path } = conversationWithChunk.conversation.meta;
  let initialLineNums;

  // "incomplete" comment that needs special handling
  if (isIncompleteConversation(conversationWithChunk.conversation)) {
    // initial line numbers inferred from closest chunk above if any
    const { chunk } = conversationWithChunk;
    let offset = 0;
    if (chunk) {
      // chunk above
      const {
        oldStart: fromStart,
        newStart: toStart,
        oldLines: oldLines,
        newLines: newLines,
      } = chunk;
      offset = toStart - fromStart + (newLines - oldLines);
    }
    // @ts-ignore
    const correctedFrom = from === null ? to + -1 * offset : from;
    // @ts-ignore
    const correctedTo = to === null ? from + offset : to;

    initialLineNums = {
      startingFrom: Math.max(0, correctedFrom - EXTRA_LINES),
      startingTo: Math.max(0, correctedTo - EXTRA_LINES),
      endingFrom: correctedFrom + EXTRA_LINES,
      endingTo: correctedTo + EXTRA_LINES,
    };
  } else {
    initialLineNums = {
      // Ensure "below"s aren't lower than 0
      // @ts-ignore FROM will be non null
      startingFrom: Math.max(0, from - EXTRA_LINES),
      // @ts-ignore TO will be non null
      startingTo: Math.max(0, to - EXTRA_LINES),
      // We can't know end of file, handle this explosion later...
      // @ts-ignore FROM will be non null
      endingFrom: from + EXTRA_LINES,
      // @ts-ignore TO will be non null
      endingTo: to + EXTRA_LINES,
    };
  }

  yield* fetchContextLines(
    // @ts-ignore PATH will be non null
    path,
    initialLineNums
  );
}

function* userEntersCodeReviewPage(effects: TakeEffect[]) {
  yield take(ENTERED_CODE_REVIEW);
  yield all(effects);
}

function* userTogglesWhitespace(effects: TakeEffect[]) {
  yield take(UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS);
  yield all(effects);
}

function* userRefreshsPullRequestDiff(effects: TakeEffect[]) {
  yield take(REFRESH_CODE_REVIEW_DATA_FROM_POLL_RESULTS);
  yield all(effects);
}

export function* fetchCommentsContext() {
  const diffs = yield select(getRenderedPullRequestDiff);
  const conversations: CodeReviewConversation[] = yield select(
    getConversations
  );

  const conversationsToRender = conversations
    .filter(needsRendered(diffs))
    .map(getCommentWithClosestChunk(diffs));

  const contextTasks = conversationsToRender.map(conversationToRender =>
    spawn(fetchConversationContext, conversationToRender)
  );

  yield all(contextTasks);
}

export function* commentsContextSaga() {
  let task: Task | undefined;
  // wait for features to be set in redux
  yield take(LoadGlobal.SUCCESS);

  const effects = [take(FETCH_DIFF.SUCCESS), take(LOAD_DIFFSTAT.SUCCESS)];
  while (true) {
    yield race([
      call(
        userEntersCodeReviewPage,
        [take(FETCH_COMMENTS.SUCCESS)].concat(effects)
      ),
      call(userTogglesWhitespace, effects),
      call(userRefreshsPullRequestDiff, effects),
    ]);

    if (task !== undefined && task.isRunning()) {
      yield task.cancel();
    }

    task = yield fork(fetchCommentsContext);
  }
}

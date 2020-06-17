import { unescape } from 'lodash-es';
import { select, call, put, all } from 'redux-saga/effects';

import { EXPAND_CONTEXT } from 'src/redux/pull-request/actions';
import { ExpandContextAction } from 'src/redux/pull-request/actions/expand-context';
import { getGlobalShouldIgnoreWhitespace } from 'src/redux/pull-request-settings';
import authRequest from 'src/utils/fetch';
import urls from '../urls';
import {
  getCurrentPullRequestUrlPieces,
  getPullRequestDiff,
} from '../selectors';
import { getContextData } from './utils/get-context-data';
import {
  convertToChunksFormat,
  ContextLine,
} from './utils/convert-to-chunks-format';

export type ApiContextLine = {
  from_line: number | null | undefined;
  to_line: number | null | undefined;
  content: string;
};

// See https://softwareteams.atlassian.net/browse/NPR-539
// The v1.0 context API returns escaped strings. We are unescaping the content
// before it is passed to the Diff -> CodeLine components which automatically HTML escaped
// during rendering.
//
// FIXME: This will have to be removed once we migrate to the v2.0 context API
// see: https://softwareteams.atlassian.net/browse/NPR-557
export function decodeContextLines(contextLines: ContextLine[]): ContextLine[] {
  return contextLines.map(contextLine => ({
    ...contextLine,
    content: unescape(contextLine.content),
  }));
}

// @ts-ignore TODO: fix noImplicitAny error here
function getJson(response) {
  return response.status === 200
    ? response.json()
    : Promise.resolve({ lines: [] });
}

export function* expandContextSaga({ payload }: ExpandContextAction) {
  const { filepath, fileIndex, expanderIndex, peekAheadOnly } = payload;
  const diffs = yield select(getPullRequestDiff);
  const file = diffs[fileIndex];
  const { chunks } = file;
  const { owner, slug: repoSlug, id: pullRequestId } = yield select(
    getCurrentPullRequestUrlPieces
  );

  const contextData = getContextData(chunks, expanderIndex);
  const ignoreWhitespace = yield select(getGlobalShouldIgnoreWhitespace);

  // @ts-ignore TODO: fix noImplicitAny error here
  const buildContextUrl = contextDatum =>
    urls.api.internal.context(
      { owner, slug: repoSlug, id: pullRequestId, filepath },
      contextDatum.lineNums,
      { ignoreWhitespace }
    );

  // @ts-ignore TODO: fix noImplicitAny error here
  function putSuccess(json, index) {
    const { lines } = json;
    const { chunkId, beforeOrAfter } = contextData[index];
    let convertedJson;
    let dummyData;

    if (peekAheadOnly) {
      dummyData = { contextLines: [], hasMoreLines: !!lines.length };
    } else {
      convertedJson = convertToChunksFormat(lines);

      // FIXME: Remove once this has been ported to v2. See comment in funcdoc
      convertedJson.contextLines = decodeContextLines(
        convertedJson.contextLines
      ) as any;
    }

    return put({
      type: EXPAND_CONTEXT.SUCCESS,
      payload: {
        ...(dummyData || convertedJson),
        fileIndex,
        chunkId,
        beforeOrAfter,
      },
    });
  }

  try {
    const fetches = contextData
      .map(buildContextUrl)
      .map(contextUrl => call(fetch, authRequest(contextUrl)));

    const responses = yield all(fetches);
    // @ts-ignore TODO: fix noImplicitAny error here
    const notOk = responses.some(response => !response.ok);
    if (notOk) {
      throw new Error('Something went wrong fetching more context lines.');
    }

    const jsonObjects = yield all(responses.map(getJson));

    yield all(jsonObjects.map(putSuccess));
  } catch (error) {
    yield put({
      type: EXPAND_CONTEXT.ERROR,
      payload: error.message,
      error: true,
    });
  }
}

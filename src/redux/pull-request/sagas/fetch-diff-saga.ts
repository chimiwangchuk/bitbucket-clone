import { put, call, spawn, select } from 'redux-saga/effects';

import { getResourceTimings } from 'src/components/performance-metrics/resource-timings';
import { EXCESSIVE_DIFF_FILE_SIZE_LINES } from 'src/constants/diffs';
import { AsyncAction } from 'src/redux/actions';
import {
  FETCH_DIFF,
  PUBLISH_BASE_PULL_REQUEST_FACT,
  PUBLISH_PULL_REQUEST_DIFF_FACT,
  TOGGLE_SINGLE_FILE_MODE,
} from 'src/redux/pull-request/actions';
import {
  publishBasePullRequestFactSaga,
  publishPullRequestDiffFactSaga,
} from 'src/redux/pull-request/sagas/facts-sagas';
import { clearContextExpansions } from 'src/redux/pull-request/sagas/utils/amend-chunks';
import {
  getPullRequestCompareSpecDiffUrl,
  getIsSingleFileModeEligible,
  getIsSingleFileModeActive,
} from 'src/redux/pull-request/selectors';
import urls from 'src/redux/pull-request/urls';
import {
  getGlobalIsWordDiffEnabled,
  getGlobalShouldIgnoreWhitespace,
} from 'src/redux/pull-request-settings';
import { getPullRequestApis } from 'src/sagas/helpers';
import { Diff } from 'src/types/pull-request';
import WordDiffWorker from 'src/workers/word-diff.worker';

import { addQueryParams, normalizeDiffParams } from '../urls/url-utils';
import {
  FetchEntireFile,
  ViewEntireFileAction,
} from '../view-entire-file-reducer';

// Only fetch up to our current single file limit, because we won't be rendering the content
// if the file is larger than this
const MAX_CONTEXT_EXPANSION = EXCESSIVE_DIFF_FILE_SIZE_LINES;

const worker = WordDiffWorker();

function* publishDiffsFetchedFact() {
  let timings = getResourceTimings('/diff?');
  if (!timings.present) {
    timings = getResourceTimings('/diff/');
  }

  const diffsFetchedFactAction = {
    type: PUBLISH_BASE_PULL_REQUEST_FACT,
    payload: {
      name: 'bitbucket.pullrequests.diffs.fetched',
      extraFactData: {
        encoded_body_size: timings.encodedBodySize,
        request_waiting_time: timings.requestWaitingTime,
        response_duration: timings.responseDuration,
        total_fetch_duration: Math.floor(timings.duration) || null,
        transfer_size: timings.transferSize,
      },
    },
  };

  yield spawn(publishBasePullRequestFactSaga, diffsFetchedFactAction);
}

function* publishDiffsParsedFact() {
  const diffsParsedFactAction = {
    type: PUBLISH_PULL_REQUEST_DIFF_FACT,
    payload: {
      name: 'bitbucket.pullrequests.diffs.parsed',
    },
  };

  yield spawn(publishPullRequestDiffFactSaga, diffsParsedFactAction);
}

type FetchDiffOptions = {
  collectDiffFetchedAnalytics?: () => void;
  collectDiffParsedAnalytics?: () => void;
  postProcessDiff?: (diff: Diff[]) => Diff[];
};

export function* fetchDiff(
  url: string,
  action: AsyncAction,
  options: FetchDiffOptions = {}
) {
  try {
    const api = yield* getPullRequestApis();
    yield put({ type: action.REQUEST });

    const diff = yield call(api.getDiff, url);

    if (options.collectDiffFetchedAnalytics) {
      yield options.collectDiffFetchedAnalytics();
    }

    const isWordDiffEnabled = yield select(getGlobalIsWordDiffEnabled);

    let processedDiffs = yield call(worker.processDiff, diff, {
      isWordDiffEnabled,
    });

    if (options.postProcessDiff) {
      processedDiffs = options.postProcessDiff(processedDiffs);
    }

    yield put({
      type: action.SUCCESS,
      payload: processedDiffs,
    });

    if (options.collectDiffParsedAnalytics) {
      yield options.collectDiffParsedAnalytics();
    }

    // If the diffstat loaded before the diff, and the pull request is eligible for
    // single file mode, then enter single file mode.
    const isSingleFileModeEligible = yield select(getIsSingleFileModeEligible);
    const isSingleFileModeActive = yield select(getIsSingleFileModeActive);
    if (isSingleFileModeEligible && !isSingleFileModeActive) {
      yield put({
        type: TOGGLE_SINGLE_FILE_MODE,
        payload: isSingleFileModeEligible,
      });
    }
  } catch (e) {
    yield put({ type: action.ERROR, payload: e.status });
  }
}

export function* fetchDiffSaga(url: string) {
  yield call(fetchDiff, url, FETCH_DIFF, {
    collectDiffFetchedAnalytics: publishDiffsFetchedFact,
    collectDiffParsedAnalytics: publishDiffsParsedFact,
  });
}

export function* viewEntireDiffFileSaga(action: ViewEntireFileAction) {
  const { path } = action.payload;

  const serverGeneratedDiffUrl: string | undefined = yield select(
    getPullRequestCompareSpecDiffUrl
  );

  if (!serverGeneratedDiffUrl) {
    return;
  }

  const ignoreWhitespace = yield select(getGlobalShouldIgnoreWhitespace);

  const url = addQueryParams(serverGeneratedDiffUrl, {
    context: MAX_CONTEXT_EXPANSION,
    ignore_whitespace: ignoreWhitespace,
    path,
  });

  yield call(fetchDiff, url, FetchEntireFile, {
    // We set MAX_CONTEXT_EXPANSION high enough so that it's almost impossible that the entire file
    // won't be rendered in a single chunk, so we shouldn't render the context expansion buttons at the
    // top or bottom. We're OK with this behavior being "wrong" for enormous files, because we don't
    // render files that would be large enough to run into that situation (we render a placeholder
    // message instead).
    postProcessDiff: clearContextExpansions,
  });
}

export function* fetchDiffByPrIdSaga(
  owner: string,
  slug: string,
  id: string | number
) {
  const ignoreWhitespace = yield select(getGlobalShouldIgnoreWhitespace);
  const url = urls.api.v20.diff(owner, slug, id, { ignoreWhitespace });

  yield call(fetchDiffSaga, url);
}

export function* fetchDiffByCompareSpecSaga() {
  const ignoreWhitespace = yield select(getGlobalShouldIgnoreWhitespace);

  const serverGeneratedDiffUrl = yield select(getPullRequestCompareSpecDiffUrl);

  const url = addQueryParams(
    serverGeneratedDiffUrl,
    normalizeDiffParams({ ignoreWhitespace })
  );

  yield call(fetchDiffSaga, url);
}

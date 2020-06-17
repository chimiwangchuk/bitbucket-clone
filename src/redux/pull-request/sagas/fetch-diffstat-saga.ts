import { call, put, select } from 'redux-saga/effects';
import {
  LOAD_DIFFSTAT,
  TOGGLE_SINGLE_FILE_MODE,
  TOGGLE_SINGLE_FILE_MODE_ELIGIBILITY,
} from 'src/redux/pull-request/actions';
import urls from 'src/redux/pull-request/urls';
import { getGlobalShouldIgnoreWhitespace } from 'src/redux/pull-request-settings';
import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
} from 'src/selectors/repository-selectors';
import { getPullRequestApis } from 'src/sagas/helpers';
import { getIsCodeReviewSingleFileModeEnabled } from 'src/selectors/feature-selectors';
import { SINGLE_FILE_MODE_THRESHOLD_LINES } from 'src/constants/diffs';
import { DiffStat } from 'src/types/diffstat';
import {
  getPullRequestCompareSpecDiffStatUrl,
  getCurrentPullRequestId,
  getPullRequestDiff,
} from '../selectors';
import { normalizeDiffStatParams, addQueryParams } from '../urls/url-utils';

// @ts-ignore TODO: fix noImplicitAny error here
export function* fetchDiffStatSaga(
  url: string,
  values: DiffStat[] = [],
  isFirstFetch = true,
  prevCumulativeLineCount = 0,
  prevIsSingleFileModeThresholdMet = false
) {
  try {
    if (isFirstFetch) {
      yield put({ type: LOAD_DIFFSTAT.REQUEST });
    }

    const api = yield* getPullRequestApis();
    const diffStat = yield call(api.getDiffStat, url);
    const newValues: DiffStat[] = diffStat.values;
    values.push(...newValues);

    const isSingleFileModeEnabled = yield select(
      getIsCodeReviewSingleFileModeEnabled
    );
    const cumulativeLineCount: number =
      isSingleFileModeEnabled && !prevIsSingleFileModeThresholdMet
        ? prevCumulativeLineCount +
          newValues.reduce(
            (accumulator, { lines_added: added, lines_removed: removed }) =>
              accumulator + added + removed,
            0
          )
        : prevCumulativeLineCount;
    const isSingleFileModeThresholdMet = isSingleFileModeEnabled
      ? cumulativeLineCount >= SINGLE_FILE_MODE_THRESHOLD_LINES
      : prevIsSingleFileModeThresholdMet;

    if (prevIsSingleFileModeThresholdMet !== isSingleFileModeThresholdMet) {
      yield put({
        type: TOGGLE_SINGLE_FILE_MODE_ELIGIBILITY,
        payload: isSingleFileModeThresholdMet,
      });

      const hasDiff = !!(yield select(getPullRequestDiff)).length;
      if (
        !isSingleFileModeThresholdMet || // always exit single file mode right away
        hasDiff // only enter single file mode flag if diff is available
      ) {
        yield put({
          type: TOGGLE_SINGLE_FILE_MODE,
          payload: isSingleFileModeThresholdMet,
        });
      }
    }

    // Diffstat is paginated.  Auto fetch the rest of diffstat data
    if (diffStat.next) {
      yield call(
        fetchDiffStatSaga,
        diffStat.next,
        values,
        false,
        cumulativeLineCount,
        isSingleFileModeThresholdMet
      );
    } else {
      // All diffstat pages loaded, no additional data
      yield put({
        type: LOAD_DIFFSTAT.SUCCESS,
        payload: {
          values,
        },
      });
    }
  } catch (e) {
    yield put({
      type: LOAD_DIFFSTAT.ERROR,
      payload: {
        errorCode: e.status,
        diffStatErrorMessage: e.message,
      },
    });
  }
}

export function* fetchDiffStatByPrIdSaga(
  owner: string,
  slug: string,
  id: string | number
) {
  const ignoreWhitespace = yield select(getGlobalShouldIgnoreWhitespace);
  const url = urls.api.v20.diffstat(owner, slug, id, ignoreWhitespace);

  yield call(fetchDiffStatSaga, url);
}

export function* fetchDiffStatForCurrentPullRequest() {
  const id = yield select(getCurrentPullRequestId);
  const owner = yield select(getCurrentRepositoryOwnerName);
  const slug = yield select(getCurrentRepositorySlug);

  yield call(fetchDiffStatByPrIdSaga, owner, slug, id);
}

export function* fetchDiffStatByCompareSpecSaga() {
  const serverGeneratedDiffStatUrl = yield select(
    getPullRequestCompareSpecDiffStatUrl
  );
  const ignoreWhitespace = yield select(getGlobalShouldIgnoreWhitespace);

  const url = addQueryParams(
    serverGeneratedDiffStatUrl,
    normalizeDiffStatParams(ignoreWhitespace)
  );

  yield call(fetchDiffStatSaga, url);
}

import { all, debounce, takeLatest } from 'redux-saga/effects';

import {
  UPDATE_GLOBAL_IS_WORD_DIFF_ENABLED_SUCCESS,
  UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS,
} from 'src/redux/pull-request-settings';
import { fetchDiffByCompareSpecSaga } from './fetch-diff-saga';
import { fetchDiffStatByCompareSpecSaga } from './fetch-diffstat-saga';

const DEBOUNCE_DELAY_MS = 100;

function* reprocessDiff() {
  yield debounce(
    DEBOUNCE_DELAY_MS,
    [
      UPDATE_GLOBAL_IS_WORD_DIFF_ENABLED_SUCCESS,
      UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS,
    ],
    fetchDiffByCompareSpecSaga
  );
}

function* reprocessDiffStat() {
  yield takeLatest(
    UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS,
    fetchDiffStatByCompareSpecSaga
  );
}

export function* reprocessDiffSaga() {
  yield all([reprocessDiff(), reprocessDiffStat()]);
}

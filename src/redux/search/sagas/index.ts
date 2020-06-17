import { all, takeLatest } from 'redux-saga/effects';
import {
  FetchSearchResults,
  OptInToBeta,
  REFINE_QUERY,
  SYNC_URL_TO_STATE,
} from '../actions';
import fetchSearchResultSaga from './fetch-search-results-saga';
import optInToBetaSaga from './opt-in-to-beta-saga';
import refineQuerySaga from './refine-query-saga';
import syncUrlToStateSaga from './sync-url-to-state-saga';

export default function* searchSagas() {
  yield all([
    takeLatest(FetchSearchResults.REQUEST, fetchSearchResultSaga),
    takeLatest(OptInToBeta.REQUEST, optInToBetaSaga),
    takeLatest(REFINE_QUERY, refineQuerySaga),
    takeLatest(SYNC_URL_TO_STATE, syncUrlToStateSaga),
  ]);
}

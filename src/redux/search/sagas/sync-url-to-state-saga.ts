import { put, select } from 'redux-saga/effects';
import { change } from 'redux-form';
import { FORM_KEY } from 'src/constants/search';
import { getSearchAccount } from '../selectors';
import fetchSearchResults, {
  FetchSearchResults,
} from '../actions/fetch-search-results';
import { RESET_SEARCH, syncUrlToState } from '../actions';

export default function* syncUrlToStateSaga({
  payload: { params },
}: ReturnType<typeof syncUrlToState>) {
  const account = yield select(getSearchAccount, params);
  const query = params.q;

  yield put(change(FORM_KEY, 'account', account));
  yield put(change(FORM_KEY, 'query', query));

  if (!account || !account.extra || account.extra.search_state !== 'ENABLED') {
    yield put({ type: RESET_SEARCH });
    return;
  }

  if (query) {
    yield put(fetchSearchResults(params));
  } else {
    // reset the results
    yield put({
      type: FetchSearchResults.SUCCESS,
      payload: null,
    });
  }
}

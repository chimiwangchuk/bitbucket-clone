import { call, put, select } from 'redux-saga/effects';
import { Either } from 'funfix-core';
import { watchLoading, watchLoadingEnd } from 'src/redux/pull-request/actions';
import { getCurrentPullRequestUrlPieces } from 'src/redux/pull-request/selectors';
import { Watch } from 'src/components/types';
import { HttpError } from 'src/components/types/src/http-methods';
import { WatchApiType } from '../api';

export function* watchSaga(f: WatchApiType) {
  try {
    const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
    if (owner && slug && id) {
      yield put(watchLoading());

      // Watch api returns either an error or a watch result.
      const result: Either<HttpError, Watch> = yield call(f, owner, slug, id);
      // Parse the result or in case of errors ignore them and default to not watching.
      const watch: boolean = result.map(r => r.watching).getOrElse(false);

      yield put(watchLoadingEnd(watch));
    }
  } catch (e) {
    yield put(watchLoadingEnd(false));
  }
}

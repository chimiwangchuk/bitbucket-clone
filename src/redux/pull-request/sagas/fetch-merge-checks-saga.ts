import { call, put, select, delay } from 'redux-saga/effects';
import urls from 'src/redux/pull-request/urls';
import { MergeCheck, MergeCheckKey } from 'src/types';
import {
  getCurrentPullRequestUrlPieces,
  getPullRequestMergeChecks,
} from 'src/redux/pull-request/selectors';
import { getPullRequestApis } from 'src/sagas/helpers';
import { FETCH_MERGE_CHECKS } from '../actions';
import { initialState } from '../reducer';

export function* fetchMergeChecksSaga(
  user: string,
  slug: string,
  pullRequestId: string | number
) {
  const api = yield* getPullRequestApis();
  const mergeCheckUrl = urls.api.internal.mergeChecks(
    user,
    slug,
    pullRequestId
  );

  try {
    yield put({ type: FETCH_MERGE_CHECKS.REQUEST });

    const {
      restrictions,
      can_merge: isMergeable,
      is_mergable_by_current_user: canCurrentUserMerge = initialState.canCurrentUserMerge,
    } = yield call(api.getMergeChecks, mergeCheckUrl);

    yield put({
      type: FETCH_MERGE_CHECKS.SUCCESS,
      // label is null for checks that aren't run
      payload: {
        mergeChecks: Object.values(restrictions).filter(
          (mergeCheck: MergeCheck) => !!mergeCheck.label
        ),
        isMergeable,
        canCurrentUserMerge,
      },
    });
  } catch (e) {
    yield put({
      type: FETCH_MERGE_CHECKS.ERROR,
      payload: e.message,
    });
  }
}

export function* retryFetchMergeChecks() {
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  yield* fetchMergeChecksSaga(owner, slug, id);
}

export function* retryFetchConcreteMergeChecks(keys: MergeCheckKey[]) {
  const mergeChecks: MergeCheck[] = yield select(getPullRequestMergeChecks);
  const hasGivenMergeKeys = mergeChecks.some(c => keys.includes(c.key));
  if (hasGivenMergeKeys) {
    yield delay(1000);
    yield* retryFetchMergeChecks();
  }
}

export function* retryFetchAllMergeChecksIfNeeded() {
  const mergeChecks: MergeCheck[] = yield select(getPullRequestMergeChecks);
  if (mergeChecks.length) {
    yield* retryFetchMergeChecks();
  }
}

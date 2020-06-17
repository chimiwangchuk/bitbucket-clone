import * as Sentry from '@sentry/browser';
import {
  takeLatest,
  delay,
  select,
  all,
  put,
  call,
  spawn,
} from 'redux-saga/effects';

import storage from 'src/utils/store';
import {
  EXPAND_ALL_DIFFS,
  COLLAPSE_ALL_DIFFS,
  TOGGLE_DIFF_EXPANSION,
  RESTORE_DIFFS_EXPAND_STATE,
} from '../actions';
import {
  getDiffsExpansions,
  getCurrentPullRequestUrlPieces,
} from '../selectors';

const DIFFS_EXPANDED_PERSISTENCE_KEY = 'diffs-expanded-state';

const CLEAN_SLATE = {};

export const RECORDING_DEBOUNCE_TIME = 750;

type KeyBuilder = (owner: string, slug: string, id: number | string) => string;

const createCacheKeyBuilder = (suffix: string): KeyBuilder => {
  return (owner, slug, id) => `${owner}/${slug}/${id}:${suffix}`;
};

export const buildDiffsExpandedKey = createCacheKeyBuilder(
  DIFFS_EXPANDED_PERSISTENCE_KEY
);

// @ts-ignore TODO: fix noImplicitAny error here
export function* setInStorageSaga(key: string, value) {
  // Records into local storage after a delay, the
  //  delay allows us to debounce by using takeLatest to kill previous run.
  yield delay(RECORDING_DEBOUNCE_TIME);

  yield call({ context: storage, fn: storage.set }, key, value);
}

// @ts-ignore TODO: fix noImplicitAny error here
export function* restoreFromStorageSaga(key: string, defaultValue) {
  try {
    const storedValue = yield call(
      {
        context: storage,
        fn: storage.get,
      },
      key
    );

    if (storedValue === null || storedValue === undefined) {
      return defaultValue;
    }

    return storedValue;
  } catch (e) {
    Sentry.captureException(e);

    return defaultValue;
  }
}

export function* recordClosedDiffStateSaga() {
  const diffsExpansions = yield select(getDiffsExpansions);
  const { owner, slug, id } = yield select(getCurrentPullRequestUrlPieces);
  const key = buildDiffsExpandedKey(owner, slug, id);

  yield call(setInStorageSaga, key, diffsExpansions);
}

export function* restoreDiffsExpansionStateSaga(
  owner: string,
  slug: string,
  id: number | string
) {
  const key = buildDiffsExpandedKey(owner, slug, id);
  const diffsExpansionState = yield call(restoreFromStorageSaga, key, {});
  const isOldFormat = Array.isArray(diffsExpansionState);

  const payload = isOldFormat ? CLEAN_SLATE : diffsExpansionState;
  yield put({ type: RESTORE_DIFFS_EXPAND_STATE, payload });
}

// @ts-ignore TODO: fix noImplicitAny error here
export function* restorePersistedStateSaga(owner, slug, id) {
  yield spawn(restoreDiffsExpansionStateSaga, owner, slug, id);
}

export default function*() {
  yield all([
    takeLatest(
      [EXPAND_ALL_DIFFS, COLLAPSE_ALL_DIFFS, TOGGLE_DIFF_EXPANSION],
      recordClosedDiffStateSaga
    ),
  ]);
}

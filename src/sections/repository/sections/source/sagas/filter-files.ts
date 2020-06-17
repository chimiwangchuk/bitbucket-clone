import { call, delay, fork, put, select } from 'redux-saga/effects';
import bufferEvery from 'src/sagas/buffer-every';

import { FilterFiles } from '../actions';
import { getFileTree } from '../reducers/section';
import { FilteredFiles, TreeFile } from '../types';
import { findFiles } from '../utils/filter';

function createFilteredFiles(values: {
  isCleared?: boolean;
  isLoading?: boolean;
  errorCode?: number;
  files?: TreeFile[] | null | undefined;
}): FilteredFiles | null {
  const { isCleared, isLoading, errorCode, files } = values;

  if (isCleared) {
    return null;
  }

  return {
    isLoading: !!isLoading,
    errorCode,
    files,
  };
}

/* eslint-disable @typescript-eslint/no-use-before-define */
// @ts-ignore TODO: fix noImplicitAny error here
function* filterFilesAgain(action) {
  yield delay(250);
  yield call(filterFiles, action);
}

// @ts-ignore TODO: fix noImplicitAny error here
function* filterFiles(action) {
  const query = action.payload;
  if (query === null) {
    // dispatch an explicit null to specify we don't want to display the list
    // of files
    yield put({
      type: FilterFiles.SUCCESS,
      payload: createFilteredFiles({ isCleared: true }),
    });
    return;
  }

  const fileTree = yield select(getFileTree);
  if (!fileTree) {
    yield put({
      type: FilterFiles.SUCCESS,
      payload: createFilteredFiles({
        isLoading: true,
        files: [],
      }),
    });
    // The tree might be available in a moment, so try filtering again
    yield fork(filterFilesAgain, action);
    return;
  }

  if (!fileTree.tree) {
    yield put({
      type: FilterFiles.ERROR,
      payload: createFilteredFiles({
        isLoading: false,
        errorCode: 404,
      }),
    });
    return;
  }

  yield put({
    type: FilterFiles.SUCCESS,
    payload: createFilteredFiles({
      isLoading: false,
      files: findFiles(fileTree.tree, query),
    }),
  });
}
/* eslint-enable @typescript-eslint/no-use-before-define */

export default function* filterFileSagas() {
  yield bufferEvery(FilterFiles.REQUEST, filterFiles);
}

import { all } from 'redux-saga/effects';

import filterFiles from './filter-files';
import loadAnnotations from './load-annotations';
import loadAnnotators from './load-annotators';
import loadFile from './load-file';
import loadFileTreeSagas from './load-file-tree-saga';
import loadSourceObjectSagas from './load-source-object-saga';

export default function* sourceSagas() {
  yield all([
    filterFiles(),
    loadAnnotations(),
    loadAnnotators(),
    loadFile(),
    loadFileTreeSagas(),
    loadSourceObjectSagas(),
  ]);
}

import { get } from 'lodash-es';
import { take, takeEvery, put, select, all } from 'redux-saga/effects';

import callFetch from 'src/sagas/call-fetch';
import { getCurrentRepository } from 'src/selectors/repository-selectors';
import { statsdApiClient } from 'src/utils/metrics';

import { LOAD_SOURCE_FILE, LoadFileMeta } from '../actions';
import loadFileMeta from '../actions/load-file-meta';
import loadFileContents from '../actions/load-file-contents';
import loadLfsInfo from '../actions/load-lfs-info';

function* loadFile() {
  while (true) {
    const loadFileAction = yield take(LOAD_SOURCE_FILE);

    const path = loadFileAction.payload;
    const repo = yield select(getCurrentRepository);
    const hash = yield select(state =>
      get(state, 'repository.source.section.hash', '')
    );

    const response = yield callFetch(loadFileMeta(repo, hash, path));
    if (response.error) {
      // Maybe the file doesn't exist on the selected branch.
      // Not much we can do, so just avoid any exceptions
      continue;
    }

    const { attributes } = response.payload;
    if (attributes.includes('lfs')) {
      yield put(loadLfsInfo(repo, hash, path));
      continue;
    }

    if (attributes.includes('binary')) {
      continue;
    }

    yield put(loadFileContents(repo.full_name, path, { hash }));
  }
}

// @ts-ignore TODO: fix noImplicitAny error here
function getAttributeTags(attributes) {
  if (attributes.length === 0) {
    return ['type:source'];
  }
  // @ts-ignore TODO: fix noImplicitAny error here
  return attributes.map(attribute => `type:${attribute}`);
}

// @ts-ignore TODO: fix noImplicitAny error here
function postMetaStats(loadMetaAction) {
  const { attributes, size } = loadMetaAction.payload;
  statsdApiClient.histogram(
    { 'frontbucket.source.size': size },
    { tags: getAttributeTags(attributes) }
  );
}

export default function* loadFileSagas() {
  yield all([loadFile(), takeEvery(LoadFileMeta.SUCCESS, postMetaStats)]);
}

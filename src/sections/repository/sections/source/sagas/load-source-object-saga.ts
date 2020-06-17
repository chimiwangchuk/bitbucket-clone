import { call, put, select, takeLatest } from 'redux-saga/effects';
import { Repository } from 'src/components/types';
import callFetch from 'src/sagas/call-fetch';
import { Action } from 'src/types/state';
import { LoadSourceObject } from '../actions';
import fetchDirectory from '../actions/fetch-directory';
import fetchSourceObjectMeta from '../actions/fetch-source-object-meta';
import { getFileTree } from '../reducers/section';
import fileTreeId from '../utils/file-tree-id';
import findInDirectory from '../utils/find-in-directory';

type Payload = {
  repo: Repository;
  hash: string;
  path: string;
};

function* fetchObjectType(repo: Repository, hash: string, path: string) {
  if (path === '') {
    return { objectType: 'directory' };
  }

  const { error, payload, meta } = yield callFetch(
    fetchSourceObjectMeta(repo.full_name, hash, path)
  );

  if (error) {
    const { status: errorCode } = meta;
    return { objectType: 'error', errorCode };
  }

  if (payload.type === 'commit_directory') {
    return { objectType: 'directory' };
  }

  return { objectType: 'file' };
}

/**
 * Load the contents of a single directory.
 */
function* getDirectory(repo: Repository, hash: string, path: string) {
  const { error, payload } = yield callFetch(
    fetchDirectory(repo.full_name, hash, path)
  );

  if (error) {
    yield put({
      type: LoadSourceObject.ERROR,
      error: true,
      payload: { errorCode: -1 },
    });
    return;
  }

  const fileTree = payload[0];
  yield put({
    type: LoadSourceObject.SUCCESS,
    payload: {
      hash,
      path,
      treeEntry: fileTree,
    },
  });
}

export function* loadSourceObject(action: Action) {
  // eslint-disable-next-line prefer-destructuring
  const payload: Payload = action.payload;
  const { repo, hash, path } = payload;
  const treeId = fileTreeId(repo, hash);

  // Pull from the tree if it's available
  const fileTree = yield select(getFileTree);
  if (fileTree && fileTree.id === treeId && fileTree.tree) {
    yield put({
      type: LoadSourceObject.SUCCESS,
      payload: {
        hash,
        path,
        treeEntry: findInDirectory(fileTree.tree, path),
      },
    });
    return;
  }

  // We don't know what this object is, so get metadata about it
  // so we can choose the right thing to do.
  const { objectType, errorCode } = yield call(
    fetchObjectType,
    repo,
    hash,
    path
  );
  switch (objectType) {
    case 'directory':
      yield call(getDirectory, repo, hash, path);
      break;
    case 'file':
      yield put({
        type: LoadSourceObject.SUCCESS,
        payload: {
          hash,
          path,
          treeEntry: {
            name: path.split('/').slice(-1)[0],
            type: 'file',
          },
        },
      });
      break;
    default:
      yield put({
        type: LoadSourceObject.ERROR,
        error: true,
        payload: { errorCode },
      });
      break;
  }
}

export default function* loadSourceObjectSagas() {
  yield takeLatest(LoadSourceObject.REQUEST, loadSourceObject);
}

import { put, select, takeLatest } from 'redux-saga/effects';
import { Repository } from 'src/components/types';
import { Action } from 'src/types/state';
import { LoadFileTree } from '../actions';
import fetchFileTree from '../actions/fetch-file-tree';
import { getFileTree } from '../reducers/section';
import fileTreeId from '../utils/file-tree-id';

type Payload = {
  repository: Repository;
  hash: string;
};

export function* loadFileTree(action: Action) {
  // eslint-disable-next-line prefer-destructuring
  const payload: Payload = action.payload;
  const { repository, hash } = payload;
  const treeId = fileTreeId(repository, hash);

  // See if the tree is already loaded
  const currentFileTree = yield select(getFileTree);
  if (
    currentFileTree &&
    currentFileTree.id === treeId &&
    currentFileTree.tree
  ) {
    return;
  }

  // A tree is needed, go and get it.
  yield put(fetchFileTree(repository.full_name, hash, treeId));
}

export default function* loadFileTreeSagas() {
  yield takeLatest(LoadFileTree.REQUEST, loadFileTree);
}

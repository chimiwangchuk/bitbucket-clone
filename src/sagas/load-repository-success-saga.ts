import { put, select, take } from 'redux-saga/effects';

import {
  FetchRepositoryMainBranch,
  LoadRepositoryPage,
} from 'src/sections/repository/actions';
import { loadBranchingModel } from 'src/redux/branches';
import { addRecentlyViewedRepository } from 'src/redux/recently-viewed-repositories';
import { getCurrentRepository } from 'src/selectors/repository-selectors';
import fetchRepositoryDetails from '../sections/repository/actions/fetch-repository-details';
import fetchRepositoryBranch from '../sections/repository/actions/fetch-repository-branch';

function* loadRepositorySuccess() {
  while (true) {
    yield take(LoadRepositoryPage.SUCCESS);
    const repository = yield select(getCurrentRepository);
    yield put(addRecentlyViewedRepository(repository));
    yield put(fetchRepositoryDetails(repository.full_name));
    if (repository.mainbranch && repository.mainbranch.name) {
      yield put(
        fetchRepositoryBranch(
          FetchRepositoryMainBranch,
          repository.full_name,
          repository.mainbranch.name
        )
      );
    }

    const [repositoryOwner, repositorySlug] = repository.full_name.split('/');
    const options = {
      repositoryOwner,
      repositorySlug,
    };

    yield put(loadBranchingModel(options));
  }
}

export default loadRepositorySuccess;

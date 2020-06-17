import { createAsyncAction } from 'src/redux/actions';
import { getProfileRepositories } from 'src/redux/profile/repositories/selectors';
import createGetRepositoryBuildStatuses from 'src/redux/global/sagas/create-get-repository-build-statuses';

export const UPDATE_REPOSITORY_BUILD_STATUSES = createAsyncAction(
  'profile/UPDATE_REPOSITORY_BUILD_STATUSES'
);

const getRepositoryBuildStatusesSaga = createGetRepositoryBuildStatuses(
  UPDATE_REPOSITORY_BUILD_STATUSES,
  getProfileRepositories
);

export default getRepositoryBuildStatusesSaga;

import { getDashboardOverviewRepositories } from 'src/redux/dashboard/selectors/overview';
import { getRepositories } from 'src/redux/dashboard/selectors/repositories';
import { createAsyncAction } from 'src/redux/actions';
import createGetRepositoryBuildStatuses from 'src/redux/global/sagas/create-get-repository-build-statuses';

export const UPDATE_REPOSITORY_BUILD_STATUSES = createAsyncAction(
  'dashboard/update-repositories-with-build-status'
);

export const getDashboardOverviewRepositoriesBuildStatuses = createGetRepositoryBuildStatuses(
  UPDATE_REPOSITORY_BUILD_STATUSES,
  getDashboardOverviewRepositories
);

export const getDashboardRepositoryListBuildStatuses = createGetRepositoryBuildStatuses(
  UPDATE_REPOSITORY_BUILD_STATUSES,
  getRepositories
);

import { combineReducers } from 'redux';

import pullRequests, { DashboardPullRequestsState } from './pull-requests';
import repositories, { DashboardRepositoriesState } from './repositories';
import section, { DashboardSectionState } from './section';
import overviewRepositories, { DashboardOverviewState } from './overview';
import {
  owners,
  projects,
  workspaces,
  OwnersFilterState,
  ProjectsFilterState,
  WorkspacesFilterState,
} from './repository-filters';

export type DashboardState = {
  pullRequests: DashboardPullRequestsState;
  repositories: DashboardRepositoriesState;
  section: DashboardSectionState;
  repositoryFilters: {
    owners: OwnersFilterState;
    workspaces: WorkspacesFilterState;
    projects: ProjectsFilterState;
  };
  overviewRepositories: DashboardOverviewState;
};

export default combineReducers({
  pullRequests,
  section,
  repositories,
  repositoryFilters: combineReducers({
    owners,
    projects,
    workspaces,
  }),
  overviewRepositories,
});

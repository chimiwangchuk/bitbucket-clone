import { createAsyncAction } from 'src/redux/actions';

export const EXPAND_PULL_REQUESTS = 'dashboard/EXPAND_PULL_REQUESTS';
export const FetchRepositories = createAsyncAction(
  'dashboard/FETCH_REPOSITORIES'
);
export const LoadDashboard = createAsyncAction('dashboard/LOAD');
export const LoadDashboardOverview = createAsyncAction(
  'dashboard/LOAD_OVERVIEW'
);
export const FILTER_PULL_REQUESTS = 'dashboard/FILTER_PULL_REQUESTS';
export const SORT_OVERVIEW_REPOSITORIES =
  'dashboard/SORT_OVERVIEW_REPOSITORIES';

export const CLEAR_PULL_REQUEST_FILTERS =
  'dashboard/CLEAR_PULL_REQUEST_FILTERS';

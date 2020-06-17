import urls from 'src/urls/dashboard';
import workspaceUrls from 'src/urls/workspaces';

import { fetchAction, createAsyncAction } from 'src/redux/actions';
import { Workspace } from 'src/components/types';

export const FetchWorkspaces = createAsyncAction('dashboard/FETCH_WORKSPACES');

export const fetchWorkspaces = (query: string) => {
  return fetchAction(FetchWorkspaces, {
    // get workspaces that a user has access to, filtered based on matching the `query`
    url: urls.api.v20.filterUserWorkspaces(query),
  });
};

export const FetchAndSelectWorkspace = createAsyncAction(
  'dashboard/FETCH_AND_SELECT_WORKSPACE'
);

export const fetchAndSelectWorkspace = (uuid: string) => {
  return fetchAction(FetchAndSelectWorkspace, {
    url: workspaceUrls.api.v20.get(uuid),
  });
};

export const CLEAR_FILTERED_WORKSPACES = `dashboard/CLEAR_FILTERED_WORKSPACES`;
export const clearFilteredWorkspaces = () => ({
  type: CLEAR_FILTERED_WORKSPACES,
});

export const SELECT_WORKSPACE = `dashboard/SELECT_WORKSPACE`;
export const selectWorkspace = (workspace: Workspace | null) => ({
  type: SELECT_WORKSPACE,
  payload: workspace,
});

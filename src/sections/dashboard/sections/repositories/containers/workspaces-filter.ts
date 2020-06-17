import { connect } from 'react-redux';
import WorkspacesFilter from 'src/sections/dashboard/sections/repositories/components/workspaces-filter';

import { getRepositoryWorkspacesFilter } from 'src/redux/dashboard/selectors/repositories';
import {
  fetchWorkspaces,
  fetchAndSelectWorkspace,
  selectWorkspace,
  clearFilteredWorkspaces,
} from 'src/redux/dashboard/actions/fetch-repository-workspaces';
import { BucketState } from 'src/types/state';

const mapStateToProps = (state: BucketState) => {
  const {
    workspaces,
    isLoading,
    isError,
    selectedWorkspace,
  } = getRepositoryWorkspacesFilter(state);

  return {
    workspaces,
    selectedWorkspace,
    isLoading,
    isError,
  };
};

const mapDispatchToProps = {
  fetchWorkspaces,
  clearFilteredWorkspaces,
  fetchAndSelectWorkspace,
  selectWorkspace,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkspacesFilter);

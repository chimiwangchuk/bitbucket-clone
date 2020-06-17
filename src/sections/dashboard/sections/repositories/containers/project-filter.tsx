import { connect } from 'react-redux';

import fetchProjects, {
  clearFilteredProjects,
  fetchAndSelectProject,
  selectProject,
} from 'src/redux/dashboard/actions/fetch-projects';
import { getCurrentUser } from 'src/selectors/user-selectors';

import {
  getProjects,
  getRepositoryProjectsFilter,
} from 'src/redux/dashboard/selectors/repositories';
import { BucketState } from 'src/types/state';
import ProjectSelector from '../components/project-filter';

const mapStateToProps = (state: BucketState) => {
  const {
    isLoading,
    project: selectedProject,
    isError,
  } = getRepositoryProjectsFilter(state);

  return {
    currentUser: getCurrentUser(state),
    isLoading,
    projects: getProjects(state),
    isError,
    selectedProject,
  };
};

const mapDispatchToProps = {
  fetchProjects,
  fetchAndSelectProject,
  selectProject,
  clearFilteredProjects,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSelector);

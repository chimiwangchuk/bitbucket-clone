import { put, all, take } from 'redux-saga/effects';

import { unloadBranches } from 'src/redux/branches';
import { unloadPullRequests } from 'src/redux/pull-request-list';
import { unloadCreateJiraIssue } from 'src/redux/jira/actions';

import { UNLOAD_REPOSITORY } from '../sections/repository/actions';

function* unloadRepository() {
  while (true) {
    yield take(UNLOAD_REPOSITORY);
    yield all([
      put(unloadBranches()),
      put(unloadPullRequests()),

      // We currently cache the connected sites, projects, and issue metadata information
      // in the reducer for creating Jira issue feature.
      // This needs to be cleared when users move to the repo in a different workspace.
      // Currently, we don't have an easier way to tell if the user has moved to a repo
      // in a different workspace, but we can easily tell when the user moves
      // out from the repository context. So when the user moves out of the repository
      // context we are triggering an action to clear the create Jira issue reducer state.
      put(unloadCreateJiraIssue()),
    ]);
  }
}

export default unloadRepository;

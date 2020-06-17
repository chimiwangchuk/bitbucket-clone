import { put, select, take } from 'redux-saga/effects';

import { LoadProfilePage } from 'src/redux/profile/section/actions/constants';
import { getCurrentWorkspace } from 'src/redux/profile/selectors';
import createAddRecentlyViewedWorkspaceAction from 'src/redux/workspaces/actions/add-recently-viewed-workspace';

function* loadWorkspaceSuccess() {
  while (true) {
    yield take(LoadProfilePage.SUCCESS);
    const workspace = yield select(getCurrentWorkspace);
    if (workspace) {
      yield put(createAddRecentlyViewedWorkspaceAction(workspace));
    }
  }
}

export default loadWorkspaceSuccess;

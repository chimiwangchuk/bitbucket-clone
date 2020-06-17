import { all, takeLatest } from 'redux-saga/effects';

import commitListSagas from 'src/redux/commit-list/sagas';
import pullRequestSagas from 'src/redux/pull-request/sagas';
import pullRequestListSagas from 'src/redux/pull-request-list/sagas';
import sourceSagas from 'src/sections/repository/sections/source/sagas';
import toggleRepositoryWatch from 'src/sections/repository/sagas/toggle-repository-watch';
import branchesSagas from 'src/redux/branches/sagas';
import createBranchSagas from 'src/redux/create-branch/sagas';
import pageVisibilitySaga from 'src/redux/global/sagas/page-visibility-saga';
import bootstrapSaga from 'src/redux/global/sagas/bootstrap-saga';
import scrollToSaga from 'src/redux/global/sagas/scroll-to-saga';
import { SCROLL_TO, UPDATE_NAVIGATION_STATE } from 'src/redux/global/actions';
import dashboardRepositoryBuildStatusesSagas from 'src/redux/dashboard/sagas';
import offlineSaga from 'src/redux/global/sagas/offline-saga';
import searchSagas from 'src/redux/search/sagas';
import drawerSagas from 'src/redux/global/sagas/drawer-sagas';
import toggleNavigationSaga from 'src/redux/global/sagas/toggle-navigation-saga';
import profileRepositoriesSagas from 'src/redux/profile/repositories/sagas';
import jiraSagas from 'src/redux/jira/sagas';
import pullRequestSettingsSagas from 'src/redux/pull-request-settings/sagas';

import {
  toggleSidebarSaga,
  updateSidebarStateSaga,
  UPDATE_SIDEBAR_STATE,
} from 'src/redux/sidebar';

import updateNavigationStateSaga from 'src/redux/global/sagas/update-navigation-state-saga';
import loadWorkspaceSuccessSaga from 'src/redux/workspaces/sagas/load-workspace-success-saga';
import cacheRecentlyViewedWorkspaceSaga from 'src/redux/workspaces/sagas/cache-recently-viewed-workspace-saga';
import unloadRepositorySaga from './unload-repository-saga';
import fetchActionSaga, { fetchLatestActionSaga } from './fetch-action-saga';
import loadRepositorySuccessSaga from './load-repository-success-saga';
import hydrateFromLocalStorage from './hydrate-from-localstorage-saga';
import removeRecentlyViewedRepositorySaga from './remove-recently-viewed-repository-saga';
import cacheRecentlyViewedRepositorySaga from './cache-recently-viewed-repository-saga';
import loadRepositoryErrorSaga from './load-repository-error-saga';
import updateRepoNavMenuItemUrls from './update-repo-nav-menu-item-urls';

export { default as bufferEvery } from './buffer-every';

export default function* rootSaga() {
  yield all([
    updateRepoNavMenuItemUrls(),
    bootstrapSaga(),
    pageVisibilitySaga(),
    commitListSagas(),
    pullRequestSagas(),
    pullRequestListSagas(),
    fetchActionSaga(),
    fetchLatestActionSaga(),
    loadRepositorySuccessSaga(),
    loadWorkspaceSuccessSaga(),
    loadRepositoryErrorSaga(),
    unloadRepositorySaga(),
    cacheRecentlyViewedRepositorySaga(),
    cacheRecentlyViewedWorkspaceSaga(),
    removeRecentlyViewedRepositorySaga(),
    hydrateFromLocalStorage(),
    sourceSagas(),
    toggleRepositoryWatch(),
    toggleSidebarSaga(),
    branchesSagas(),
    createBranchSagas(),
    dashboardRepositoryBuildStatusesSagas(),
    offlineSaga(),
    searchSagas(),
    toggleNavigationSaga(),
    drawerSagas(),
    profileRepositoriesSagas(),
    jiraSagas(),
    pullRequestSettingsSagas(),
    takeLatest(UPDATE_SIDEBAR_STATE, updateSidebarStateSaga),
    takeLatest(UPDATE_NAVIGATION_STATE, updateNavigationStateSaga),
    takeLatest(SCROLL_TO, scrollToSaga),
  ]);
}

import { takeLatest, put, call, select, all } from 'redux-saga/effects';
import { fetchAction } from 'src/redux/actions';
import urls from 'src/urls/global';

import {
  getIsSearchDrawerOpen,
  getHasLoadedIssues,
  getIsLoadingIssues,
  getHasLoadedPullRequests,
  getIsLoadingPullRequests,
  getHasLoadedRepositories,
  getIsLoadingRepositories,
} from 'src/selectors/global-selectors';
import { getCurrentUserIsAnonymous } from 'src/selectors/user-selectors';
import {
  publishFact,
  publishScreenEvent,
  publishUiEvent,
} from 'src/utils/analytics/publish';
import { ToggleSearchDrawerFact } from 'src/sections/global/facts';
import {
  TOGGLE_CREATE_DRAWER,
  SEARCH_DRAWER_INIT,
  TOGGLE_SEARCH_DRAWER,
  LoadIssues,
  LoadPullRequests,
  LoadRepositories,
} from '../actions';

export function* loadAfterSearchDrawerInit() {
  const isAnonymousUser = yield select(getCurrentUserIsAnonymous);

  // for anonymous users we do not need to load search results for repos, issues, and PRs
  if (isAnonymousUser) {
    return;
  }

  const hasLoadedIssues = yield select(getHasLoadedIssues);
  const isLoadingIssues = yield select(getIsLoadingIssues);
  const hasLoadedPullRequests = yield select(getHasLoadedPullRequests);
  const isLoadingPullRequests = yield select(getIsLoadingPullRequests);
  const hasLoadedRepositories = yield select(getHasLoadedRepositories);
  const isLoadingRepositories = yield select(getIsLoadingRepositories);

  if (!hasLoadedIssues && !isLoadingIssues) {
    yield put(
      fetchAction(LoadIssues, {
        url: `${urls.api.internal.issues()}`,
      })
    );
  }

  if (!hasLoadedPullRequests && !isLoadingPullRequests) {
    yield put(
      fetchAction(LoadPullRequests, {
        url: `${urls.api.internal.pullRequests()}`,
        takeLatest: true,
      })
    );
  }

  if (!hasLoadedRepositories && !isLoadingRepositories) {
    yield put(
      fetchAction(LoadRepositories, {
        url: `${urls.api.internal.repositories()}`,
      })
    );
  }
}

export function* toggleSearchDrawer() {
  const isSearchDrawerOpen = yield select(getIsSearchDrawerOpen);

  yield call(
    publishFact,
    new ToggleSearchDrawerFact({
      action: isSearchDrawerOpen ? 'opened' : 'closed',
    })
  );

  yield call(publishUiEvent, {
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: `searchDrawer${isSearchDrawerOpen ? 'Opened' : 'Closed'}`,
    source: 'navigation',
  });

  if (isSearchDrawerOpen) {
    yield call(publishScreenEvent, 'globalSearchDrawer');
  }
}

// @ts-ignore TODO: fix noImplicitAny error here
export function* toggleCreateDrawer(action) {
  const { payload } = action;
  if (payload) {
    yield call(publishScreenEvent, 'globalCreateDrawer');
  }
}

function* drawerSagas() {
  yield all([
    takeLatest(SEARCH_DRAWER_INIT, loadAfterSearchDrawerInit),
    takeLatest(TOGGLE_SEARCH_DRAWER, toggleSearchDrawer),
    takeLatest(TOGGLE_CREATE_DRAWER, toggleCreateDrawer),
  ]);
}

export default drawerSagas;

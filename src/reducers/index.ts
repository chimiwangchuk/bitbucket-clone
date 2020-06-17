import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { cacheReducer } from 'src/redux/cache';
import { BucketState } from 'src/types/state';
import favicon from 'src/redux/favicon';
import { reducer as keyboardShortcuts } from 'src/redux/keyboard-shortcuts';
import { reducer as flagsReducer } from 'src/redux/flags';
import { reducer as sidebar } from 'src/redux/sidebar';
import global from 'src/redux/global/reducer';
import search from 'src/redux/search/reducer';
import dashboard from 'src/redux/dashboard/reducers';
import profile from 'src/redux/profile/reducer';
import prCommits from 'src/redux/pr-commits/reducer';
import { reducer as pullRequestSettings } from 'src/redux/pull-request-settings';
import jira from 'src/redux/jira/reducers';
import createBranch from 'src/redux/create-branch';
import { reducer as recentlyViewedRepositories } from 'src/redux/recently-viewed-repositories';
import repository from '../sections/repository/reducers';
import entities from './entities';
import recentlyViewedWorkspaces from './recently-viewed-workspaces';

export default combineReducers<BucketState>({
  dashboard,
  entities,
  favicon,
  flags: flagsReducer,
  // @ts-ignore Unsure what redux-form + redux wants here
  form: formReducer,
  global,
  keyboardShortcuts,
  recentlyViewedRepositories,
  recentlyViewedWorkspaces,
  repository,
  search,
  sidebar,
  createBranch,
  cache: cacheReducer,
  profile,
  prCommits,
  pullRequestSettings,
  jira,
});

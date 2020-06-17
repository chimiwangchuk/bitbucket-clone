import { BucketState } from 'src/types/state';

export const getDashboard = (state: BucketState) => state.dashboard;
export const getEntities = (state: BucketState) => state.entities;
export const getGlobal = (state: BucketState) => state.global;
export const getKeyboardShortcuts = (state: BucketState) =>
  state.keyboardShortcuts;
export const getRecentlyViewedRepositoriesKeys = (state: BucketState) =>
  state.recentlyViewedRepositories;
export const getRepository = (state: BucketState) => state.repository;
export const getRecentlyViewedWorkspacesKeys = (state: BucketState) =>
  state.recentlyViewedWorkspaces;
export const getSearch = (state: BucketState) => state.search;
export const getJiraSlice = (state: BucketState) => state.jira;
